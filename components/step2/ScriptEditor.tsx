"use client";

import { useState, useEffect } from "react";
import { defaultScript, voices, bgmTracks } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/AppContext";
import { Reorder, motion } from "framer-motion";

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

const initialSections = [
  { key: "opening", label: "🎬 開場白", colorClass: "border-l-primary" },
  { key: "body.0", label: "📝 主要內容 1", colorClass: "border-l-accent" },
  { key: "body.1", label: "📝 主要內容 2", colorClass: "border-l-accent" },
  { key: "closing", label: "🔔 結語 CTA", colorClass: "border-l-success" },
];

export default function ScriptEditor({
  selectedVoice, onVoiceChange,
  bgmVolume, onBgmVolumeChange,
  voiceVolume, onVoiceVolumeChange,
  selectedBgm, onBgmChange,
}: Props) {
  const { scriptText, setScriptText } = useApp();
  const [sections, setSections] = useState(initialSections);
  const [playing, setPlaying] = useState<string | null>(null);
  const [expandedBgm, setExpandedBgm] = useState(false);

  // Web Audio API for simple feedback sound
  const playBeep = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1);
    } catch (e) {
      console.warn("Audio feedback failed", e);
    }
  };

  const handlePlay = (key: string) => {
    if (playing !== key) {
      setPlaying(key);
      playBeep();
      setTimeout(() => setPlaying(null), 1500);
    } else {
      setPlaying(null);
    }
  };

  const totalWords = Object.values(scriptText).join("").length;
  const estimatedSeconds = Math.round(totalWords / 4.5);

  return (
    <div className="h-full flex flex-col gap-4 overflow-y-auto pr-1 custom-scrollbar pb-20">
      {/* Script sections with Framer Motion Reorder */}
      <Reorder.Group axis="y" values={sections} onReorder={setSections} className="space-y-3">
        {sections.map((s) => (
          <Reorder.Item key={s.key} value={s} className="relative">
            <div className={cn("card border-l-4 space-y-2 cursor-grab active:cursor-grabbing", s.colorClass)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-text-muted cursor-move hover:text-text-primary px-1">☷</span>
                  <span className="text-xs font-semibold text-text-secondary">{s.label}</span>
                </div>
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => { e.preventDefault(); handlePlay(s.key); }}
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
                onPointerDown={(e) => e.stopPropagation()}
                value={scriptText[s.key] || ""}
                onChange={(e) => setScriptText((prev) => ({ ...prev, [s.key]: e.target.value }))}
                className="input-base w-full text-sm leading-relaxed resize-none focus:ring-1 focus:ring-primary/50"
                rows={3}
              />
              <div className="text-[10px] text-text-muted text-right">
                {(scriptText[s.key] || "").length} 字 · ~{Math.round((scriptText[s.key] || "").length / 4.5)}秒
              </div>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* Stats */}
      <div className="flex gap-3 text-center shrink-0">
        <div className="flex-1 bg-background rounded-xl p-3 border border-border shadow-sm">
          <div className="text-lg font-bold text-gradient">{totalWords}</div>
          <div className="text-[10px] text-text-muted">總字數</div>
        </div>
        <div className="flex-1 bg-background rounded-xl p-3 border border-border shadow-sm">
          <div className="text-lg font-bold text-gradient">{estimatedSeconds}s</div>
          <div className="text-[10px] text-text-muted">預估時長</div>
        </div>
      </div>

      {/* Voice Selector */}
      <div className="card space-y-3 shrink-0">
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
                  ? "border-primary/50 bg-primary/10 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                  : "border-border bg-background hover:border-border/80"
              )}
            >
              <div className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs shadow-md">
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
                      className="w-1 bg-primary-light rounded-full animate-pulse-slow object-bottom"
                      style={{ height: `${h * 16}px`, animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
        {/* Voice volume */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-[10px] text-text-muted">
            <span>🎤 人聲音量</span><span>{voiceVolume}%</span>
          </div>
          <input
            type="range" min={0} max={100} value={voiceVolume}
            onChange={(e) => onVoiceVolumeChange(Number(e.target.value))}
            className="w-full accent-primary h-1.5 bg-border rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* BGM Mixer */}
      <div className="card space-y-3 shrink-0">
        <button
          onClick={() => setExpandedBgm(!expandedBgm)}
          className="w-full flex items-center justify-between text-xs font-semibold text-text-secondary group"
        >
          <span className="group-hover:text-primary transition-colors">🎵 背景音樂</span>
          <span className={cn("transition-transform duration-300", expandedBgm ? "rotate-180" : "")}>▾</span>
        </button>
        {expandedBgm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="space-y-2 overflow-hidden">
            {bgmTracks.map((t) => (
              <button
                key={t.id}
                onClick={() => onBgmChange(t.id)}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs border transition-all",
                  selectedBgm === t.id
                    ? "border-accent/50 bg-accent/10 text-accent font-medium shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                    : "border-border bg-background text-text-secondary hover:border-border/80 hover:bg-surface"
                )}
              >
                <span>{t.mood}</span>
                <span>{t.name}</span>
                <span className="ml-auto text-[10px] text-text-muted opacity-80">{t.bpm} BPM</span>
              </button>
            ))}
            <div className="space-y-1.5 pt-3">
              <div className="flex justify-between text-[10px] text-text-muted">
                <span>🎵 BGM 音量</span><span>{bgmVolume}%</span>
              </div>
              <input
                type="range" min={0} max={100} value={bgmVolume}
                onChange={(e) => onBgmVolumeChange(Number(e.target.value))}
                className="w-full accent-accent h-1.5 bg-border rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </motion.div>
        )}
        {!expandedBgm && (
          <div className="text-xs text-text-muted bg-surface py-1.5 px-3 rounded-lg border border-border inline-block">
            {bgmTracks.find((t) => t.id === selectedBgm)?.name ?? "未選擇"} · BGM {bgmVolume}%
          </div>
        )}
      </div>
    </div>
  );
}
