"use client";

import { Monitor, Moon, Cloud, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const THEMES = {
    midnight: {
        label: "Midnight (Black)",
        colors: {
            "--bg-0": "#050505",
            "--bg-1": "#0a0a0a",
            "--panel": "#111111",
            "--panel-2": "#1a1a1a",
            "--stroke": "#333333", // Brighter stroke
            "--text": "#ffffff", // Pure white text
            "--text-secondary": "#cccccc", // Brighter secondary
            "--blue": "#0056b3", // User requested blue
            "--color-vermilion-500": "#0056b3",
        }
    },
    navy: {
        label: "Abyss (Deep Navy)",
        colors: {
            "--bg-0": "#020617", // Slate 950
            "--bg-1": "#0f172a", // Slate 900
            "--panel": "#1e293b", // Slate 800
            "--panel-2": "#334155", // Slate 700
            "--stroke": "#1e293b", // Slate 800
            "--text": "#f8fafc", // Slate 50
            "--text-secondary": "#94a3b8", // Slate 400
            "--blue": "#38bdf8", // Sky 400
            "--color-vermilion-500": "#38bdf8",
        }
    },
    neon: {
        label: "Neon (Cyberpunk)",
        colors: {
            "--bg-0": "#05000a", // Deep Void
            "--bg-1": "#120524", // Dark Violet
            "--panel": "#1a0b2e", // Deep Purple Panel
            "--panel-2": "#2d1b4e", // Lighter Violet
            "--stroke": "#4c1d95", // Violet Stroke
            "--text": "#e0e0e0", // Off-white
            "--text-secondary": "#a78bfa", // Lavendar
            "--blue": "#00f3ff", // Cyan Neon
            "--color-vermilion-500": "#ff00ff", // Magenta Neon
            "--color-primary": "#00f3ff",
            "--color-secondary": "#ff00ff",
        }
    }
};

type ThemeKey = keyof typeof THEMES;

export function ThemeSwitcher() {
    const [currentTheme, setCurrentTheme] = useState<ThemeKey>("midnight");

    const applyTheme = (key: ThemeKey) => {
        const theme = THEMES[key];
        const root = document.documentElement;

        Object.entries(theme.colors).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });

        setCurrentTheme(key);
    };

    return (
        <div className="flex items-center gap-1 bg-[color:var(--panel)] p-1 rounded-lg border border-[color:var(--stroke)]">
            <button
                onClick={() => applyTheme("midnight")}
                className={`p-1.5 rounded-md transition-all ${currentTheme === "midnight" ? "bg-[color:var(--bg-1)] text-white shadow-sm" : "text-[color:var(--text-secondary)] hover:text-white"}`}
                title="Midnight"
            >
                <Moon className="w-4 h-4" />
            </button>
            <button
                onClick={() => applyTheme("navy")}
                className={`p-1.5 rounded-md transition-all ${currentTheme === "navy" ? "bg-[color:var(--bg-1)] text-white shadow-sm" : "text-[color:var(--text-secondary)] hover:text-white"}`}
                title="Abyss"
            >
                <Cloud className="w-4 h-4" />
            </button>
            <button
                onClick={() => applyTheme("neon")}
                className={`p-1.5 rounded-md transition-all ${currentTheme === "neon" ? "bg-[color:var(--bg-1)] text-[color:var(--blue)] shadow-sm border border-[color:var(--blue)]" : "text-[color:var(--text-secondary)] hover:text-white"}`}
                title="Neon"
            >
                <Zap className="w-4 h-4" />
            </button>
        </div>
    );
}
