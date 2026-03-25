"use client";

import { useState, useEffect, useRef } from "react";
import { trendTags, platforms, personas, generateTopicScript } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/AppContext";

interface Props {
  onNext: (data: {
    topic: string;
    platforms: string[];
    duration: number;
    personaId: string;
    generatedScript: ReturnType<typeof generateTopicScript> | null;
    assetImages: string[];
  }) => void;
}

const durations = [15, 30, 60, 90];

// Platforms user has connected (simulated)
const connectedPlatforms = ["tiktok", "ig-reels", "youtube-shorts"];

const complianceResults = [
  { label: "無敏感詞彙",     ok: true  },
  { label: "無版權爭議詞",   ok: true  },
  { label: "符合各平台社規", ok: true  },
  { label: "無誇大不實宣稱", ok: true  },
];

export default function IdeaInput({ onNext }: Props) {
  const { selectedPersonaId, setSelectedPersonaId, addToast, uploadedFiles, setUploadedFiles } = useApp();
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState(60);
  const [compliance, setCompliance] = useState<"idle" | "checking" | "ok" | "warn">("idle");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [generatedScript, setGeneratedScript] = useState<ReturnType<typeof generateTopicScript> | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto compliance scan with debounce
  useEffect(() => {
    if (topic.length < 5) { setCompliance("idle"); return; }
    setCompliance("checking");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setCompliance("ok"), 1500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [topic]);

  // Trend tag → generates topic-aware script
  const handleTagClick = (tag: string) => {
    const newTags = activeTags.includes(tag) ? activeTags.filter(t => t !== tag) : [...activeTags, tag];
    setActiveTags(newTags);
    const tagStr = newTags.join("、");
    const newTopic = tagStr ? `關於${tagStr}的深度解析` : "";
    setTopic(newTopic);
    if (newTopic.length > 5) {
      const script = generateTopicScript(newTopic, selectedPersonaId);
      setGeneratedScript(script);
    } else {
      setGeneratedScript(null);
    }
  };

  const handleTopicChange = (val: string) => {
    setTopic(val);
    setActiveTags([]);
    if (val.length > 10) {
      setGeneratedScript(generateTopicScript(val, selectedPersonaId));
    } else {
      setGeneratedScript(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        setUploadedFiles(prev => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
    addToast(`已上傳 ${files.length} 張素材`);
  };

  const canProceed = topic.length > 5 && compliance === "ok";

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">
          <span className="text-gradient">Step 1</span>
          <span className="text-text-primary ml-2">— 靈感與輸入</span>
        </h1>
        <p className="text-text-muted text-sm mt-1">一句話描述主題，AI 幫你完成腳本與素材匹配</p>
      </div>

      {/* Main input + compliance */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-text-secondary flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-primary/20 text-primary-light flex items-center justify-center text-xs">💡</span>
            核心主題
          </label>
          <div className={cn("flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all",
            compliance === "ok"      ? "bg-success/15 text-success border border-success/30" :
            compliance === "checking" ? "bg-warning/15 text-warning border border-warning/30 animate-pulse" :
            compliance === "warn"    ? "bg-danger/15 text-danger border border-danger/30" :
            "bg-surface border border-border text-text-muted"
          )}>
            {compliance === "ok" ? "✓ 合規檢查通過" : compliance === "checking" ? "⏳ 智慧掃描中…" : compliance === "warn" ? "⚠ 需修改" : "🛡️ 待掃描"}
          </div>
        </div>

        <textarea
          value={topic}
          onChange={e => handleTopicChange(e.target.value)}
          placeholder="輸入一句話、一個點子，或貼上文章連結……
例如：介紹 2025 年最值得學的 3 個 AI 工具"
          className="input-base w-full h-28 resize-none text-base leading-relaxed focus:ring-2 focus:ring-primary/50"
        />

        <div className="text-xs text-text-muted text-right">{topic.length} 字</div>

        {/* Compliance detail */}
        {compliance === "ok" && (
          <div className="bg-success/5 border border-success/20 rounded-xl p-3 grid grid-cols-2 gap-2 animate-fade-in">
            {complianceResults.map(r => (
              <div key={r.label} className="flex items-center gap-2 text-xs text-success">
                <span className="w-4 h-4 rounded-full bg-success/20 flex items-center justify-center text-[10px]">✓</span>
                <span>{r.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Asset Upload */}
      <div className="card space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-text-secondary">🖼️ 產品素材上傳</span>
            <span className="text-[10px] text-primary-light bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">增強腳本相關度</span>
          </div>
          <span className="text-[10px] text-text-muted">已上傳 {uploadedFiles.length} 個素材</span>
        </div>
        <div className="flex gap-3 flex-wrap">
          {uploadedFiles.map((src, i) => (
            <div key={i} className="relative group">
              <img src={src} alt={`asset-${i}`} className="w-20 h-20 object-cover rounded-xl border border-border shadow-sm" />
              <button onClick={() => setUploadedFiles(prev => prev.filter((_, j) => j !== i))}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-danger text-white text-[10px] hidden group-hover:flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                ✕
              </button>
            </div>
          ))}
          <label className="w-20 h-20 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 flex flex-col items-center justify-center cursor-pointer transition-all text-text-muted hover:text-primary gap-1">
            <span className="text-2xl font-light">+</span>
            <span className="text-[9px] font-medium">上傳素材</span>
            <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleImageUpload} />
          </label>
        </div>
        <p className="text-[10px] text-text-muted">支援 JPG、PNG、MP4 · 我們會自動提取素材特徵並融入分鏡中</p>
      </div>

      {/* Trend Tags → Script Preview */}
      <div className="card space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-text-secondary">🔥 熱門話題靈感庫</span>
          <span className="text-[10px] text-text-muted bg-background px-2 py-0.5 rounded-full border border-border">點選自動帶入高流量腳本模板</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {trendTags.map(tag => (
            <button key={tag} onClick={() => handleTagClick(tag)}
              className={cn("text-xs px-3 py-1.5 rounded-full border transition-all duration-300",
                activeTags.includes(tag)
                  ? "border-primary bg-primary/10 text-primary-light shadow-[0_0_10px_rgba(99,102,241,0.2)]"
                  : "border-border bg-background hover:border-primary/40 hover:text-primary-light text-text-secondary"
              )}>
              #{tag}
            </button>
          ))}
        </div>

        {/* Generated script preview */}
        {generatedScript && (
          <div className="mt-4 rounded-xl border border-accent/30 bg-accent/5 p-4 space-y-3 animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-accent"></div>
            <div className="flex items-center gap-2 text-xs font-semibold text-accent">
              ✨ 已產生專屬腳本草稿
              <span className="text-text-muted font-normal">（進入下一步後可細部編輯）</span>
            </div>
            <div className="space-y-2 opacity-90">
              {[
                { label: "開場", text: generatedScript.opening },
                { label: "主體", text: generatedScript.body0.substring(0, 70) + "..." },
                { label: "結語", text: generatedScript.closing },
              ].map(s => (
                <div key={s.label} className="flex gap-3 text-xs">
                  <span className="text-accent/70 w-8 shrink-0 font-medium">{s.label}</span>
                  <span className="text-text-secondary leading-relaxed">{s.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Parameters */}
      <div className="grid grid-cols-2 gap-4">
        {/* Connected Platforms — Read Only (Req 4) */}
        <div className="card space-y-3 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">🌐 發佈與版面適配</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {platforms.filter(p => connectedPlatforms.includes(p.id)).map(p => (
              <div key={p.id}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-medium border border-primary/20 bg-primary/5 text-primary-light pointer-events-none">
                <span>{p.icon}</span>{p.name}
              </div>
            ))}
          </div>
          <p className="text-[10px] text-text-muted leading-relaxed">
            系統將自動為以上已綁定帳號的平台生成最佳版型 (包含 9:16 與 16:9)，無需手動選擇。
          </p>
        </div>

        {/* Persona */}
        <div className="card space-y-3 col-span-2 sm:col-span-1">
          <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">👤 角色人設</label>
          <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
            {personas.map(p => (
              <button key={p.id} onClick={() => {
                setSelectedPersonaId(p.id);
                if (topic.length > 5) setGeneratedScript(generateTopicScript(topic, p.id));
              }}
                className={cn("w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all",
                  selectedPersonaId === p.id
                    ? "bg-primary/15 border border-primary/40 text-primary-light"
                    : "bg-background border border-border text-text-secondary hover:border-border/80"
                )}>
                <span className="text-lg">{p.emoji}</span>
                <div className="text-left flex-1">
                  <div className="font-medium text-[11px] leading-tight text-text-primary">{p.name}</div>
                  <div className="text-[9px] text-text-muted leading-tight mt-0.5">{p.tone}</div>
                </div>
                {selectedPersonaId === p.id && <div className="w-1.5 h-1.5 rounded-full bg-primary-light"></div>}
              </button>
            ))}
          </div>
        </div>
        
        {/* Duration */}
        <div className="card space-y-3 col-span-2">
          <label className="text-xs font-semibold text-text-muted uppercase tracking-wider flex justify-between">
            <span>⏱ 影片時長預估</span>
            <span className="text-primary-light normal-case">目前短影音最佳長度為 30-60s</span>
          </label>
          <div className="flex gap-2">
            {durations.map(d => (
              <button key={d} onClick={() => setDuration(d)}
                className={cn("flex-1 py-2.5 rounded-xl text-[11px] font-bold transition-all border",
                  duration === d
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                    : "bg-background border-border text-text-secondary hover:border-primary/40 hover:text-text-primary"
                )}>
                {d}s
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-[11px] text-text-muted bg-surface px-3 py-2 rounded-lg border border-border">
          {canProceed
            ? `✓ 準備就緒・自動適配 ${connectedPlatforms.length} 個平台・預計 ${duration}s`
            : topic.length < 5 ? "請輸入主題（至少 5 字）"
            : compliance === "checking" ? "⏳ 合規掃描中，請稍候…"
            : "請等待掃描完成"}
        </div>
        <button
          onClick={() => canProceed && onNext({ topic, platforms: connectedPlatforms, duration, personaId: selectedPersonaId, generatedScript, assetImages: uploadedFiles })}
          disabled={!canProceed}
          className={cn("btn-primary px-8 py-3.5 text-sm shadow-xl shadow-primary/20 flex items-center gap-2 group", !canProceed && "opacity-40 cursor-not-allowed shadow-none")}
        >
          開始 AI 生成
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
    </div>
  );
}
