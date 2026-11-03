import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function InfoTip({ text, className = "" }: { text: string; className?: string }) {
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger
          asChild
          className={`inline-flex cursor-help items-center align-middle text-muted-foreground transition-colors hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full ${className}`}
        >
          <span aria-label="More information"><Info className="h-4 w-4" /></span>
        </TooltipTrigger>
        <TooltipContent role="tooltip" className="max-w-64 text-xs font-normal">{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
