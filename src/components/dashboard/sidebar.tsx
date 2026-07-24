"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Handshake,
  MonitorPlay,
  Wallet,
  FileText,
  ShieldAlert,
  DollarSign,
  HeadphonesIcon,
  ChevronLeft,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { toggleSidebar } from "@/lib/redux/slices/dashboardSlice";
import { toast } from "sonner";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Users", href: "/users" },
  { icon: Handshake, label: "Allies", href: "/allies" },
  { icon: MonitorPlay, label: "Sessions", href: "/sessions" },
  { icon: Wallet, label: "Wallet & Payments", href: "/wallet-payments" },
  { icon: FileText, label: "Payout Statements", href: "/payout-statements" },
  { icon: ShieldAlert, label: "Fraud & Abuse", href: "/fraud-abuse" },
  { icon: DollarSign, label: "Pricing & Rates", href: "/pricing-rates" },
  { icon: HeadphonesIcon, label: "Support", href: "/support" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isSidebarOpen = useAppSelector(
    (state) => state.dashboard.isSidebarOpen,
  );

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden",
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible",
        )}
        onClick={() => dispatch(toggleSidebar())}
      />

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen bg-card border-r transition-all duration-300 ease-in-out lg:static",
          isSidebarOpen
            ? "w-64 translate-x-0"
            : "w-0 -translate-x-full lg:w-24 lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo Section */}
          <div
            className={cn(
              "flex items-center border-b mb-2 gap-2 transition-all duration-300 h-20",
              isSidebarOpen ? "px-6 justify-between" : "px-2 justify-center",
            )}
          >
            <div
              className={cn(
                "transition-all cursor-pointer",
                isSidebarOpen ? "flex-1" : "w-16",
              )}
              onClick={() => !isSidebarOpen && dispatch(toggleSidebar())}
            >
              <div className="flex items-center gap-2 h-12 w-full">
                {/* Logo Image */}
                <div className="relative h-10 w-10 shrink-0">
                  <Image
                    src="/images/logo.png"
                    alt="Logo"
                    fill
                    sizes="40px"
                    className="object-contain"
                    priority
                  />
                </div>
                {/* Brand Name - only visible when sidebar is open */}
                {isSidebarOpen && (
                  <h1 className="text-xl font-bold truncate whitespace-nowrap">
                    Allies Admin
                  </h1>
                )}
              </div>
            </div>
            <button
              onClick={() => dispatch(toggleSidebar())}
              className={cn(
                "p-1 rounded-md hover:bg-accent text-muted-foreground transition-colors shrink-0 cursor-pointer",
                !isSidebarOpen && "hidden",
              )}
            >
              <ChevronLeft
                className={cn(
                  "w-5 h-5 transition-transform",
                  !isSidebarOpen && "rotate-180",
                )}
              />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 overflow-y-auto custom-scrollbar pb-6">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                      isActive
                        ? "bg-secondary text-primary font-semibold shadow-sm"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-5 h-5 shrink-0",
                        isActive
                          ? "text-primary"
                          : "group-hover:text-foreground",
                      )}
                    />
                    {isSidebarOpen && (
                      <span className="text-sm truncate">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Logout Section at Bottom */}
          <div className="px-3 py-4 border-t mt-auto">
            <button
              onClick={() => {
                toast.success("Successfully logged out!");
                console.log("Logging out...");
              }}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-muted-foreground hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-all duration-200 group cursor-pointer",
              )}
            >
              <LogOut className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
              {isSidebarOpen && (
                <span className="text-sm font-semibold">Logout</span>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
