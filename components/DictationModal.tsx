'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, X, Copy, Check } from 'lucide-react';

interface DictationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DictationModal({ isOpen, onClose }: DictationModalProps) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [interimText, setInterimText] = useState('');
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (!isOpen) {
            stopListening();
            return;
        }
    }, [isOpen]);

    const startListening = () => {
        setError(null);
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setError('Speech recognition is not supported in this browser. Try Chrome.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
            let final = '';
            let interim = '';
            for (let i = 0; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    final += event.results[i][0].transcript + ' ';
                } else {
                    interim += event.results[i][0].transcript;
                }
            }
            setTranscript(prev => prev + final);
            setInterimText(interim);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'not-allowed') {
                setError('Microphone access denied. Please allow microphone in browser settings.');
            } else {
                setError(`Error: ${event.error}`);
            }
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
            setInterimText('');
        };

        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        setIsListening(false);
        setInterimText('');
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(transcript);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setTranscript('');
        setInterimText('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-lg mx-4 rounded-2xl border border-zinc-700 bg-[#111] shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Mic className="w-5 h-5 text-vermilion-500" />
                        Voice Dictation
                    </h2>
                    <button onClick={onClose} className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4">
                    {error && (
                        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Transcript Area */}
                    <div className="bg-[#0a0a0a] border border-zinc-800 rounded-xl p-4 min-h-[150px] max-h-[300px] overflow-y-auto">
                        {transcript || interimText ? (
                            <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">
                                {transcript}
                                {interimText && <span className="text-zinc-500 italic">{interimText}</span>}
                            </p>
                        ) : (
                            <p className="text-sm text-zinc-600 italic">
                                {isListening ? 'Listening... speak now.' : 'Press the microphone button to start dictating.'}
                            </p>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={isListening ? stopListening : startListening}
                            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${isListening
                                    ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-red-500/30'
                                    : 'bg-vermilion-500 hover:bg-vermilion-600 shadow-vermilion-500/20'
                                }`}
                        >
                            {isListening
                                ? <MicOff className="w-7 h-7 text-white" />
                                : <Mic className="w-7 h-7 text-white" />
                            }
                        </button>
                    </div>
                    <p className="text-center text-xs text-zinc-600">
                        {isListening ? 'Tap to stop recording' : 'Tap to start dictating'}
                    </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-800 bg-[#0d0d0d]">
                    <button
                        onClick={handleClear}
                        disabled={!transcript}
                        className="text-xs text-zinc-500 hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        Clear All
                    </button>
                    <button
                        onClick={handleCopy}
                        disabled={!transcript}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-vermilion-500/10 text-vermilion-400 hover:bg-vermilion-500/20 border border-vermilion-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy Text'}
                    </button>
                </div>
            </div>
        </div>
    );
}
