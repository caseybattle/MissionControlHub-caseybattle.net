
'use client';

import { useState, useEffect, useRef } from 'react';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { Send, User, Bot, Smile } from 'lucide-react';

// Initialize Firebase (Client Side)
// We assume parent component or context initializes app, but for safety in this standalone component/view:
// We'll reuse the config if we can, or just expect the app is initialized.
// Since we are in Next.js Client Component, we can just use `getFirestore()`.
// If app not initialized, it throws. But `page.tsx` or `layout.tsx` likely inits it?
// Actually, `lib/firestore.ts` initializes it. We should use `db` from there if exported, 
// or `getFirestore()` if we trust standard init.
// Let's import `db` from `@/lib/firestore`.

import { db } from '@/lib/firestore';

interface Message {
    id: string;
    text: string;
    sender: string;
    senderType?: string;
    createdAt: Timestamp;
}

export default function Inbox() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Subscribe to messages
    useEffect(() => {
        const q = query(collection(db, 'messages'), orderBy('createdAt', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Message[];
            setMessages(msgs);
            // Scroll to bottom
            setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        });
        return () => unsubscribe();
    }, []);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const isAntigravityCalled = newMessage.includes('@Antigravity') || newMessage.includes('@antigravity');

        try {
            await addDoc(collection(db, 'messages'), {
                conversationId: 'main',
                text: newMessage,
                sender: 'Commander',
                senderType: 'human',
                source: 'web',
                channel: 'web',
                createdAt: serverTimestamp(),

                routing: {
                    needsFredReply: true,
                    forwardToTelegram: false,
                    forAntigravity: isAntigravityCalled
                },
                state: {
                    handledByFred: false,
                    processing: false,
                    attempts: 0
                }
            });
            setNewMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#0a0a0a] rounded-xl border border-zinc-800 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-zinc-800 bg-[#111] flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="text-vermilion-500">Team Inbox</span>
                </h2>
                <span className="text-xs text-zinc-500">Connected to HQ</span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.length === 0 && (
                    <div className="text-center text-zinc-600 mt-10">
                        <p>No messages yet.</p>
                        <p className="text-xs">Start the conversation with Fred & Co.</p>
                    </div>
                )}

                {messages.map((msg) => {
                    const isUser = msg.senderType === 'human' || ['user', 'commander', 'casey'].includes((msg.sender || '').toLowerCase());
                    return (
                        <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex gap-2 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                                {/* Avatar */}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-vermilion-500' : 'bg-zinc-700'
                                    }`}>
                                    {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-zinc-300" />}
                                </div>

                                {/* Bubble */}
                                <div className={`p-3 rounded-2xl text-sm ${isUser
                                    ? 'bg-vermilion-500/10 text-vermilion-100 border border-vermilion-500/20 rounded-tr-none'
                                    : 'bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-tl-none'
                                    }`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-[10px] font-bold uppercase ${isUser ? 'text-vermilion-400' : 'text-zinc-400'}`}>
                                            {isUser ? 'Me' : msg.sender}
                                        </span>
                                        {msg.createdAt && (
                                            <span className="text-[10px] opacity-50">
                                                {new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        )}
                                    </div>
                                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-[#111] border-t border-zinc-800 flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message to the team..."
                    className="flex-1 bg-[#0a0a0a] border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-vermilion-500 focus:ring-1 focus:ring-vermilion-500 transition-all"
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="p-2 bg-vermilion-500 text-white rounded-lg hover:bg-vermilion-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
}
