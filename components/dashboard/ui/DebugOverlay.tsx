"use client";

import { useEffect, useState } from "react";

export function DebugOverlay() {
    const [on, setOn] = useState(false);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === "o") setOn(v => !v);
            if (e.key === "Escape") setOn(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    if (process.env.NODE_ENV === 'production') return null;

    return (
        <div className="pointer-events-none fixed inset-0 z-[9999]">
            {on && (
                <img
                    src="/Openclaw dashboard.png"
                    alt=""
                    className="h-full w-full object-fill opacity-30"
                />
            )}
        </div>
    );
}
