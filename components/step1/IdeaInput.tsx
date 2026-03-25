"use client";

import { useState } from "react";
import { trendTags, platforms, personas } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface Props {
  onNext: (data: { topic: string; platform: string; duration: number; personaId: string }) => void;
}

const durations = [15, 30, 60, 90];

export default function IdeaInput({ onNext }: Props) {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("tiktok");
  const [duration, setDuration] = useState(60);
  const [personaId, setPersonaId] = useState("1");
  const [compliance, setCompliance] = useState<"idle" | "checking" | "ok">("idle");

  const handleTagClick = (tag: string) => {
    setTopic((prev) => (prev ? `${prev}，${tag}` : tag));
  };

  const handleCheck = () => {
    if (!topic) return;
    setCompliance("checking");
    setTimeout(() => setCompliance("ok"), 1200);
  };

  const canProceed = topic.length > 5 && compliance === "ok";

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          <span className="text-gradient">Step 1</span>
          <span className="text-text-primary ml-2">— 靈感與輸入</span>
        </h1>
        <p className="text-text-muted text-sm mt-1">一句話描述你的影片主題，AI 幫你完成剩下的一切</p>
      </div>

      {/* Main input */}
      <div className="card space-y-4">
        <label className="text-sm font-semibold text-text-secondary flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-primary/20 text-primary-light flex items-center justify-center text-xs">💡</span>
          核心主題
        </label>
        <textarea
          value={topic}
          onChange={(e) => { setTopic(e.target.value); setCompliance("idle"); }}
          placeholder="輸入一句話、一個點子，或貼上文章連結……
例如：介紹 2025 年最值得學的 3 個 AI 工具"
          className="input-base w-full h-36 resize-none text-base leading-relaxed"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted">{topic.length} 字</span>
          <button
            onClick={handleCheck}
            disabled={!topic || compliance === "checking"}
            className={cn(
              "text-xs px-4 py-2 rounded-lg font-medium transition-all",
              compliance === "ok"
                ? "bg-success/20 text-success border border-success/30"
                : compliance === "checking"
                ? "bg-warning/20 text-warning border border-warning/30 animate-pulse"
                : "bg-surface border border-border text-text-secondary hover:border-primary/50 hover:text-primary disabled:opacity-40"
            )}
          >
            {compliance === "ok" ? "✓ 合規檢測通過" : compliance === "checking" ? "⏳ 掃描中…" : "🛡️ 合規掃描"}
          </button>
        </div>
      </div>

      {/* Trend Tags */}
      <div className="card space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-text-secondary">🔥 熱門話題</span>
          <span className="text-[10px] text-text-muted bg-background px-2 py-0.5 rounded-full">點擊一鍵套用</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {trendTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="text-xs px-3 py-1.5 rounded-full border border-border bg-background hover:border-primary/50 hover:bg-primary/10 hover:text-primary-light transition-all duration-150 text-text-secondary"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Parameters */}
      <div className="grid grid-cols-3 gap-4">
        {/* Platform */}
        <div className="card space-y-3">
          <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">目標平台</label>
          <div className="space-y-1.5">
            {platforms.map((p) => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all",
                  platform === p.id
                    ? "bg-primary/15 border border-primary/40 text-primary-light"
                    : "bg-background border border-border text-text-secondary hover:border-border/80"
                )}
              >
                <span>{p.icon}</span>
                <span className="font-medium">{p.name}</span>
                <span className="ml-auto text-xs text-text-muted">{p.ratio}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="card space-y-3">
          <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">影片時長</label>
          <div className="grid grid-cols-2 gap-2">
            {durations.map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={cn(
                  "py-3 rounded-xl text-sm font-bold transition-all",
                  duration === d
                    ? "bg-gradient-to-br from-primary to-accent text-white shadow-lg glow-primary"
                    : "bg-background border border-border text-text-secondary hover:border-primary/40"
                )}
              >
                {d}s
              </button>
            ))}
          </div>
          <p className="text-[10px] text-text-muted text-center">選擇的時長：{duration} 秒</p>
        </div>

        {/* Persona */}
        <div className="card space-y-3">
          <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">角色人設</label>
          <div className="space-y-1.5">
            {personas.map((p) => (
              <button
                key={p.id}
                onClick={() => setPersonaId(p.id)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all",
                  personaId === p.id
                    ? "bg-primary/15 border border-primary/40 text-primary-light"
                    : "bg-background border border-border text-text-secondary hover:border-border/80"
                )}
              >
                <span>{p.emoji}</span>
                <span className="font-medium truncate">{p.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-text-muted">
          {canProceed ? "✓ 準備就緒，點擊右側按鈕繼續" : "請輸入主題並通過合規檢測"}
        </p>
        <button
          onClick={() => canProceed && onNext({ topic, platform, duration, personaId })}
          disabled={!canProceed}
          className={cn(
            "btn-primary px-8 py-3 text-base",
            !canProceed && "opacity-40 cursor-not-allowed"
          )}
        >
          AI 生成腳本 →
        </button>
      </div>
    </div>
  );
}
