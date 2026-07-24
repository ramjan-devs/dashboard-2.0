"use client";

import React, { ReactNode } from "react";
import { EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface DropdownItem {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  className?: string;
  showDivider?: boolean;
  disabled?: boolean;
}

interface ActionDropdownProps {
  items: DropdownItem[];
  trigger?: ReactNode;
  title?: string;
  align?: "start" | "center" | "end";
}

export const ActionDropdown: React.FC<ActionDropdownProps> = ({
  items,
  trigger,
  title = "Actions",
  align = "end",
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-1.5 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:cursor-pointer outline-none flex items-center justify-center">
        {trigger || <EllipsisVertical className="w-5 h-5" />}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={align}
        className="w-48 bg-card rounded-xl shadow-xl border border-border py-1 text-card-foreground"
      >
        {title && (
          <DropdownMenuGroup>
            <DropdownMenuLabel className="px-4 py-2 text-base font-bold text-muted-foreground capitalize tracking-wider text-left">
              {title}
            </DropdownMenuLabel>
          </DropdownMenuGroup>
        )}

        {items.map((item, index) => (
          <React.Fragment key={index}>
            {item.showDivider && (
              <DropdownMenuSeparator className="my-1 border-t border-border" />
            )}
            <DropdownMenuItem
              onClick={item.onClick}
              disabled={item.disabled}
              className={`flex items-center justify-between w-full gap-3 px-4 py-2 text-sm transition-colors cursor-pointer focus:bg-accent focus:text-accent-foreground outline-none disabled:opacity-50 disabled:cursor-not-allowed ${item.className || "text-foreground/80 hover:text-foreground"}`}
            >
              <span>{item.label}</span>
              {item.icon && (
                <span className="w-4 h-4 flex items-center justify-center">
                  {item.icon}
                </span>
              )}
            </DropdownMenuItem>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
