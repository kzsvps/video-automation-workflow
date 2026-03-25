"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { voices } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/AppContext";

interface Props { onClose: () => void }

const steps = [
  "打開錄音軟體（手機備忘錄或電腦 QuickTime）",
  "用自然語速朗讀以下範本腳本（約 2 分鐘）",
  "將錄製的音檔上傳至下方區域",
  "等待 AI 訓練專屬聲音模型（約 3-5 分鐘）",
];

const script = `大家好，我是這個頻道的創作者。今天想跟你們分享一些我最近的想法。在這個快速變化的時代，我們每天都面臨各種挑戰，但同時也有無數的機會等著我們去把握。希望透過這個頻道，我能夠帶給你們一些有價值的內容和啟發。`;

export default function VoiceLabDrawer({ onClose }: Props) {
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState<"clone" | "library">("library");
  const [selected, setSelected] = useState("voice-1");
  const [playing, setPlaying] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const playTone = (id: string) => {
    if (typeof window === "undefined") return;
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = id === "voice-1" ? 280 : id === "voice-2" ? 220 : 320;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    } catch {}
    setPlaying(id);
    setTimeout(() => setPlaying(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-[400px] h-full bg-surface border-l border-border flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <h2 className="font-bold text-lg">🎙️ AI 聲音實驗室</h2>
            <p className="text-xs text-text-muted mt-0.5">克隆聲音或選擇內建 TTS</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-background hover:bg-white/10 flex items-center justify-center text-text-secondary transition-colors">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {(["library", "clone"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={cn("flex-1 py-3 text-sm font-medium transition-colors",
                activeTab === tab ? "text-primary-light border-b-2 border-primary" : "text-text-muted hover:text-text-secondary"
              )}>
              {tab === "library" ? "🎵 聲音庫" : "🔬 聲音克隆"}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "library" && (
            <div className="space-y-3">
              <p className="text-xs text-text-muted">選擇一個內建高擬真 AI 配音</p>
              {voices.map(v => (
                <div key={v.id} onClick={() => setSelected(v.id)}
                  className={cn("p-4 rounded-2xl border cursor-pointer transition-all", selected === v.id ? "border-primary/60 bg-primary/10" : "border-border bg-background hover:border-border/60")}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold shrink-0">
                      {v.name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{v.name}</div>
                      <div className="text-xs text-text-muted">{v.lang} · {v.mood}</div>
                    </div>
                    <button onClick={e => { e.stopPropagation(); playTone(v.id); }}
                      className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all", playing === v.id ? "bg-primary/20 text-primary-light animate-pulse" : "bg-background border border-border text-text-muted hover:text-primary hover:border-primary/40")}>
                      {playing === v.id ? "⏸ 播放中" : "▶ 試聽"}
                    </button>
                  </div>
                  {selected === v.id && (
                    <div className="flex gap-0.5 items-end h-5 mt-3 pl-13">
                      {v.waveform.map((h, i) => (
                        <div key={i} className="w-1.5 bg-primary-light/60 rounded-full animate-pulse-slow"
                          style={{ height: `${h * 18}px`, animationDelay: `${i * 0.08}s` }} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <button className="w-full p-3 rounded-xl border border-dashed border-border text-text-muted text-sm hover:border-primary/40 hover:text-primary transition-colors">
                + 探索更多聲音
              </button>
            </div>
          )}

          {activeTab === "clone" && (
            <div className="space-y-4">
              <div className="card bg-primary/5 border-primary/20 space-y-2">
                <div className="text-sm font-semibold text-primary-light">📋 錄音引導步驟</div>
                {steps.map((s, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-text-secondary">
                    <span className="w-5 h-5 rounded-full bg-primary/20 text-primary-light flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                    {s}
                  </div>
                ))}
              </div>

              <div className="card space-y-2">
                <div className="text-xs font-semibold text-text-secondary">📝 範本腳本</div>
                <div className="bg-background rounded-xl p-3 text-xs text-text-secondary leading-relaxed border border-border">
                  {script}
                </div>
                <button onClick={() => { navigator.clipboard?.writeText(script); addToast("腳本已複製到剪貼板"); }}
                  className="text-xs text-primary-light hover:text-primary transition-colors">
                  📋 複製腳本
                </button>
              </div>

              <div onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); setUploaded(true); addToast("音檔上傳成功！AI 訓練中…", "info"); }}
                className={cn("border-2 border-dashed rounded-2xl p-8 text-center transition-all", dragOver ? "border-primary bg-primary/10" : "border-border hover:border-primary/50")}>
                {uploaded ? (
                  <div className="space-y-2">
                    <div className="text-2xl">✅</div>
                    <div className="text-sm font-medium text-success">音檔已上傳</div>
                    <div className="text-xs text-text-muted animate-pulse">AI 訓練中…預計 3-5 分鐘</div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-3xl">🎤</div>
                    <div className="text-sm text-text-muted">拖拉音檔至此，或</div>
                    <label className="btn-primary text-xs px-4 py-2 cursor-pointer inline-block">
                      點擊上傳
                      <input type="file" accept="audio/*" className="hidden" onChange={() => { setUploaded(true); addToast("音檔上傳成功！AI 訓練中…", "info"); }} />
                    </label>
                    <div className="text-[10px] text-text-muted">支援 MP3、WAV、M4A · 建議 2 分鐘以上</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border">
          <button onClick={() => { addToast(`已套用聲音：${voices.find(v => v.id === selected)?.name}`); onClose(); }}
            className="btn-primary w-full py-3 text-center">
            套用所選聲音
          </button>
        </div>
      </motion.div>
    </div>
  );
}
