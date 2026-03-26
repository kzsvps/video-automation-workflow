"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { voices, subtitleTemplates, storyboardFrames, platforms, personas } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/AppContext";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  topic: string;
  platforms: string[];
  duration: number;
  personaId: string;
  selectedVoice: string;
  selectedTemplate: string;
}

const generateSteps = [
  { label: "分析腳本語意", icon: "📝", duration: 1200 },
  { label: "合成 AI 語音軌道", icon: "🎙️", duration: 1800 },
  { label: "套用字幕與特效", icon: "✨", duration: 1500 },
  { label: "壓製最終影片", icon: "🎬", duration: 2500 },
];

export default function ConfirmPanel(props: Props) {
  const router = useRouter();
  const { scriptText, uploadedFiles, activeFrame, addToast, addScheduledEvent } = useApp();
  const [generating, setGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [done, setDone] = useState(false);
  const [remainingSec, setRemainingSec] = useState(0);

  // Scheduling states
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleTime, setScheduleTime] = useState("");

  const voice = voices.find((v) => v.id === props.selectedVoice) ?? voices[0];
  const template = subtitleTemplates.find((t) => t.id === props.selectedTemplate) ?? subtitleTemplates[0];
  const selectedPlts = platforms.filter(p => props.platforms.includes(p.id));
  const persona = personas.find((p) => p.id === props.personaId) ?? personas[0];

  const totalWords = Object.values(scriptText).join("").length || 180;
  const estimatedSec = totalWords > 0 ? Math.round(totalWords / 4.5) : props.duration;

  const combinedFrames = [
    ...uploadedFiles.map((url, i) => ({ id: `upload-${i}`, isUpload: true, url, label: `自訂素材 ${i + 1}`, thumbnail: "" })),
    ...storyboardFrames.map(f => ({ ...f, isUpload: false, url: "" }))
  ];
  
  const currentFrameData = combinedFrames[activeFrame % combinedFrames.length] || combinedFrames[0];

  useEffect(() => {
    if (generating && !done && remainingSec > 0) {
      const timer = setTimeout(() => setRemainingSec(s => s - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [generating, done, remainingSec]);

  const handleGenerate = (isScheduled = false) => {
    if (isScheduled && !scheduleTime) {
      addToast("請選擇排程時間", "error");
      return;
    }
    setShowScheduleModal(false);
    setGenerating(true);
    const totalDuration = generateSteps.reduce((acc, step) => acc + step.duration, 0);
    setRemainingSec(Math.ceil(totalDuration / 1000));
    
    let step = 0;
    const runStep = () => {
      setCurrentStep(step);
      if (step < generateSteps.length - 1) {
        setTimeout(() => { step++; runStep(); }, generateSteps[step].duration);
      } else {
        setTimeout(() => {
          setDone(true);
          if (isScheduled) {
            addScheduledEvent({
              id: `sched-${Date.now()}`,
              title: props.topic || "新影片",
              platform: "TikTok / IG Reels / YouTube",
              scheduledAt: new Date(scheduleTime).toLocaleString("zh-TW"),
              status: "scheduled",
              thumbnail: currentFrameData?.isUpload ? "🎬" : (currentFrameData?.thumbnail || "🎬"),
            });
            addToast(`影片將於 ${new Date(scheduleTime).toLocaleString("zh-TW")} 發布！`, "success");
          }
          setTimeout(() => router.push("/dashboard"), 1500);
        }, generateSteps[step].duration);
      }
    };
    runStep();
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6 animate-fade-in pb-20 overflow-y-auto custom-scrollbar h-full relative">
      <div>
        <h1 className="text-2xl font-bold">
          <span className="text-gradient">Step 3</span>
          <span className="text-text-primary ml-2">— 確認與生成</span>
        </h1>
        <p className="text-text-muted text-sm mt-1">最後確認所有設定，準備好就一鍵生成！</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Video Info */}
        <div className="card space-y-3">
          <div className="text-xs font-semibold text-text-muted uppercase tracking-wider">📋 任務總覽</div>
          <div className="space-y-2">
            {[
              { label: "主題", value: props.topic.substring(0, 40) + (props.topic.length > 40 ? "…" : ""), icon: "💡" },
              { label: "發布平台", value: selectedPlts.length > 0 ? selectedPlts.map(p => `${p.icon} ${p.name}`).join("、") : "未選擇", icon: "" },
              { label: "預估時長", value: `${estimatedSec} 秒 (${totalWords} 字)`, icon: "⏱" },
              { label: "目前人設", value: `${persona.emoji} ${persona.name}`, icon: "" },
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
              { label: "配音聲音", value: voice.name },
              { label: "發音語言", value: voice.lang },
              { label: "字幕模板", value: template.name },
              { label: "字幕動效", value: template.animation },
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
        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
          {combinedFrames.map((f, i) => (
            <div key={f.id} className={cn("shrink-0 text-center transition-all", i === activeFrame ? "scale-105" : "opacity-60 hover:opacity-100")}>
              <div className={cn("w-24 h-14 bg-background rounded-xl border flex items-center justify-center text-3xl overflow-hidden relative", i === activeFrame ? "border-primary ring-2 ring-primary/20 shadow-sm" : "border-border")}>
                {f.isUpload ? (
                  <img src={f.url} alt={f.label} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  f.thumbnail
                )}
                {i === activeFrame && <div className="absolute inset-0 ring-inset ring-2 ring-primary pointer-events-none rounded-xl"></div>}
              </div>
              <div className={cn("text-[10px] mt-1.5 w-24 truncate", i === activeFrame ? "text-primary font-medium" : "text-text-muted")}>
                {f.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Checklist */}
      <div className="card space-y-2">
        <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">✅ 生成前檢查清單</div>
        {[
          { label: "腳本字數符合平台限制", ok: totalWords > 0 },
          { label: "聲音模型已選擇", ok: !!props.selectedVoice },
          { label: "字幕樣式已設定", ok: !!props.selectedTemplate },
          { label: "合規掃描通過", ok: true },
          { label: `目標平台數量：${selectedPlts.length}`, ok: selectedPlts.length > 0 },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2.5 text-sm">
            <div className={cn(
              "w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0",
              item.ok ? "bg-success/20 text-success" : "bg-warning/20 text-warning"
            )}>
              {item.ok ? "✓" : "!"}
            </div>
            <span className={cn(item.ok ? "text-text-secondary" : "text-warning")}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      {!generating && !done && (
        <div className="flex gap-4 mt-4">
          <button 
            onClick={() => setShowScheduleModal(true)} 
            className="flex-1 py-4 text-base font-bold text-center rounded-xl border border-border bg-surface hover:bg-surface-hover hover:border-text-muted transition-all text-text-secondary"
          >
            🕒 排程發布
          </button>
          <button 
            onClick={() => handleGenerate(false)} 
            className="flex-[2] btn-primary py-4 text-lg font-bold text-center glow-primary"
          >
            🚀 立即生成影片
          </button>
        </div>
      )}

      {/* Schedule Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowScheduleModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm card space-y-4 shadow-2xl border-primary/20"
            >
              <h3 className="font-bold text-lg text-text-primary">🕒 設定排程發布時間</h3>
              <p className="text-xs text-text-muted">影片生成後將在指定時間自動發布至已選平台。</p>
              
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">選擇日期與時間</label>
                <input 
                  type="datetime-local" 
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="input-base w-full text-text-primary custom-calendar-icon"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 py-2 text-sm font-medium border border-border rounded-xl hover:bg-surface transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={() => handleGenerate(true)}
                  className="flex-1 py-2 text-sm font-medium bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors shadow-primary/30 shadow-lg"
                >
                  確認排程
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generating Progress */}
      {generating && !done && (
        <div className="card space-y-4 border-primary/20 bg-primary/5">
          <div className="flex justify-between items-center">
            <div className="text-sm font-semibold text-primary">AI 正在生成你的影片…</div>
            <div className="text-xs font-medium bg-background px-2 py-1 rounded-md text-text-secondary border border-border shadow-sm">
              預估剩餘 <span className="text-primary font-bold">{remainingSec}</span> 秒
            </div>
          </div>
          <div className="space-y-3">
            {generateSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0 transition-all shadow-sm",
                  i < currentStep ? "bg-success/20 text-success border border-success/30" :
                  i === currentStep ? "bg-primary text-white shadow-primary/30 animate-pulse-slow" :
                  "bg-background text-text-muted border border-border"
                )}>
                  {i < currentStep ? "✓" : step.icon}
                </div>
                <div className="flex-1">
                  <div className={cn(
                    "text-sm transition-colors",
                    i < currentStep ? "text-success font-medium" :
                    i === currentStep ? "text-text-primary font-bold" :
                    "text-text-muted"
                  )}>
                    {step.label}
                  </div>
                  {i === currentStep && (
                    <div className="mt-1.5 h-1.5 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full animate-shimmer" style={{ width: "60%", backgroundSize: "200% 100%" }} />
                    </div>
                  )}
                </div>
                {i === currentStep && <div className="text-xs font-medium text-primary animate-pulse">進行中…</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Done State */}
      {done && (
        <div className="card text-center space-y-3 border-success/40 bg-success/10 shadow-sm py-8 animate-fade-in">
          <div className="text-5xl animate-bounce">🎉</div>
          <div className="font-bold text-success text-xl">影片準備完成！</div>
          <div className="text-text-muted text-sm">即將跳轉至發布管理…</div>
          <div className="w-12 h-1 bg-success/20 rounded-full mx-auto overflow-hidden">
             <div className="h-full bg-success rounded-full animate-shimmer" style={{ width: "100%", backgroundSize: "200% 100%", animationDuration: "1.5s" }} />
          </div>
        </div>
      )}
    </div>
  );
}
