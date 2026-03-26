"use client";

import { useState, useRef } from "react";
import { storyboardFrames, subtitleTemplates } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/AppContext";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  selectedTemplate: string;
  onTemplateChange: (id: string) => void;
}

const previewText = "你知道嗎？90%\n的人都不知道\n這個 AI 工具！";

export default function PhonePreview({ selectedTemplate, onTemplateChange }: Props) {
  const { uploadedFiles, setUploadedFiles, activeFrame, setActiveFrame } = useApp();
  const [subtitlePos, setSubtitlePos] = useState(75); // percentage from top
  const [ratio, setRatio] = useState<"9:16" | "16:9">("9:16");
  const [customColor, setCustomColor] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tpl = subtitleTemplates.find((t) => t.id === selectedTemplate) ?? subtitleTemplates[0];
  const activeColor = customColor || tpl.color;

  const bgColors = [
    "from-indigo-900 to-blue-900",
    "from-gray-900 to-slate-800",
    "from-purple-900 to-pink-900",
    "from-emerald-900 to-teal-900",
    "from-orange-900 to-red-900",
    "from-yellow-900 to-amber-800",
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        setUploadedFiles(prev => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  type CombinedFrame = { id: string | number; isUpload: boolean; url?: string; thumbnail?: string; label: string; duration?: number; };

  const combinedFrames: CombinedFrame[] = [
    ...uploadedFiles.map((url, i) => ({ id: `upload-${i}`, isUpload: true, url, label: `自訂素材 ${i + 1}` })),
    ...storyboardFrames.map(f => ({ ...f, isUpload: false }))
  ];

  const currentFrameData = combinedFrames[activeFrame % combinedFrames.length] || combinedFrames[0];

  return (
    <div className="flex flex-col gap-5 h-full overflow-y-auto custom-scrollbar pb-8">

      {/* Top row: ratio toggle + subtitle color */}
      <div className="flex items-center gap-3">
        <div className="flex bg-white border border-border rounded-xl p-1 flex-1 shadow-card">
          <button
            onClick={() => setRatio("9:16")}
            className={cn("flex-1 py-1.5 text-xs font-medium rounded-lg transition-all", ratio === "9:16" ? "bg-primary text-white shadow" : "text-text-muted hover:text-text-primary")}
          >
            📱 9:16 直式
          </button>
          <button
            onClick={() => setRatio("16:9")}
            className={cn("flex-1 py-1.5 text-xs font-medium rounded-lg transition-all", ratio === "16:9" ? "bg-primary text-white shadow" : "text-text-muted hover:text-text-primary")}
          >
            🖥 16:9 橫式
          </button>
        </div>
        <div className="flex items-center gap-2 bg-white border border-border rounded-xl px-3 py-2 shadow-card">
          <span className="text-[11px] text-text-muted whitespace-nowrap">字幕色</span>
          <input
            type="color"
            value={customColor || tpl.color}
            onChange={(e) => setCustomColor(e.target.value)}
            className="w-6 h-6 rounded cursor-pointer border-0 p-0"
          />
        </div>
      </div>

      {/* Viewport Frame — LARGE center */}
      <div className="flex flex-col items-center">
        <motion.div
          layout
          className="relative"
          style={{
            width:  ratio === "9:16" ? 270 : 480,
            height: ratio === "9:16" ? 480 : 270,
          }}
        >
          {/* Phone Shell */}
          <div className="absolute inset-0 rounded-[2.4rem] border-[6px] border-[#2A2A3A] bg-black shadow-2xl overflow-hidden pointer-events-none z-0">
            {/* Status Bar - B4: increased z-index to stay above notch */}
            {ratio === "9:16" && (
              <div className="absolute top-0 left-0 right-0 h-7 bg-black/40 flex items-center justify-between px-4 z-30 pointer-events-none">
                <span className="text-[9px] text-white/90 font-medium tracking-wider drop-shadow-md">9:41</span>
                <div className="flex items-center gap-1 opacity-90 drop-shadow-md">
                  <span className="text-[9px] text-white">●●●</span>
                </div>
              </div>
            )}
            
            {/* Video Content */}
            <AnimatePresence mode="popLayout">
              <motion.div
                key={activeFrame}
                initial={{ opacity: 0.5, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "absolute inset-0 flex items-center justify-center",
                  !currentFrameData?.isUpload && bgColors[activeFrame % bgColors.length]
                )}
                style={currentFrameData?.isUpload ? {
                  backgroundImage: `url(${currentFrameData.url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                } : {
                  background: 'linear-gradient(to bottom, var(--tw-gradient-stops))'
                }}
              >
                {!currentFrameData?.isUpload && (
                  <div className="text-5xl opacity-80 filter drop-shadow-lg">
                    {currentFrameData?.thumbnail}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Subtitle overlay */}
            <div
              className="absolute left-2 right-2 z-20 flex justify-center pointer-events-auto"
              style={{ top: `${subtitlePos}%`, transform: "translateY(-50%)" }}
            >
              <div
                className="px-3 py-1.5 rounded-lg text-center max-w-full drop-shadow-md transition-all duration-300"
                style={{
                  fontFamily: tpl.fontFamily,
                  fontSize: ratio === "9:16" ? tpl.fontSize * 0.45 : tpl.fontSize * 0.55,
                  color: activeColor,
                  backgroundColor: tpl.bg,
                  WebkitTextStroke: tpl.strokeWidth > 0 ? `${tpl.strokeWidth * 0.5}px ${tpl.stroke}` : undefined,
                  lineHeight: 1.3,
                  whiteSpace: "pre-line",
                }}
              >
                {previewText}
              </div>
            </div>
            
            {/* Bottom UI - Only show for 9:16 realistic preview */}
            {ratio === "9:16" && (
              <div className="absolute bottom-0 left-0 right-0 p-3 z-10 bg-gradient-to-t from-black/80 to-transparent pt-8">
                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <div className="text-white/90 text-[9px] font-medium drop-shadow">@videoflow_ai</div>
                    <div className="text-white/80 text-[8px] drop-shadow">#{currentFrameData?.label}</div>
                  </div>
                  <div className="flex flex-col items-center gap-2 text-white/90 pb-2">
                    <div className="text-center drop-shadow-md"><div className="text-sm">❤️</div><div className="text-[7px]">12K</div></div>
                    <div className="text-center drop-shadow-md"><div className="text-sm">💬</div><div className="text-[7px]">342</div></div>
                    <div className="text-center drop-shadow-md"><div className="text-sm">↗️</div><div className="text-[7px]">分享</div></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Notch - B4 fix: Keep z-index lower than Status Bar or let Status Bar pad around it */}
          {ratio === "9:16" && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#2A2A3A] rounded-b-[14px] z-20 shadow-sm" />
          )}
        </motion.div>

        {/* Subtitle position slider */}
        <div className="w-full max-w-[200px] mt-4 space-y-1.5">
          <div className="flex justify-between text-[10px] text-text-muted">
            <span>上下調整字幕位置</span>
            <span>{subtitlePos}%</span>
          </div>
          <input
            type="range" min={10} max={90} value={subtitlePos}
            onChange={(e) => setSubtitlePos(Number(e.target.value))}
            className="w-full accent-primary h-1.5 bg-border rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Storyboard frames - F6: local assets combination */}
      <div className="card space-y-3 shrink-0">
        <div className="flex justify-between items-center text-xs font-semibold text-text-secondary">
          <span>🎬 分鏡素材與上傳</span>
          <span className="text-[9px] font-normal text-text-muted">{combinedFrames.length} 個分鏡</span>
        </div>
        <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
          {combinedFrames.map((f, i) => (
            <button
              key={f.id}
              onClick={() => setActiveFrame(i)}
              className={cn(
                "aspect-video rounded-xl border flex flex-col items-center justify-center gap-1 transition-all overflow-hidden relative group",
                activeFrame === i
                  ? "border-primary/80 ring-2 ring-primary/20 shadow-sm"
                  : "border-border bg-background hover:border-border/80"
              )}
            >
              {f.isUpload ? (
                <img src={f.url} alt={f.label} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <>
                  <span className="text-xl group-hover:scale-110 transition-transform">{f.thumbnail}</span>
                  <span className="text-[9px] text-text-muted text-center leading-tight px-1 z-10 bg-background/50 rounded">{f.label}</span>
                </>
              )}
              {activeFrame === i && <div className="absolute inset-0 ring-inset ring-2 ring-primary pointer-events-none"></div>}
            </button>
          ))}
        </div>
        <label className="w-full py-2.5 text-xs font-medium text-text-muted border border-dashed border-border rounded-xl hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer flex justify-center items-center gap-2 group">
          <span className="text-lg group-hover:scale-110 transition-transform">+</span>
          <span>上傳自訂素材</span>
          <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleImageUpload} />
        </label>
      </div>

      {/* Subtitle Templates - A9: Add custom color picker */}
      <div className="card space-y-3 shrink-0">
        <div className="flex justify-between items-center">
          <div className="text-xs font-semibold text-text-secondary">💬 字幕樣式</div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-text-muted">自訂顏色</span>
            <input 
              type="color" 
              value={customColor || tpl.color} 
              onChange={(e) => setCustomColor(e.target.value)}
              className="w-5 h-5 rounded cursor-pointer border-0 p-0"
              title="覆寫字幕顏色"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {subtitleTemplates.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                onTemplateChange(t.id);
                setCustomColor(""); // Reset custom color when switching template
              }}
              className={cn(
                "p-3 rounded-xl border text-left transition-all relative overflow-hidden",
                selectedTemplate === t.id
                  ? "border-primary/60 bg-primary/5 shadow-sm"
                  : "border-border bg-background hover:border-border/80"
              )}
            >
              <div
                className="text-xs font-bold mb-1 truncate relative z-10"
                style={{
                  color: t.color === "#FFFFFF" || t.color === "#FFFF00" ? undefined : t.color,
                  fontFamily: t.fontFamily,
                }}
              >
                {t.preview}
              </div>
              <div className="text-[10px] text-text-muted relative z-10">{t.name}</div>
              {selectedTemplate === t.id && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
