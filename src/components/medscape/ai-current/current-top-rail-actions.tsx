import { AiTopRailAction } from "@/components/medscape/ai-response/top-rail-action";
import { aiResponseAssets } from "@/data/ai-response";

type MedscapeCurrentTopRailActionsProps = {
  className?: string;
  onHistoryClick: () => void;
  onNewChatClick: () => void;
};

export function MedscapeCurrentTopRailActions({
  className,
  onHistoryClick,
  onNewChatClick,
}: MedscapeCurrentTopRailActionsProps) {
  return (
    <div className={className ?? "flex items-center gap-4"}>
      <AiTopRailAction
        iconSrc={aiResponseAssets.uiIcons.history}
        label="History"
        onClick={onHistoryClick}
        variant="text"
      />
      <AiTopRailAction
        iconClassName="h-[18px] w-[18px] object-contain"
        iconSrc={aiResponseAssets.uiIcons.newChat}
        label="New Chat"
        onClick={onNewChatClick}
        variant="text"
      />
    </div>
  );
}
