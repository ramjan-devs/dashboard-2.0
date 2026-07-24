"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import {
  ChevronDown,
  CalendarDays,
  RefreshCw,
  HelpCircle,
  Sun,
  Moon,
  Menu,
} from "lucide-react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { toggleSidebar } from "@/lib/redux/slices/dashboardSlice";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const DATE_RANGES = [
  "Last 7 days",
  "Last 14 days",
  "Last 30 days",
  "Last 90 days",
  "This year",
];

export default function Navbar() {
  const dispatch = useAppDispatch();
  const { theme, setTheme } = useTheme();
  const [selectedRange, setSelectedRange] = useState("Last 7 days");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [secondsAgo, setSecondsAgo] = useState(5);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsAgo((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (secs: number) => {
    if (secs < 60) return `${secs}s ago`;
    const mins = Math.floor(secs / 60);
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b bg-card/80 px-4 backdrop-blur-sm lg:px-6">
      {/* Left — Mobile menu + Date Range Selector */}
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Date Range Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 rounded-lg border border-border bg-background/60 px-4 py-2.5 text-base text-foreground hover:bg-accent/50 transition-colors"
          >
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">{selectedRange}</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform duration-200",
                dropdownOpen && "rotate-180"
              )}
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute left-0 top-full z-20 mt-1.5 w-44 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                {DATE_RANGES.map((range) => (
                  <button
                    key={range}
                    onClick={() => {
                      setSelectedRange(range);
                      setDropdownOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center px-3 py-2 text-sm transition-colors hover:bg-accent/60",
                      selectedRange === range
                        ? "bg-accent text-foreground font-semibold"
                        : "text-muted-foreground"
                    )}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right — Status + Tour + Theme + User */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Live Status */}
        <div className="hidden items-center gap-2 md:flex">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <RefreshCw className="h-4.5 w-4.5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground font-medium">
            {formatTime(secondsAgo)}
          </span>
        </div>

        {/* Divider */}
        <div className="hidden h-7 w-px bg-border md:block" />

        {/* Take a Tour */}
        <button className="hidden items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground hover:bg-accent/60 hover:text-foreground transition-colors md:flex">
          <HelpCircle className="h-5 w-5" />
          Take a Tour
        </button>

        {/* Divider */}
        <div className="hidden h-7 w-px bg-border md:block" />

        {/* Theme Toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent/60 hover:text-foreground transition-colors"
            title="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
          </button>
        )}

        {/* Divider */}
        <div className="h-7 w-px bg-border" />

        {/* User Profile */}
        <button className="flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors hover:bg-accent/50 group">
          {/* Avatar */}
          <div className="h-9 w-9 rounded-full bg-linear-to-tr from-[#8B8E63] to-[#B2B58E] flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
            AU
          </div>
          {/* Name & Role */}
          <div className="hidden text-left md:block">
            <p className="text-sm font-bold leading-none text-foreground group-hover:text-primary transition-colors">
              Admin User
            </p>
            <p className="text-xs text-muted-foreground mt-1 font-medium uppercase tracking-wider">
              Super Admin
            </p>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>
    </header>
  );
}
