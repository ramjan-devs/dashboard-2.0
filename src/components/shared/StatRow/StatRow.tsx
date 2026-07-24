import React from "react";
import { cn } from "@/lib/utils";

interface StatRowProps {
  label: string;
  value: string | number;
  valueColor?: string;
}

const StatRow = ({ label, value, valueColor = "text-gray-900" }: StatRowProps) => {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className={cn("text-sm font-bold", valueColor)}>{value}</span>
    </div>
  );
};

export default StatRow;
