'use client';

import { useAuth } from '@/lib/auth-context';
import { Rocket } from 'lucide-react';

export default function LoginScreen() {
    const { signInWithGoogle, signInAsGuest } = useAuth();

    return (
        <div
            className="flex items-center justify-center min-h-screen relative overflow-hidden"
            style={{ backgroundColor: 'var(--color-background)' }}
            suppressHydrationWarning
        >
            {/* Background grid */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 61, 46, 0.04) 1px, transparent 0)`,
                    backgroundSize: '40px 40px',
                }}
            />

            {/* Top-right glow */}
            <div
                className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none"
                style={{
                    background: 'radial-gradient(circle, rgba(255, 61, 46, 0.08) 0%, transparent 70%)',
                    filter: 'blur(100px)',
                }}
            />

            {/* Bottom-left glow */}
            <div
                className="absolute bottom-0 left-0 w-[500px] h-[500px] pointer-events-none"
                style={{
                    background: 'radial-gradient(circle, rgba(255, 61, 46, 0.05) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                }}
            />

            {/* Login Card */}
            <div
                className="relative text-center max-w-md w-full mx-4 rounded-2xl p-10"
                style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)',
                    backdropFilter: 'blur(16px)',
                    border: '1.5px solid var(--color-border)',
                    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 61, 46, 0.08)',
                    animation: 'slideUp 0.5s ease-out',
                }}
            >
                {/* Logo */}
                <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255, 61, 46, 0.15), rgba(255, 61, 46, 0.05))',
                        boxShadow: '0 0 40px rgba(255, 61, 46, 0.15)',
                    }}
                >
                    <Rocket className="w-10 h-10" style={{ color: 'var(--color-vermilion-500)' }} />
                </div>

                {/* Title */}
                <h1
                    className="text-4xl font-bold mb-2 bg-clip-text text-transparent"
                    style={{
                        backgroundImage: 'linear-gradient(135deg, var(--color-vermilion-400), var(--color-vermilion-600))',
                    }}
                >
                    Mission Control
                </h1>
                <p className="mb-8" style={{ color: 'var(--color-text-secondary)' }}>
                    Your personal command center for ideas, projects, and builds
                </p>

                {/* Sign In with Google */}
                <button
                    onClick={signInWithGoogle}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 mb-3"
                    style={{
                        background: 'linear-gradient(135deg, #ff5545 0%, #ff3322 50%, #e81600 100%)',
                        color: '#fff',
                        border: '1px solid rgba(255, 120, 100, 0.5)',
                        boxShadow: '0 4px 24px rgba(255, 61, 46, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 8px 48px rgba(255, 61, 46, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                        e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 4px 24px rgba(255, 61, 46, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.25)';
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                    Sign in with Google
                </button>

                {/* Quick Access / Guest */}
                <button
                    onClick={signInAsGuest}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium transition-all duration-300"
                    style={{
                        backgroundColor: 'var(--color-surface-elevated)',
                        color: 'var(--color-text-secondary)',
                        border: '1.5px solid var(--color-border)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-vermilion-400)';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(255, 61, 46, 0.12)';
                        e.currentTarget.style.color = 'var(--color-text-primary)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-border)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.color = 'var(--color-text-secondary)';
                    }}
                >
                    🚀 Quick Launch (Guest Mode)
                </button>

                <p className="mt-6 text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                    Secure sign-in • Data stored in Firebase Cloud
                </p>
            </div>
        </div>
    );
}
