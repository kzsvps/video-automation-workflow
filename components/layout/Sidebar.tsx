"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import PersonaDrawer from "@/components/module0/PersonaDrawer";

const navItems = [
  {
    href: "/studio",
    icon: "✦",
    label: "創作工作室",
    sublabel: "影片生成流程",
  },
  {
    href: "/dashboard",
    icon: "📊",
    label: "發布 & 成效",
    sublabel: "管理與數據",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [showPersona, setShowPersona] = useState(false);

  return (
    <>
      <aside className="w-[220px] h-full bg-surface border-r border-border flex flex-col shrink-0">
        {/* Logo */}
        <div className="px-5 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm shadow-lg glow-primary">
              V
            </div>
            <div>
              <div className="font-bold text-sm text-text-primary leading-tight">VideoFlow</div>
              <div className="text-[10px] text-text-muted leading-tight">AI 短影音工作流</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group",
                  isActive
                    ? "bg-primary/15 border border-primary/30 text-primary"
                    : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
                )}
              >
                <span className="text-base w-5 text-center">{item.icon}</span>
                <div>
                  <div className={cn("text-sm font-medium leading-tight", isActive ? "text-primary-light" : "")}>
                    {item.label}
                  </div>
                  <div className="text-[10px] text-text-muted leading-tight">{item.sublabel}</div>
                </div>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-light" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Module 0 Quick Access */}
        <div className="px-3 pb-3 space-y-2 border-t border-border pt-3">
          <div className="text-[10px] text-text-muted uppercase tracking-widest px-1 mb-2">數位資產管理</div>

          <button
            onClick={() => setShowPersona(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-text-secondary hover:bg-white/5 hover:text-text-primary transition-all duration-150 text-left"
          >
            <span className="text-sm">👤</span>
            <div>
              <div className="text-sm font-medium leading-tight">角色人設</div>
              <div className="text-[10px] text-text-muted">3 個人設已設定</div>
            </div>
          </button>

          <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-text-secondary hover:bg-white/5 hover:text-text-primary transition-all duration-150 text-left">
            <span className="text-sm">🎙️</span>
            <div>
              <div className="text-sm font-medium leading-tight">AI 聲音庫</div>
              <div className="text-[10px] text-text-muted">3 個聲音已克隆</div>
            </div>
          </button>

          <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-text-secondary hover:bg-white/5 hover:text-text-primary transition-all duration-150 text-left">
            <span className="text-sm">🎨</span>
            <div>
              <div className="text-sm font-medium leading-tight">品牌套件</div>
              <div className="text-[10px] text-text-muted">LOGO · 片頭 · 色票</div>
            </div>
          </button>
        </div>

        {/* User */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
              R
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-text-primary truncate">Rain</div>
              <div className="text-[10px] text-text-muted">Pro 方案</div>
            </div>
            <div className="w-2 h-2 rounded-full bg-success shrink-0" title="已連線" />
          </div>
        </div>
      </aside>

      {showPersona && <PersonaDrawer onClose={() => setShowPersona(false)} />}
    </>
  );
}
