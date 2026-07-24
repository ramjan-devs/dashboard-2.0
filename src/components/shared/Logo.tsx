import Image from "next/image";
import { PanelLeft } from "lucide-react";

interface LogoProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function Logo({ collapsed, onToggle }: LogoProps) {
  return (
    <div
      className={`flex items-center justify-between px-2 mb-8 ${collapsed ? "flex-col gap-4" : ""}`}
    >
      <div className="flex items-center gap-3">
        <div className="relative w-8 h-8 shrink-0">
          <Image
            src="/images/logo.png"
            alt="Nodmac Logo"
            fill
            sizes="32px"
            className="object-contain"
          />
        </div>
        {!collapsed && (
          <div>
            <h1 className="font-bold text-gray-900 leading-tight">Nodmac</h1>
          </div>
        )}
      </div>

      <button
        onClick={onToggle}
        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
      >
        <PanelLeft className="w-5 h-5" />
      </button>
    </div>
  );
}
