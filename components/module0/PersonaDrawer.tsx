"use client";

import { useState } from "react";
import { personas } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface Props {
  onClose: () => void;
}

export default function PersonaDrawer({ onClose }: Props) {
  const [selected, setSelected] = useState("1");

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="flex-1 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Drawer */}
      <div className="w-[360px] h-full bg-surface border-l border-border flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <h2 className="font-bold text-lg">角色人設管理</h2>
            <p className="text-xs text-text-muted mt-0.5">選擇或編輯你的數位分身</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-background hover:bg-white/10 flex items-center justify-center text-text-secondary transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Personas */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {personas.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              className={cn(
                "w-full text-left p-4 rounded-2xl border transition-all duration-200",
                selected === p.id
                  ? "border-primary/60 bg-primary/10"
                  : "border-border bg-background hover:border-border/80 hover:bg-white/3"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center text-2xl shrink-0",
                  p.color
                )}>
                  {p.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{p.name}</span>
                    {selected === p.id && (
                      <span className="text-[10px] bg-primary/20 text-primary-light px-2 py-0.5 rounded-full font-medium">
                        使用中
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-text-muted mt-0.5">{p.description}</div>
                  <div className="mt-2 text-xs text-text-secondary bg-background/60 rounded-lg p-2 leading-relaxed">
                    <span className="text-text-muted">開場白：</span>{p.opening.substring(0, 40)}…
                  </div>
                </div>
              </div>
            </button>
          ))}

          {/* Add new */}
          <button className="w-full p-4 rounded-2xl border border-dashed border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-text-muted hover:text-primary text-sm flex items-center justify-center gap-2">
            <span>+</span> 新增人設
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <button
            onClick={onClose}
            className="btn-primary w-full text-center py-3"
          >
            套用選擇的人設
          </button>
        </div>
      </div>
    </div>
  );
}
