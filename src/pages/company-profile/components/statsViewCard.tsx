import { Info } from "lucide-react";
import { Button } from "@/components/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/components/ui/tooltip";
import type { IStatsViewCardProps } from './engagementTypes';

const StatsViewCard = (props: IStatsViewCardProps) => {
  return (
    <div className="text-center">
      <div className="text-lg font-bold mb-2 text-black">
        {props.title}
      </div>
      <div className="text-[52px] font-bold text-black">
        {props.data}
      </div>
      <div className="mt-2 flex items-center justify-center flex-col gap-3">
        <span className="text-base text-black inline">{props.explaination}</span>
        {props.hints && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full ml-2 w-8 !h-8 bg-[#d9d9d9] hover:bg-[#bfbfbf] p-0"
                  tabIndex={0}
                >
                  <Info className="w-5 h-5 text-black" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                {props.hints}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};

export default StatsViewCard;
