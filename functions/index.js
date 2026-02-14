
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Telegraf } = require('telegraf');
const { GoogleGenerativeAI } = require("@google/generative-ai");

admin.initializeApp();
const db = admin.firestore();

// Initialize Bot
const bot = new Telegraf('8064212726:AAETMa6mpvAIpFLqcUtYN24E1KdB4ZrFwvM');
// Initialize Gemini AI with Key
const genAI = new GoogleGenerativeAI('AIzaSyCgQZRnxwvWw5kVhXx7dDQ8MtGnfAHEP-4');

const SYSTEM_PROMPT = `
You are Antigravity, an intelligent AI coding assistant and mission control operator.
Your role is to help the user manage projects, track tasks, and solve coding problems.
Provide concise, actionable, and friendly responses. 
You are communicating via Telegram, so keep messages short and direct.
If asked to DO something (e.g. "deploy", "fix bug"), acknowledge the request and say you've logged it (simulating action).
Maintain a professional yet engaging tone.
`;

bot.telegram.setWebhook('https://us-central1-mission-ctrl-hub-2026.cloudfunctions.net/telegramWebhook');

// Middleware to log updates
bot.use(async (ctx, next) => {
    console.log('Received update:', JSON.stringify(ctx.update, null, 2));
    await next();
});

// Handle text messages
bot.on('text', async (ctx) => {
    const { message } = ctx;
    const { from, chat, text } = message;

    if (!text) return;

    try {
        // 1. Auto-save group Chat ID
        if (chat.type === 'group' || chat.type === 'supergroup') {
            const configRef = db.collection('system').doc('telegram_config');
            await configRef.set({
                chatId: String(chat.id),
                chatTitle: chat.title || 'Group Chat',
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        }

        // 2. Save User Message to Firestore
        await db.collection('messages').add({
            text: text,
            sender: from.username || from.first_name || 'Anonymous',
            senderId: String(from.id),
            chatId: String(chat.id),
            source: 'telegram',
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // 3. Generate AI Reply
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const chatSession = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: SYSTEM_PROMPT }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am Antigravity. Ready to assist." }],
                },
            ],
        });

        const result = await chatSession.sendMessage(text);
        const responseText = result.response.text();

        // 4. Send Reply to Telegram
        await ctx.reply(responseText);

        // 5. Save AI Reply to Firestore (Inbox)
        await db.collection('messages').add({
            text: responseText,
            sender: 'Antigravity',
            senderId: 'bot',
            chatId: String(chat.id),
            source: 'system',
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

    } catch (error) {
        console.error('Error handling Telegram message:', error);
    }
});

exports.telegramWebhook = functions.https.onRequest(async (req, res) => {
    try {
        await bot.handleUpdate(req.body, res);
    } catch (err) {
        console.error('Webhook processing error:', err);
        res.status(500).send('Error');
    }
});

exports.onMessageCreate = functions.firestore
    .document('messages/{msgId}')
    .onCreate(async (snap, context) => {
        const msg = snap.data();

        // Prevent loops
        if (msg.source === 'telegram' || msg.source === 'system') return null;

        let chatId = msg.chatId;

        if (!chatId) {
            const configDoc = await db.collection('system').doc('telegram_config').get();
            if (configDoc.exists) {
                chatId = configDoc.data().chatId;
            }
        }

        if (!chatId) {
            const history = await db.collection('messages')
                .where('source', '==', 'telegram')
                .orderBy('createdAt', 'desc')
                .limit(1)
                .get();
            if (!history.empty) {
                chatId = history.docs[0].data().chatId;
            }
        }

        if (!chatId) return null;

        try {
            const senderName = msg.sender === 'user' ? 'Mission Control' : msg.sender;
            await bot.telegram.sendMessage(chatId, `<b>${senderName}:</b> ${msg.text}`, { parse_mode: 'HTML' });
        } catch (err) {
            console.error('Error sending to Telegram:', err);
        }
    });
