"use client";

import React from "react";

export function PerspectiveGrid() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* 
         Standard 2D Grid - High Visibility Version 
         Refined to match Agon's original look but adapted for dark mode
      */}
            <div
                className="absolute inset-0 w-full h-full"
                style={{
                    backgroundImage: `
                linear-gradient(var(--grid-color) 1px, transparent 1px),
                linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)
            `,
                    backgroundSize: '40px 40px',
                    backgroundPosition: 'center top',
                    opacity: 1, // Opacity is now handled in the variable color definition
                }}
            />

            {/* Subtle Glow Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--grid-color)] to-transparent pointer-events-none opacity-10" />
        </div>
    );
}
