# App Fonts & Sizes

Here is the current font configuration for the Mission Control dashboard:

## Font Families Used
1.  **Geist Sans** (Main UI text)
    -   Variable: `--font-geist-sans`
    -   Usage: General body text, buttons, labels.
2.  **Geist Mono** (Code, numbers, technical data)
    -   Variable: `--font-geist-mono`
    -   Usage: Timestamps, version numbers, metrics.
3.  **Orbitron** (Headings, Logos)
    -   Variable: `--font-orbitron`
    -   Usage: "MISSION CONTROL" logo, section headers for a futuristic look.

## Font Sizes
-   **Base Size**: The application uses the browser default font size (**16px**) as the root (`1rem`).
-   **Scaling**: All other sizes are relative to this base using Tailwind utility classes:
    -   `text-xs` (0.75rem) = **12px** (Badges, meta text)
    -   `text-sm` (0.875rem) = **14px** (Sidebar items, buttons)
    -   `text-base` (1rem) = **16px** (Standard body text)
    -   `text-lg` (1.125rem) = **18px** (Headings)
    -   `text-xl` (1.25rem) = **20px** (Larger titles)

There is no custom global font size override in `globals.css`, so the sizing remains standard and accessible.
