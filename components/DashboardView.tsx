import { useState } from "react";
import { TopHeader } from "./dashboard/ui/TopHeader";
import { AlertTicker } from "./dashboard/ui/AlertTicker";
import { LeftSidebar } from "./dashboard/ui/LeftSidebar";
import { CenterPanel } from "./dashboard/ui/CenterPanel";
import { RightInspector } from "./dashboard/ui/RightInspector";
import { DebugOverlay } from "./dashboard/ui/DebugOverlay";
import { AgentItem } from "./dashboard/types";

export default function DashboardView({
    onNewCard,
    onEditCard
}: {
    onNewCard?: () => void;
    onEditCard?: (card: any) => void;
}) {
    const [selectedAgent, setSelectedAgent] = useState<AgentItem | null>(null);

    return (
        <div className="relative h-full w-full bg-transparent overflow-hidden">
            <div className="mx-auto h-full w-full p-2">
                <div
                    className="
            grid h-full gap-3
            [grid-template-rows:52px_32px_1fr]
            [grid-template-columns:320px_1fr_360px]
          "
                >
                    {/* row 1 */}
                    <div className="col-span-3 border-b border-[color:var(--stroke)]">
                        <TopHeader />
                    </div>

                    {/* row 2 */}
                    <div className="col-span-3">
                        <AlertTicker />
                    </div>

                    {/* row 3 */}
                    <div className="row-start-3 col-start-1 h-full overflow-hidden">
                        <LeftSidebar
                            selectedAgent={selectedAgent?.title}
                            onSelectAgent={setSelectedAgent}
                        />
                    </div>
                    <div className="row-start-3 col-start-2 h-full overflow-hidden">
                        <CenterPanel />
                    </div>
                    <div className="row-start-3 col-start-3 h-full overflow-hidden">
                        <RightInspector agent={selectedAgent} />
                    </div>
                </div>
            </div>

            <DebugOverlay />
        </div>
    );
}
