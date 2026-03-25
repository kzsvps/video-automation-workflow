"use client";

import { useState } from "react";
import { defaultScript, voices, bgmTracks } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface Props {
  selectedVoice: string;
  onVoiceChange: (id: string) => void;
  bgmVolume: number;
  onBgmVolumeChange: (v: number) => void;
  voiceVolume: number;
  onVoiceVolumeChange: (v: number) => void;
  selectedBgm: string;
  onBgmChange: (id: string) => void;
}

const sections = [
  { key: "opening", label: "🎬 開場白", color: "border-l-primary" },
  { key: "body.0", label: "📝 主要內容 1", color: "border-l-accent" },
  { key: "body.1", label: "📝 主要內容 2", color: "border-l-accent" },
  { key: "closing", label: "🔔 結語 CTA", color: "border-l-success" },
] as const;

function getScriptText(key: string) {
  if (key === "opening") return defaultScript.opening.text;
  if (key === "body.0") return defaultScript.body[0].text;
  if (key === "body.1") return defaultScript.body[1].text;
  if (key === "closing") return defaultScript.closing.text;
  return "";
}

export default function ScriptEditor({
  selectedVoice, onVoiceChange,
  bgmVolume, onBgmVolumeChange,
  voiceVolume, onVoiceVolumeChange,
  selectedBgm, onBgmChange,
}: Props) {
  const [texts, setTexts] = useState<Record<string, string>>(() =>
    Object.fromEntries(sections.map((s) => [s.key, getScriptText(s.key)]))
  );
  const [playing, setPlaying] = useState<string | null>(null);
  const [expandedBgm, setExpandedBgm] = useState(false);

  const handlePlay = (key: string) => {
    setPlaying(playing === key ? null : key);
    if (playing !== key) setTimeout(() => setPlaying(null), 2000);
  };

  const totalWords = Object.values(texts).join("").length;
  const estimatedSeconds = Math.round(totalWords / 4.5);

  return (
    <div className="h-full flex flex-col gap-4 overflow-y-auto pr-1">
      {/* Script sections */}
      <div className="space-y-3">
        {sections.map((s) => (
          <div key={s.key} className={cn("card border-l-4 space-y-2", s.color.replace("border-l-", "border-l-[") + (s.color === "border-l-primary" ? "#6366f1]" : s.color === "border-l-accent" ? "#06b6d4]" : "#22c55e]"))}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-secondary">{s.label}</span>
              <button
                onClick={() => handlePlay(s.key)}
                className={cn(
                  "text-xs px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5",
                  playing === s.key
                    ? "bg-primary/20 text-primary-light animate-pulse"
                    : "bg-background text-text-muted hover:text-primary hover:bg-primary/10"
                )}
              >
                {playing === s.key ? "⏸ 試聽中…" : "▶ 試聽"}
              </button>
            </div>
            <textarea
              value={texts[s.key]}
              onChange={(e) => setTexts((prev) => ({ ...prev, [s.key]: e.target.value }))}
              className="input-base w-full text-sm leading-relaxed resize-none"
              rows={3}
            />
            <div className="text-[10px] text-text-muted text-right">
              {texts[s.key].length} 字 · ~{Math.round(texts[s.key].length / 4.5)}秒
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="flex gap-3 text-center">
        <div className="flex-1 bg-background rounded-xl p-3 border border-border">
          <div className="text-lg font-bold text-gradient">{totalWords}</div>
          <div className="text-[10px] text-text-muted">總字數</div>
        </div>
        <div className="flex-1 bg-background rounded-xl p-3 border border-border">
          <div className="text-lg font-bold text-gradient">{estimatedSeconds}s</div>
          <div className="text-[10px] text-text-muted">預估時長</div>
        </div>
      </div>

      {/* Voice Selector */}
      <div className="card space-y-3">
        <div className="text-xs font-semibold text-text-secondary flex items-center gap-2">
          🎙️ 配音聲音
        </div>
        <div className="space-y-2">
          {voices.map((v) => (
            <button
              key={v.id}
              onClick={() => onVoiceChange(v.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm border transition-all",
                selectedVoice === v.id
                  ? "border-primary/50 bg-primary/10"
                  : "border-border bg-background hover:border-border/80"
              )}
            >
              <div className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs">
                {v.name[0]}
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-xs">{v.name}</div>
                <div className="text-[10px] text-text-muted">{v.mood}</div>
              </div>
              {selectedVoice === v.id && (
                <div className="flex gap-0.5 items-end h-4">
                  {v.waveform.map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-primary-light rounded-full animate-pulse-slow"
                      style={{ height: `${h * 16}px`, animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
        {/* Voice volume */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] text-text-muted">
            <span>🎤 人聲音量</span><span>{voiceVolume}%</span>
          </div>
          <input
            type="range" min={0} max={100} value={voiceVolume}
            onChange={(e) => onVoiceVolumeChange(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
      </div>

      {/* BGM Mixer */}
      <div className="card space-y-3">
        <button
          onClick={() => setExpandedBgm(!expandedBgm)}
          className="w-full flex items-center justify-between text-xs font-semibold text-text-secondary"
        >
          <span>🎵 背景音樂</span>
          <span className={cn("transition-transform", expandedBgm ? "rotate-180" : "")}>▾</span>
        </button>
        {expandedBgm && (
          <div className="space-y-2">
            {bgmTracks.map((t) => (
              <button
                key={t.id}
                onClick={() => onBgmChange(t.id)}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs border transition-all",
                  selectedBgm === t.id
                    ? "border-accent/50 bg-accent/10 text-accent"
                    : "border-border bg-background text-text-secondary hover:border-border/80"
                )}
              >
                <span>{t.mood}</span>
                <span className="font-medium">{t.name}</span>
                <span className="ml-auto text-text-muted">{t.bpm} BPM</span>
              </button>
            ))}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[10px] text-text-muted">
                <span>🎵 BGM 音量</span><span>{bgmVolume}%</span>
              </div>
              <input
                type="range" min={0} max={100} value={bgmVolume}
                onChange={(e) => onBgmVolumeChange(Number(e.target.value))}
                className="w-full accent-accent"
              />
            </div>
          </div>
        )}
        {!expandedBgm && (
          <div className="text-xs text-text-muted">
            {bgmTracks.find((t) => t.id === selectedBgm)?.name ?? "未選擇"} · BGM {bgmVolume}%
          </div>
        )}
      </div>
    </div>
  );
}
