import { Panel } from "./primitives";
import { tickerText } from "../data";
import { AlertTriangle } from "lucide-react";

export function AlertTicker() {
    return (
        <Panel className="h-[32px] bg-[color:var(--bg-1)] px-4 overflow-hidden">
            <div className="flex h-full items-center gap-3">
                <div className="flex items-center gap-1.5 shrink-0">
                    <AlertTriangle className="w-3.5 h-3.5 text-[color:var(--late)]" />
                </div>
                <div className="overflow-hidden relative w-full">
                    <div className="whitespace-nowrap animate-marquee text-[12px] text-[color:var(--muted)] font-medium">
                        {tickerText} &nbsp;•&nbsp; {tickerText} &nbsp;•&nbsp; {tickerText}
                    </div>
                </div>
            </div>
        </Panel>
    );
}
