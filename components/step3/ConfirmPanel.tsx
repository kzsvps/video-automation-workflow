"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { voices, subtitleTemplates, storyboardFrames, platforms, personas } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface Props {
  topic: string;
  platform: string;
  duration: number;
  personaId: string;
  selectedVoice: string;
  selectedTemplate: string;
}

const generateSteps = [
  { label: "分析腳本語意", icon: "📝", duration: 1200 },
  { label: "合成 AI 語音軌道", icon: "🎙️", duration: 1800 },
  { label: "套用字幕與特效", icon: "✨", duration: 1500 },
  { label: "壓製最終影片", icon: "🎬", duration: 1000 },
];

export default function ConfirmPanel(props: Props) {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [done, setDone] = useState(false);

  const voice = voices.find((v) => v.id === props.selectedVoice) ?? voices[0];
  const template = subtitleTemplates.find((t) => t.id === props.selectedTemplate) ?? subtitleTemplates[0];
  const plt = platforms.find((p) => p.id === props.platform) ?? platforms[0];
  const persona = personas.find((p) => p.id === props.personaId) ?? personas[0];

  const handleGenerate = () => {
    setGenerating(true);
    let step = 0;
    const runStep = () => {
      setCurrentStep(step);
      if (step < generateSteps.length - 1) {
        setTimeout(() => { step++; runStep(); }, generateSteps[step].duration);
      } else {
        setTimeout(() => {
          setDone(true);
          setTimeout(() => router.push("/dashboard"), 1500);
        }, generateSteps[step].duration);
      }
    };
    runStep();
  };

  const totalWords = 180;
  const estimatedSec = props.duration;

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">
          <span className="text-gradient">Step 3</span>
          <span className="text-text-primary ml-2">— 確認與生成</span>
        </h1>
        <p className="text-text-muted text-sm mt-1">最後確認所有設定，準備好就一鍵生成！</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Video Info */}
        <div className="card space-y-3">
          <div className="text-xs font-semibold text-text-muted uppercase tracking-wider">📋 任務總覽</div>
          <div className="space-y-2">
            {[
              { label: "主題", value: props.topic.substring(0, 40) + (props.topic.length > 40 ? "…" : ""), icon: "💡" },
              { label: "平台", value: `${plt.icon} ${plt.name} (${plt.ratio})`, icon: "" },
              { label: "預估時長", value: `${estimatedSec} 秒`, icon: "⏱" },
              { label: "人設", value: `${persona.emoji} ${persona.name}`, icon: "" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-2">
                <span className="text-xs text-text-muted w-14 shrink-0">{item.label}</span>
                <span className="text-xs text-text-primary font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Audio / Subtitle */}
        <div className="card space-y-3">
          <div className="text-xs font-semibold text-text-muted uppercase tracking-wider">🎚️ 音訊 & 字幕</div>
          <div className="space-y-2">
            {[
              { label: "聲音", value: voice.name },
              { label: "語言", value: voice.lang },
              { label: "字幕模板", value: template.name },
              { label: "動效", value: template.animation },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="text-xs text-text-muted w-14 shrink-0">{item.label}</span>
                <span className="text-xs text-text-primary font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Storyboard thumbnails */}
      <div className="card space-y-3">
        <div className="text-xs font-semibold text-text-muted uppercase tracking-wider">🎬 分鏡預覽</div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {storyboardFrames.map((f, i) => (
            <div key={f.id} className="shrink-0 text-center">
              <div className="w-20 h-12 bg-background rounded-xl border border-border flex items-center justify-center text-2xl">
                {f.thumbnail}
              </div>
              <div className="text-[9px] text-text-muted mt-1 w-20 truncate">{f.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Checklist */}
      <div className="card space-y-2">
        <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">✅ 生成前檢查清單</div>
        {[
          { label: "腳本字數符合平台限制", ok: true },
          { label: "聲音模型已選擇", ok: true },
          { label: "字幕樣式已設定", ok: true },
          { label: "合規掃描通過", ok: true },
          { label: "目標平台格式：" + plt.ratio, ok: true },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2.5 text-sm">
            <div className={cn(
              "w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0",
              item.ok ? "bg-success/20 text-success" : "bg-danger/20 text-danger"
            )}>
              {item.ok ? "✓" : "✕"}
            </div>
            <span className="text-text-secondary">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Generate Button + Progress */}
      {!generating && !done && (
        <button onClick={handleGenerate} className="btn-primary w-full py-4 text-lg font-bold text-center glow-primary">
          🚀 開始生成影片
        </button>
      )}

      {generating && !done && (
        <div className="card space-y-4">
          <div className="text-sm font-semibold text-text-primary text-center">AI 正在生成你的影片…</div>
          <div className="space-y-3">
            {generateSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0 transition-all",
                  i < currentStep ? "bg-success/20 text-success" :
                  i === currentStep ? "bg-primary/20 text-primary-light animate-pulse" :
                  "bg-background text-text-muted border border-border"
                )}>
                  {i < currentStep ? "✓" : step.icon}
                </div>
                <div className="flex-1">
                  <div className={cn(
                    "text-sm transition-colors",
                    i < currentStep ? "text-success" :
                    i === currentStep ? "text-text-primary font-medium" :
                    "text-text-muted"
                  )}>
                    {step.label}
                  </div>
                  {i === currentStep && (
                    <div className="mt-1 h-1 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full animate-shimmer" style={{ width: "60%", backgroundSize: "200% 100%" }} />
                    </div>
                  )}
                </div>
                {i === currentStep && <div className="text-xs text-primary-light animate-pulse">進行中</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {done && (
        <div className="card text-center space-y-2 border-success/30 bg-success/5">
          <div className="text-3xl">🎉</div>
          <div className="font-bold text-success text-lg">影片生成完成！</div>
          <div className="text-text-muted text-sm">正在跳轉至發布管理…</div>
        </div>
      )}
    </div>
  );
}
