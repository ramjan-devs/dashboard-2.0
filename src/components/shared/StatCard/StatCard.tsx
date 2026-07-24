import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  hideIconBg?: boolean;
  change?: number;
  periodText?: string;
  description?: React.ReactNode;
  isGrowth?: boolean;
  isCurrency?: boolean;
  isPositive?: boolean;
  sign?: "up" | "down" | "flat";
  trendIcon?: LucideIcon;
  onClick?: () => void;
}

export const StatCard = ({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor = "text-gray-400",
  hideIconBg = false,
  change,
  periodText,
  description,
  isGrowth,
  isCurrency,
  isPositive: isPositiveProp,
  sign,
  trendIcon: TrendIcon,
  onClick,
}: StatCardProps) => {
  const showChange = change !== undefined;
  const isPositive = isPositiveProp ?? (change ?? 0) >= 0;

  return (
    <Card 
      onClick={onClick}
      className={cn(
        "border border-gray-100 shadow-sm rounded-2xl transition-all duration-300",
        onClick && "cursor-pointer hover:border-blue-500/50 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] select-none"
      )}
    >
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <p className="text-gray-900 font-bold text-sm">
            {title}
          </p>

          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-xl",
              !hideIconBg && iconBg,
              hideIconBg && "bg-transparent",
              iconColor
            )}
          >
            <Icon size={18} strokeWidth={2.5} />
          </div>
        </div>

        {/* Value */}
        <h3 className="mt-4 text-gray-900 font-black text-2xl tracking-tight">
          {isCurrency ? `$${value}` : value}
          {isGrowth ? ` %` : ``}
        </h3>

        {/* Change OR Description */}
        {showChange && (
          <div className="mt-1 flex items-center gap-1.5 text-xs font-bold">
            <span className={cn(
              "flex items-center gap-1",
              sign === "flat" ? "text-gray-400" : isPositive ? "text-gray-400" : "text-red-500"
            )}>
              {TrendIcon ? <TrendIcon size={12} strokeWidth={3} /> : (
                sign === "up" || isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />
              )}
              {isPositive && "+"}
              {change}%
            </span>
            <span className="text-gray-400 font-medium">{periodText}</span>
          </div>
        )}

        {!showChange && description && (
          <p className="mt-1 text-[11px] text-gray-400 font-bold uppercase tracking-wider">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};
