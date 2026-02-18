
'use client';

import { useEffect, useState } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import { onAuthStateChanged, signInWithPopup, User, signOut } from 'firebase/auth';
import { Lock, LogIn, ShieldCheck } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleLogin = async () => {
        setError(null);
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error: any) {
            console.error("Login failed:", error);
            setError(error?.message || "Login failed. Please try again.");

            // If popup is blocked or fails, suggest checking authorized domains
            if (error?.code === 'auth/unauthorized-domain') {
                setError("This domain is not authorized in Firebase. Please add 'caseybattle.net' to Authorized Domains in Firebase Console.");
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <ShieldCheck className="w-12 h-12 text-vermilion-500 opacity-50" />
                    <span className="text-zinc-500 text-sm font-medium tracking-widest uppercase">Authenticating...</span>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a] relative overflow-hidden">
                {/* Background Aesthetics */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-vermilion-500/10 blur-[120px] rounded-full" />
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)',
                            backgroundSize: '40px 40px'
                        }}
                    />
                </div>

                <div className="relative z-10 w-full max-w-md p-8 bg-zinc-900/50 border border-white/10 backdrop-blur-xl rounded-3xl shadow-2xl">
                    <div className="flex flex-col items-center text-center mb-10">
                        <div className="w-16 h-16 bg-vermilion-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(255,61,46,0.3)] mb-6">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Mission Control</h1>
                        <p className="text-zinc-400 text-sm">Authorized Access Only. Please sign in to enter HQ.</p>

                        {error && (
                            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-medium">
                                {error}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleLogin}
                        className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all active:scale-[0.98] group"
                    >
                        <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        Sign in with Google
                    </button>

                    <div className="mt-8 pt-8 border-t border-white/5 flex justify-center gap-6">
                        <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                            <span className="w-1 h-1 bg-green-500 rounded-full animate-ping" />
                            System Live
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                            <span className="w-1 h-1 bg-vermilion-500 rounded-full" />
                            Secure Layer v2.0
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Simple logout trigger for user visibility */}
            {children}
        </>
    );
}
