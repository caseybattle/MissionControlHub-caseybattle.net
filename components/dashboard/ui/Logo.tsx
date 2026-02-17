"use client";

export function Logo({ className = "w-6 h-6" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M2 17L12 22L22 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function BattleLabsLogo({ className = "w-6 h-6" }: { className?: string }) {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M12.0002 2.75L3.50024 7.25V16.75L12.0002 21.25L20.5002 16.75V7.25L12.0002 2.75Z"
                stroke="url(#paint0_linear)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M12.0002 8.75V15.25"
                stroke="url(#paint1_linear)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M8.75024 10.75L12.0002 12.75L15.2502 10.75"
                stroke="url(#paint2_linear)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <defs>
                <linearGradient
                    id="paint0_linear"
                    x1="12.0002"
                    y1="2.75"
                    x2="12.0002"
                    y2="21.25"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#3B82F6" />
                    <stop offset="1" stopColor="#2563EB" />
                </linearGradient>
                <linearGradient
                    id="paint1_linear"
                    x1="12.5002"
                    y1="8.75"
                    x2="12.5002"
                    y2="15.25"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#60A5FA" />
                    <stop offset="1" stopColor="#3B82F6" />
                </linearGradient>
                <linearGradient
                    id="paint2_linear"
                    x1="12.0002"
                    y1="10.75"
                    x2="12.0002"
                    y2="12.75"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#60A5FA" />
                    <stop offset="1" stopColor="#3B82F6" />
                </linearGradient>
            </defs>
        </svg>
    );
}
