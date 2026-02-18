"use client";

import { Moon, Zap, Flame, Hexagon, Leaf } from "lucide-react";
import { useState } from "react";

const THEMES = {
    midnight: {
        label: "Midnight (Black)",
        colors: {
            "--bg-0": "#050505",
            "--bg-1": "#0a0a0a",
            "--panel": "#111111",
            "--panel-2": "#1a1a1a",
            "--stroke": "#333333",
            "--text": "#ffffff",
            "--text-secondary": "#cccccc",
            "--blue": "#0056b3",
            "--color-vermilion-500": "#0056b3",
            "--grid-color": "rgba(255, 255, 255, 0.15)", // White/Grey grid
        }
    },
    "neon-blue": {
        label: "Neon Cyan",
        colors: {
            "--bg-0": "#05000a",
            "--bg-1": "#080214",
            "--panel": "#0f0529",
            "--panel-2": "#1a0b2e",
            "--stroke": "#00f3ff",
            "--text": "#e0f2fe",
            "--text-secondary": "#94a3b8",
            "--blue": "#00f3ff",
            "--color-vermilion-500": "#00f3ff",
            "--color-primary": "#00f3ff",
            "--grid-color": "rgba(0, 243, 255, 0.3)", // Cyan grid
        }
    },
    "neon-red": {
        label: "Neon Vermilion",
        colors: {
            "--bg-0": "#0a0000",
            "--bg-1": "#140202",
            "--panel": "#260505",
            "--panel-2": "#3b0a0a",
            "--stroke": "#ff3d2e",
            "--text": "#ffe4e1",
            "--text-secondary": "#fca5a5",
            "--blue": "#ff3d2e",
            "--color-vermilion-500": "#ff3d2e",
            "--color-primary": "#ff3d2e",
            "--grid-color": "rgba(255, 61, 46, 0.3)", // Red grid
        }
    },
    "neon-purple": {
        label: "Neon Synthetic",
        colors: {
            "--bg-0": "#05010a",
            "--bg-1": "#0f021f",
            "--panel": "#1a0533",
            "--panel-2": "#2d0a52",
            "--stroke": "#d946ef",
            "--text": "#f5d0fe",
            "--text-secondary": "#e879f9",
            "--blue": "#d946ef",
            "--color-vermilion-500": "#d946ef",
            "--color-primary": "#d946ef",
            "--grid-color": "rgba(217, 70, 239, 0.3)", // Purple grid
        }
    },
    "neon-green": {
        label: "Neon Matrix",
        colors: {
            "--bg-0": "#000a00",
            "--bg-1": "#021402",
            "--panel": "#051a05",
            "--panel-2": "#0a2e0a",
            "--stroke": "#22c55e",
            "--text": "#dcfce7",
            "--text-secondary": "#86efac",
            "--blue": "#22c55e",
            "--color-vermilion-500": "#22c55e",
            "--color-primary": "#22c55e",
            "--grid-color": "rgba(34, 197, 94, 0.3)", // Green grid
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
                title="Midnight (Default)"
            >
                <Moon className="w-4 h-4" />
            </button>

            {/* Divider */}
            <div className="w-px h-4 bg-[color:var(--stroke)] mx-1" />

            <button
                onClick={() => applyTheme("neon-blue")}
                className={`p-1.5 rounded-md transition-all ${currentTheme === "neon-blue" ? "bg-[rgba(0,243,255,0.1)] text-[#00f3ff] shadow-[0_0_10px_rgba(0,243,255,0.3)] border border-[#00f3ff]" : "text-[color:var(--text-secondary)] hover:text-[#00f3ff]"}`}
                title="Neon Cyan"
            >
                <Zap className="w-4 h-4" />
            </button>
            <button
                onClick={() => applyTheme("neon-red")}
                className={`p-1.5 rounded-md transition-all ${currentTheme === "neon-red" ? "bg-[rgba(255,61,46,0.1)] text-[#ff3d2e] shadow-[0_0_10px_rgba(255,61,46,0.3)] border border-[#ff3d2e]" : "text-[color:var(--text-secondary)] hover:text-[#ff3d2e]"}`}
                title="Neon Vermilion"
            >
                <Flame className="w-4 h-4" />
            </button>
            <button
                onClick={() => applyTheme("neon-purple")}
                className={`p-1.5 rounded-md transition-all ${currentTheme === "neon-purple" ? "bg-[rgba(217,70,239,0.1)] text-[#d946ef] shadow-[0_0_10px_rgba(217,70,239,0.3)] border border-[#d946ef]" : "text-[color:var(--text-secondary)] hover:text-[#d946ef]"}`}
                title="Neon Purple"
            >
                <Hexagon className="w-4 h-4" />
            </button>
            <button
                onClick={() => applyTheme("neon-green")}
                className={`p-1.5 rounded-md transition-all ${currentTheme === "neon-green" ? "bg-[rgba(34,197,94,0.1)] text-[#22c55e] shadow-[0_0_10px_rgba(34,197,94,0.3)] border border-[#22c55e]" : "text-[color:var(--text-secondary)] hover:text-[#22c55e]"}`}
                title="Neon Matrix"
            >
                <Leaf className="w-4 h-4" />
            </button>
        </div>
    );
}
