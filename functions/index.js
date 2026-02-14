
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Telegraf } = require('telegraf');
const { GoogleGenerativeAI } = require("@google/generative-ai");

admin.initializeApp();
const db = admin.firestore();

// --- 1. CONFIGURATION ---
const TELEGRAM_TOKEN = '8064212726:AAETMa6mpvAIpFLqcUtYN24E1KdB4ZrFwvM';
const GEMINI_KEY = 'AIzaSyCgQZRnxwvWw5kVhXx7dDQ8MtGnfAHEP-4';

const bot = new Telegraf(TELEGRAM_TOKEN);
const genAI = new GoogleGenerativeAI(GEMINI_KEY);

const SYSTEM_PROMPT = `
You are Antigravity, mission control AI.
Respond concisely.
If user asks for help, provide it.
If explicitly mentioned or routing.forAntigravity=true, reply.
`;

// Helper to get Chat ID
async function getChatId(msgChatId) {
    if (msgChatId) return msgChatId;
    const config = await db.collection('system').doc('telegram_config').get();
    return config.exists ? config.data().chatId : null;
}

// Helper to Forward to Telegram
async function forwardToTelegram(msg) {
    const chatId = await getChatId(msg.chatId);
    if (!chatId) return;
    try {
        await bot.telegram.sendMessage(chatId, `<b>${msg.sender}:</b> ${msg.text}`, { parse_mode: 'HTML' });
    } catch (e) {
        console.error('Telegram send error:', e);
    }
}

// Helper to Handle Antigravity Reply
async function handleAntigravityReply(msg, msgId) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
                { role: "model", parts: [{ text: "Antigravity active." }] }
            ]
        });

        const result = await chat.sendMessage(msg.text);
        const replyText = result.response.text();
        const chatId = await getChatId(msg.chatId);

        // Write Reply
        await db.collection('messages').add({
            conversationId: msg.conversationId || "main",
            text: replyText,
            sender: 'Antigravity',
            senderType: 'agent',
            source: 'system',
            channel: 'web',
            chatId: chatId, // Maintain chat context
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            replyToId: msgId,
            routing: {
                needsFredReply: false,
                forwardToTelegram: true, // Forward AI reply to Telegram
                forAntigravity: false
            },
            state: { handledByFred: true, responsePosted: true }
        });
    } catch (e) {
        console.error('Gemini error:', e);
    }
}

// --- 2. TELEGRAM WEBHOOK (Ingest) ---
bot.telegram.setWebhook('https://us-central1-mission-ctrl-hub-2026.cloudfunctions.net/telegramWebhook');

exports.telegramWebhook = functions.https.onRequest(async (req, res) => {
    try {
        await bot.handleUpdate(req.body, res);
    } catch (err) {
        console.error('Webhook processing error:', err);
        res.status(500).send('Error');
    }
});

bot.on('text', async (ctx) => {
    const { message } = ctx;
    const { from, chat, text } = message;

    if (!text) return;

    try {
        // Auto-save group Chat ID
        if (chat.type === 'group' || chat.type === 'supergroup') {
            await db.collection('system').doc('telegram_config').set({
                chatId: String(chat.id),
                chatTitle: chat.title || 'Group Chat',
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        }

        const isAntigravityCalled = text.includes('@Antigravity') || text.includes('@antigravity');

        const messageData = {
            conversationId: "main",
            text: text,
            sender: from.username || from.first_name || 'Anonymous',
            senderType: 'human', // Telegram user
            source: 'telegram',
            channel: 'telegram',
            chatId: String(chat.id),
            createdAt: admin.firestore.FieldValue.serverTimestamp(),

            routing: {
                needsFredReply: true, // Default: allow Fred to pick up
                forwardToTelegram: false, // Don't echo back
                forAntigravity: isAntigravityCalled
            },

            state: {
                handledByFred: false,
                processing: false,
                attempts: 0
            }
        };

        await db.collection('messages').add(messageData);

    } catch (err) {
        console.error('Telegram ingest error:', err);
    }
});

// --- 3. CORE PROCESSING (Router) ---
exports.onMessageCreate = functions.firestore
    .document('messages/{msgId}')
    .onCreate(async (snap, context) => {
        const msg = snap.data();
        const msgId = context.params.msgId;

        // A. Agent Handling (Only Forwarding)
        if (msg.senderType === 'agent') {
            if (msg.routing?.forwardToTelegram) {
                await forwardToTelegram(msg);
            }
            return null; // Stop processing agents (no loops)
        }

        // A. Human Handling
        if (msg.state?.processing || msg.state?.handledByFred) return null;

        // B. Forward to Telegram
        let shouldForward = msg.routing?.forwardToTelegram;

        // Fallback for legacy messages
        if (shouldForward === undefined && msg.source === 'web') {
            const SKIPPED = ['Casey', 'Commander', 'User', 'user'];
            if (SKIPPED.includes(msg.sender)) shouldForward = false; // Stop echo
            else shouldForward = true;
        }

        if (shouldForward) {
            await forwardToTelegram(msg);
        }

        // C. Route to Antigravity (Gemini)
        if (msg.routing?.forAntigravity || msg.text?.includes('@Antigravity')) {
            await handleAntigravityReply(msg, msgId);
        }

        // D. Route to Fred (Job Queue)
        if (msg.routing?.needsFredReply) {
            await db.collection('jobs').add({
                type: 'fred_reply',
                messageId: `messages/${msgId}`,
                conversationId: msg.conversationId || 'main',
                status: 'queued',
                priority: 5,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                attempts: 0
            });
        }
    });

// --- 4. FRED WORKER (Job Processor) ---
const FRED_PROMPT = `
You are Fred, a sharp and resourceful AI operations agent working inside Mission Control.
You report to Commander Casey. You are practical, direct, and solution-oriented.
When given a task or question, you:
- Acknowledge what was asked
- Provide a clear, actionable answer or status update
- Flag blockers or unknowns honestly
- Keep responses concise (2-4 sentences max)
- Use a professional but friendly tone — think senior engineer, not corporate bot

You are NOT Antigravity (that's a separate agent). You are Fred.
If you don't know the answer, say so and suggest a next step.
`;

exports.onJobCreate = functions.firestore
    .document('jobs/{jobId}')
    .onCreate(async (snap, context) => {
        const job = snap.data();
        const jobId = context.params.jobId;
        const jobRef = snap.ref;

        // Only process fred_reply jobs
        if (job.type !== 'fred_reply') return null;
        if (job.status !== 'queued') return null;

        // Extract message path (e.g. "messages/abc123")
        const msgPath = job.messageId;
        if (!msgPath) {
            await jobRef.update({ status: 'failed', error: 'Missing messageId' });
            return null;
        }

        const msgRef = db.doc(msgPath);

        try {
            // --- STEP 1: Lock the original message via transaction ---
            let msgData = null;
            await db.runTransaction(async (tx) => {
                const msgSnap = await tx.get(msgRef);
                if (!msgSnap.exists) throw new Error('Original message not found');

                const cur = msgSnap.data();
                // Idempotency: skip if already processing or handled
                if (cur.state?.processing || cur.state?.handledByFred) {
                    throw new Error('ALREADY_HANDLED');
                }

                // Lock it
                tx.update(msgRef, {
                    'state.processing': true,
                    'state.attempts': (cur.state?.attempts || 0) + 1,
                    'state.lastAttemptAt': admin.firestore.FieldValue.serverTimestamp()
                });

                msgData = cur;
            });

            if (!msgData) {
                await jobRef.update({ status: 'failed', error: 'Could not read message' });
                return null;
            }

            // Update job to running
            await jobRef.update({
                status: 'running',
                startedAt: admin.firestore.FieldValue.serverTimestamp()
            });

            // --- STEP 2: Generate Fred's reply via Gemini ---
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const chat = model.startChat({
                history: [
                    { role: "user", parts: [{ text: FRED_PROMPT }] },
                    { role: "model", parts: [{ text: "Fred here. Ready to work." }] }
                ]
            });

            const result = await chat.sendMessage(msgData.text);
            const fredReply = result.response.text();
            const chatId = await getChatId(msgData.chatId);

            // --- STEP 3: Write Fred's reply as a new message doc ---
            await db.collection('messages').add({
                conversationId: msgData.conversationId || 'main',
                text: fredReply,
                sender: 'Fred',
                senderType: 'agent',
                source: 'fred',
                channel: 'web',
                chatId: chatId,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                replyToId: msgPath.split('/')[1], // Extract doc ID
                routing: {
                    needsFredReply: false,
                    forwardToTelegram: true, // Forward Fred's reply to Telegram
                    forAntigravity: false
                },
                state: {
                    handledByFred: true,
                    responsePosted: true,
                    processing: false,
                    error: null,
                    attempts: 0
                }
            });

            // --- STEP 4: Update original message state ---
            await msgRef.update({
                'state.handledByFred': true,
                'state.responsePosted': true,
                'state.processing': false,
                'state.error': null
            });

            // --- STEP 5: Mark job as done ---
            await jobRef.update({
                status: 'done',
                finishedAt: admin.firestore.FieldValue.serverTimestamp()
            });

            console.log(`Fred processed job ${jobId} for message ${msgPath}`);

        } catch (e) {
            if (e.message === 'ALREADY_HANDLED') {
                await jobRef.update({ status: 'done', finishedAt: admin.firestore.FieldValue.serverTimestamp() });
                return null;
            }

            console.error(`Fred worker error on job ${jobId}:`, e);

            // Unlock original message on failure
            try { await msgRef.update({ 'state.processing': false, 'state.error': String(e) }); } catch (_) { }

            // Check retry policy
            const attempts = (job.attempts || 0) + 1;
            if (attempts >= 3) {
                await jobRef.update({
                    status: 'deadletter',
                    error: String(e),
                    attempts: attempts
                });
            } else {
                await jobRef.update({
                    status: 'failed',
                    error: String(e),
                    attempts: attempts
                });
            }
        }
    });
