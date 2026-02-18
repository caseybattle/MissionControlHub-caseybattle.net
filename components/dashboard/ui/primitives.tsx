import type { ReactNode } from "react";

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <div
            className={[
                "rounded-[var(--r)] border border-[color:var(--stroke)] shadow-[var(--shadow-soft)]",
                "bg-[color:var(--panel)]/80 backdrop-blur-md",
                className,
            ].join(" ")}
        >
            {children}
        </div>
    );
}

export function Hairline({ className = "" }: { className?: string }) {
    return <div className={["h-px w-full bg-[color:var(--stroke-2)]", className].join(" ")} />;
}

export function Dot({ color }: { color: "ok" | "idle" | "late" | "err" }) {
    const map: Record<typeof color, string> = {
        ok: "bg-[color:var(--ok)]",
        idle: "bg-[color:var(--idle)]",
        late: "bg-[color:var(--late)]",
        err: "bg-[color:var(--err)]",
    };
    return <span className={["inline-block h-2 w-2 rounded-full", map[color]].join(" ")} />;
}
