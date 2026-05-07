"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Send,
  Gift,
  Package,
  AlertTriangle,
  BarChart3,
  Heart,
  Map,
  UserRound,
  ShieldCheck,
  CreditCard,
  ScrollText,
  Settings,
  ChevronLeft,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { toggleSidebar } from "@/lib/redux/slices/dashboardSlice";
import { toast } from "sonner";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Send, label: "Campaigns", href: "/campaigns" },
  { icon: Gift, label: "Rewards", href: "/rewards" },
  { icon: Package, label: "Products", href: "/products" },
  { icon: AlertTriangle, label: "Reports", href: "/reports" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Heart, label: "Donations Management", href: "/donations-management" },
  { icon: Map, label: "Plans", href: "/plans" },
  { icon: UserRound, label: "Admins", href: "/admins" },
  { icon: ShieldCheck, label: "Permissions", href: "/permissions" },
  { icon: CreditCard, label: "Billing", href: "/billing" },
  { icon: ScrollText, label: "Audit Logs", href: "/audit-logs" },
  { icon: Settings, label: "Settings", href: "/settings" },
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
              <div className="relative h-12 w-full cursor-pointer">
                <Image
                  src="/images/logo.png"
                  alt="Logo"
                  fill
                  className={cn(
                    "object-contain transition-all duration-300",
                    isSidebarOpen ? "object-left" : "object-center scale-125",
                  )}
                  priority
                />
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
                "flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-muted-foreground hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 group cursor-pointer",
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
