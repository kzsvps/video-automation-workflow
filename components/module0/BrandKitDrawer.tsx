"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/AppContext";

interface Props { onClose: () => void }

const brandColors = [
  { name: "品牌紫", hex: "#6366f1" },
  { name: "電藍", hex: "#06b6d4" },
  { name: "熱情紅", hex: "#ef4444" },
  { name: "活力橙", hex: "#f97316" },
  { name: "森林綠", hex: "#22c55e" },
  { name: "玫瑰粉", hex: "#ec4899" },
];

const intros = [
  { id: "fade", label: "淡入淡出", icon: "🌫️" },
  { id: "zoom", label: "縮放出現", icon: "🔍" },
  { id: "slide", label: "滑動進場", icon: "➡️" },
  { id: "none", label: "無片頭", icon: "⊘" },
];

export default function BrandKitDrawer({ onClose }: Props) {
  const { addToast } = useApp();
  const [selectedColor, setSelectedColor] = useState("#6366f1");
  const [customColor, setCustomColor] = useState("#6366f1");
  const [selectedIntro, setSelectedIntro] = useState("fade");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [watermark, setWatermark] = useState("@videoflow_ai");

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-[380px] h-full bg-surface border-l border-border flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <h2 className="font-bold text-lg">🎨 品牌套件</h2>
            <p className="text-xs text-text-muted mt-0.5">統一你的視覺識別與浮水印</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-background hover:bg-white/10 flex items-center justify-center text-text-secondary transition-colors">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Logo */}
          <div className="card space-y-3">
            <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider">🖼 品牌 LOGO</div>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-border bg-background flex items-center justify-center overflow-hidden">
                {logoPreview ? (
                  <img src={logoPreview} alt="logo" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-3xl">🏷️</span>
                )}
              </div>
              <div className="space-y-2">
                <label className="btn-secondary text-xs cursor-pointer inline-block">
                  上傳 LOGO
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </label>
                <p className="text-[10px] text-text-muted">建議 PNG 透明底，200×200px</p>
              </div>
            </div>
          </div>

          {/* Watermark text */}
          <div className="card space-y-3">
            <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider">💧 浮水印文字</div>
            <input
              value={watermark}
              onChange={(e) => setWatermark(e.target.value)}
              className="input-base w-full text-sm"
              placeholder="@yourhandle"
            />
            <div className="flex gap-2 text-[10px] text-text-muted">
              <span>位置：</span>
              {["右下", "右上", "左下"].map(pos => (
                <button key={pos} className="px-2 py-0.5 rounded bg-background border border-border hover:border-primary/40 transition-colors">{pos}</button>
              ))}
            </div>
          </div>

          {/* Brand Colors */}
          <div className="card space-y-3">
            <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider">🎨 品牌色票</div>
            <div className="grid grid-cols-3 gap-2">
              {brandColors.map(c => (
                <button key={c.hex} onClick={() => { setSelectedColor(c.hex); setCustomColor(c.hex); }}
                  className={cn("flex items-center gap-2 p-2.5 rounded-xl border transition-all text-xs", selectedColor === c.hex ? "border-white/30 ring-2 ring-offset-1 ring-offset-surface" : "border-border hover:border-border/60")}
                  style={{ ringColor: c.hex }}>
                  <div className="w-5 h-5 rounded-md shrink-0" style={{ backgroundColor: c.hex }} />
                  <span className="text-text-secondary truncate">{c.name}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="text-xs text-text-muted">自訂色：</div>
              <input type="color" value={customColor}
                onChange={e => { setCustomColor(e.target.value); setSelectedColor(e.target.value); }}
                className="w-9 h-9 rounded-xl cursor-pointer border-0 bg-transparent" />
              <code className="text-xs text-text-muted bg-background px-2 py-1 rounded">{customColor.toUpperCase()}</code>
            </div>
          </div>

          {/* Intro / Outro */}
          <div className="card space-y-3">
            <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider">🎬 片頭動畫</div>
            <div className="grid grid-cols-2 gap-2">
              {intros.map(t => (
                <button key={t.id} onClick={() => setSelectedIntro(t.id)}
                  className={cn("flex items-center gap-2 px-3 py-3 rounded-xl border text-sm transition-all", selectedIntro === t.id ? "border-primary/60 bg-primary/10 text-primary-light" : "border-border bg-background text-text-secondary hover:border-border/60")}>
                  <span>{t.icon}</span>
                  <span className="font-medium">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Preview badge */}
          <div className="card bg-background space-y-2">
            <div className="text-xs font-semibold text-text-secondary">預覽效果</div>
            <div className="h-16 rounded-xl flex items-center justify-center relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${selectedColor}22, ${selectedColor}44)`, border: `1px solid ${selectedColor}44` }}>
              <span className="text-sm font-bold" style={{ color: selectedColor }}>{watermark}</span>
              <div className="absolute bottom-1 right-2 text-[9px] opacity-40" style={{ color: selectedColor }}>浮水印位置</div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border">
          <button onClick={() => { addToast("品牌套件已儲存！"); onClose(); }} className="btn-primary w-full py-3">
            儲存品牌設定
          </button>
        </div>
      </motion.div>
    </div>
  );
}
