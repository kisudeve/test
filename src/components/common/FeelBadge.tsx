import { FeelBadgeProps } from "@/types/community";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { twMerge } from "tailwind-merge";

const feelConfig = {
  up: {
    icon: TrendingUp,
    label: "UP",
    bgColor: "bg-red-200",
    textColor: "text-red-500",
  },
  down: {
    icon: TrendingDown,
    label: "DOWN",
    bgColor: "bg-blue-200",
    textColor: "text-blue-500",
  },
  hold: {
    icon: Minus,
    label: "HOLD",
    bgColor: "bg-slate-200",
    textColor: "text-slate-500",
  },
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs gap-0.5",
  md: "px-3 py-1 text-sm gap-1",
  lg: "px-4 py-2 text-base gap-2",
};

export default function FeelBadge({
  type,
  className = "",
  showIcon = true,
  size = "md",
}: FeelBadgeProps) {
  const config = feelConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={twMerge(
        "flex justify-center items-center font-medium rounded-2xl",
        config.bgColor,
        config.textColor,
        sizeClasses[size],
        className,
      )}
    >
      {showIcon && <Icon size={size === "sm" ? 16 : size === "lg" ? 24 : 20} />}
      <span>{config.label}</span>
    </div>
  );
}
