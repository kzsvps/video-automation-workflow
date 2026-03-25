"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/AppContext";
import { personas } from "@/lib/mockData";
import PersonaDrawer from "@/components/module0/PersonaDrawer";
import VoiceLabDrawer from "@/components/module0/VoiceLabDrawer";
import BrandKitDrawer from "@/components/module0/BrandKitDrawer";

const navItems = [
  { href: "/studio",    icon: "✦", label: "創作工作室",   sublabel: "影片生成流程" },
  { href: "/history",   icon: "🎬", label: "影片庫",      sublabel: "已生成影片" },
  { href: "/dashboard", icon: "📊", label: "發布 & 成效", sublabel: "管理與數據" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, setSidebarCollapsed, selectedPersonaId } = useApp();
  const [drawer, setDrawer] = useState<"persona" | "voice" | "brand" | null>(null);

  const currentPersona = personas.find(p => p.id === selectedPersonaId) ?? personas[0];

  // A12: Auto collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };
    handleResize(); // trigger on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setSidebarCollapsed]);

  return (
    <>
      <motion.aside
        animate={{ width: sidebarCollapsed ? 64 : 220 }}
        transition={{ duration: 0.22, ease: "easeInOut" }}
        className="h-full bg-surface border-r border-border flex flex-col shrink-0 overflow-hidden relative z-40"
      >
        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-[72px] z-50 w-6 h-6 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted hover:text-primary hover:border-primary/50 transition-all text-xs shadow-md md:flex hidden"
        >
          {sidebarCollapsed ? "›" : "‹"}
        </button>

        {/* Logo */}
        <div className="px-4 pt-5 pb-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm shadow-lg shrink-0">
              V
            </div>
            <AnimatePresence initial={false}>
              {!sidebarCollapsed && (
                <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.15 }} className="overflow-hidden">
                  <div className="font-bold text-sm text-text-primary leading-tight whitespace-nowrap">VideoFlow</div>
                  <div className="text-[10px] text-text-muted leading-tight whitespace-nowrap">AI 短影音工作流</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 space-y-1">
          {navItems.map(item => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}
                title={sidebarCollapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 px-2.5 py-2.5 rounded-xl transition-all group overflow-hidden",
                  isActive ? "bg-primary/15 border border-primary/30 text-primary" : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
                )}>
                <span className={cn("text-base w-5 text-center shrink-0", isActive ? "" : "group-hover:scale-110 transition-transform")}>{item.icon}</span>
                <AnimatePresence initial={false}>
                  {!sidebarCollapsed && (
                    <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.15 }} className="overflow-hidden min-w-0 flex-1">
                      <div className={cn("text-sm font-medium leading-tight whitespace-nowrap", isActive ? "text-primary-light" : "")}>{item.label}</div>
                      <div className="text-[10px] text-text-muted leading-tight whitespace-nowrap">{item.sublabel}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {isActive && !sidebarCollapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-light shrink-0" />}
              </Link>
            );
          })}
        </nav>

        {/* Module 0 Quick Access */}
        <div className="px-2 pb-3 space-y-1 border-t border-border pt-3">
          {!sidebarCollapsed && (
            <div className="text-[10px] text-text-muted uppercase tracking-widest px-2 mb-2">數位資產管理</div>
          )}

          {[
            { key: "persona" as const, icon: currentPersona.emoji, label: "角色人設", sublabel: `${currentPersona.name}` },
            { key: "voice"   as const, icon: "🎙️", label: "AI 聲音庫",  sublabel: "3 個聲音已克隆" },
            { key: "brand"   as const, icon: "🎨", label: "品牌套件",    sublabel: "LOGO · 片頭 · 色票" },
          ].map(item => (
            <button key={item.key} onClick={() => setDrawer(item.key)}
              title={sidebarCollapsed ? item.label : undefined}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-text-secondary hover:bg-white/5 hover:text-text-primary transition-all duration-150 text-left overflow-hidden">
              <span className="text-sm shrink-0 w-5 text-center">{item.icon}</span>
              <AnimatePresence initial={false}>
                {!sidebarCollapsed && (
                  <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.15 }} className="overflow-hidden">
                    <div className="text-sm font-medium leading-tight whitespace-nowrap">{item.label}</div>
                    <div className="text-[10px] text-text-muted leading-tight whitespace-nowrap">{item.sublabel}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>

        {/* User */}
        <div className="p-3 border-t border-border shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold shrink-0">
              R
            </div>
            <AnimatePresence initial={false}>
              {!sidebarCollapsed && (
                <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.15 }} className="overflow-hidden flex-1 min-w-0 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium text-text-primary whitespace-nowrap">Rain</div>
                    <div className="text-[10px] text-text-muted whitespace-nowrap">Pro 方案</div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-success shrink-0 mr-1" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      <AnimatePresence>
        {drawer === "persona" && <PersonaDrawer onClose={() => setDrawer(null)} />}
        {drawer === "voice"   && <VoiceLabDrawer onClose={() => setDrawer(null)} />}
        {drawer === "brand"   && <BrandKitDrawer onClose={() => setDrawer(null)} />}
      </AnimatePresence>
    </>
  );
}
