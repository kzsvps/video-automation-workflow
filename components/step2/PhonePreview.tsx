"use client";

import { useState } from "react";
import { storyboardFrames, subtitleTemplates } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface Props {
  selectedTemplate: string;
  onTemplateChange: (id: string) => void;
}

const previewText = "你知道嗎？90%\n的人都不知道\n這個 AI 工具！";

export default function PhonePreview({ selectedTemplate, onTemplateChange }: Props) {
  const [activeFrame, setActiveFrame] = useState(0);
  const [subtitlePos, setSubtitlePos] = useState(75); // percentage from top
  const tpl = subtitleTemplates.find((t) => t.id === selectedTemplate) ?? subtitleTemplates[0];

  const bgColors = [
    "from-indigo-900 to-blue-900",
    "from-gray-900 to-slate-800",
    "from-purple-900 to-pink-900",
    "from-emerald-900 to-teal-900",
    "from-orange-900 to-red-900",
    "from-yellow-900 to-amber-800",
  ];

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto">
      {/* Phone Frame */}
      <div className="flex flex-col items-center">
        <div className="relative" style={{ width: 200, height: 360 }}>
          {/* Phone Shell */}
          <div className="absolute inset-0 rounded-[2.4rem] border-[6px] border-[#2A2A3A] bg-black shadow-2xl overflow-hidden">
            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-7 bg-black/80 flex items-center justify-between px-4 z-10">
              <span className="text-[9px] text-white/70 font-medium">9:41</span>
              <div className="w-16 h-3 bg-black rounded-full absolute left-1/2 -translate-x-1/2 top-1" />
              <div className="flex items-center gap-1">
                <span className="text-[9px] text-white/70">●●●</span>
              </div>
            </div>
            {/* Video Content */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-b flex items-center justify-center",
              bgColors[activeFrame % bgColors.length]
            )}>
              <div className="text-5xl opacity-60">
                {storyboardFrames[activeFrame]?.thumbnail}
              </div>
            </div>
            {/* Subtitle overlay */}
            <div
              className="absolute left-2 right-2 z-20 flex justify-center"
              style={{ top: `${subtitlePos}%`, transform: "translateY(-50%)" }}
            >
              <div
                className="px-3 py-1.5 rounded-lg text-center max-w-full"
                style={{
                  fontFamily: tpl.fontFamily,
                  fontSize: tpl.fontSize * 0.45,
                  color: tpl.color,
                  backgroundColor: tpl.bg,
                  WebkitTextStroke: tpl.strokeWidth > 0 ? `${tpl.strokeWidth * 0.5}px ${tpl.stroke}` : undefined,
                  lineHeight: 1.3,
                  whiteSpace: "pre-line",
                }}
              >
                {previewText}
              </div>
            </div>
            {/* Bottom UI */}
            <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
              <div className="flex items-end justify-between">
                <div className="space-y-1">
                  <div className="text-white/90 text-[9px] font-medium">@videoflow_ai</div>
                  <div className="text-white/60 text-[8px]">#{storyboardFrames[activeFrame]?.label}</div>
                </div>
                <div className="flex flex-col items-center gap-2 text-white/80">
                  <div className="text-center"><div className="text-sm">❤️</div><div className="text-[7px]">12K</div></div>
                  <div className="text-center"><div className="text-sm">💬</div><div className="text-[7px]">342</div></div>
                  <div className="text-center"><div className="text-sm">↗️</div><div className="text-[7px]">分享</div></div>
                </div>
              </div>
            </div>
          </div>
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#2A2A3A] rounded-b-2xl z-20" />
        </div>

        {/* Subtitle position slider */}
        <div className="w-48 mt-4 space-y-1">
          <div className="flex justify-between text-[10px] text-text-muted">
            <span>字幕位置</span>
            <span>{subtitlePos}%</span>
          </div>
          <input
            type="range" min={30} max={90} value={subtitlePos}
            onChange={(e) => setSubtitlePos(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
      </div>

      {/* Storyboard frames */}
      <div className="card space-y-2">
        <div className="text-xs font-semibold text-text-secondary">🎬 分鏡素材</div>
        <div className="grid grid-cols-3 gap-2">
          {storyboardFrames.map((f, i) => (
            <button
              key={f.id}
              onClick={() => setActiveFrame(i)}
              className={cn(
                "aspect-video rounded-xl border flex flex-col items-center justify-center gap-1 transition-all",
                activeFrame === i
                  ? "border-primary/60 bg-primary/10"
                  : "border-border bg-background hover:border-border/60"
              )}
            >
              <span className="text-xl">{f.thumbnail}</span>
              <span className="text-[9px] text-text-muted text-center leading-tight px-1">{f.label}</span>
            </button>
          ))}
        </div>
        <button className="w-full py-2 text-xs text-text-muted border border-dashed border-border rounded-xl hover:border-primary/40 hover:text-primary transition-colors">
          + 上傳自訂素材
        </button>
      </div>

      {/* Subtitle Templates */}
      <div className="card space-y-3">
        <div className="text-xs font-semibold text-text-secondary">💬 字幕樣式</div>
        <div className="grid grid-cols-2 gap-2">
          {subtitleTemplates.map((t) => (
            <button
              key={t.id}
              onClick={() => onTemplateChange(t.id)}
              className={cn(
                "p-3 rounded-xl border text-left transition-all",
                selectedTemplate === t.id
                  ? "border-primary/60 bg-primary/10"
                  : "border-border bg-background hover:border-border/60"
              )}
            >
              <div
                className="text-xs font-bold mb-1 truncate"
                style={{
                  color: t.color === "#FFFFFF" || t.color === "#FFFF00" ? undefined : t.color,
                  fontFamily: t.fontFamily,
                }}
              >
                {t.preview}
              </div>
              <div className="text-[10px] text-text-muted">{t.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
