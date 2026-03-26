"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import IdeaInput from "@/components/step1/IdeaInput";
import ScriptEditor from "@/components/step2/ScriptEditor";
import PhonePreview from "@/components/step2/PhonePreview";
import ConfirmPanel from "@/components/step3/ConfirmPanel";
import { useApp } from "@/lib/AppContext";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  { id: 1, label: "靈感輸入", icon: "💡" },
  { id: 2, label: "生成調試", icon: "🛠️" },
  { id: 3, label: "確認生成", icon: "✅" },
];

interface StepData {
  topic: string;
  platforms: string[];
  duration: number;
  personaId: string;
}

export default function StudioPage() {
  const { setScriptText } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [stepData, setStepData] = useState<StepData>({
    topic: "",
    platforms: ["tiktok", "ig-reels", "youtube-shorts"],
    duration: 60,
    personaId: "1",
  });
  const [selectedVoice, setSelectedVoice] = useState("voice-1");
  const [selectedTemplate, setSelectedTemplate] = useState("mrbeast");
  const [bgmVolume, setBgmVolume] = useState(30);
  const [voiceVolume, setVoiceVolume] = useState(85);
  const [selectedBgm, setSelectedBgm] = useState("bgm-1");

  // ── Resizable split panel ──────────────────────────────────────────
  const [scriptWidth, setScriptWidth] = useState(320);
  const MIN_SCRIPT = 220;
  const MAX_SCRIPT = 560;
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const onDividerMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    startX.current = e.clientX;
    startWidth.current = scriptWidth;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, [scriptWidth]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = e.clientX - startX.current;
      const next = Math.min(MAX_SCRIPT, Math.max(MIN_SCRIPT, startWidth.current + delta));
      setScriptWidth(next);
    };
    const onMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);
  // ──────────────────────────────────────────────────────────────────

  const slideVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Top progress bar */}
      <div className="sticky top-0 z-30 glass border-b border-border px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-0">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center flex-1">
              <button
                onClick={() => step.id <= currentStep && !isGenerating && setCurrentStep(step.id)}
                className={cn(
                  "flex items-center gap-2.5 px-4 py-2 rounded-xl transition-all font-medium text-sm",
                  step.id === currentStep
                    ? "bg-primary/15 text-primary-light"
                    : step.id < currentStep
                    ? "text-success cursor-pointer hover:bg-success/10"
                    : "text-text-muted cursor-default"
                )}
              >
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-transform",
                  step.id === currentStep ? "bg-primary text-white shadow-lg scale-110" :
                  step.id < currentStep ? "bg-success/20 text-success" :
                  "bg-border text-text-muted"
                )}>
                  {step.id < currentStep ? "✓" : step.icon}
                </div>
                <span>Step {step.id}  {step.label}</span>
              </button>
              {i < steps.length - 1 && (
                <div className={cn(
                  "flex-1 h-px mx-2 transition-colors duration-500",
                  step.id < currentStep ? "bg-success" : "bg-border"
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Loading Overlay for step 1 -> step 2 transition */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center"
          >
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin glow-primary mb-4" />
            <h2 className="text-xl font-bold text-gradient">AI 生成中...</h2>
            <p className="text-sm text-text-muted mt-2">正在為您自動拆解腳本並尋找素材，請稍候</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step Content */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div key="step1" variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className="flex-1 overflow-y-auto w-full h-full">
              <IdeaInput
                onNext={(data) => {
                  setStepData({
                    topic: data.topic,
                    platforms: data.platforms,
                    duration: data.duration,
                    personaId: data.personaId,
                  });
                  if (data.generatedScript) {
                    setScriptText({
                      opening: data.generatedScript.opening,
                      "body.0": data.generatedScript.body0,
                      "body.1": data.generatedScript.body1 || "",
                      closing: data.generatedScript.closing,
                    });
                  }
                  
                  setIsGenerating(true);
                  setTimeout(() => {
                    setIsGenerating(false);
                    setCurrentStep(2);
                  }, 1200);
                }}
              />
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div key="step2" variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className="flex-1 flex flex-col h-full">
              <div ref={containerRef} className="flex flex-1 overflow-hidden min-h-0 select-none">
                {/* Left: Script — resizable */}
                <div
                  className="shrink-0 border-r border-border overflow-y-auto bg-background/60 flex flex-col"
                  style={{ width: scriptWidth }}
                >
                  <div className="px-4 pt-4 pb-2 border-b border-border bg-white sticky top-0 z-10">
                    <h2 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                      <span className="text-gradient">Step 2</span>
                      <span>腳本 & 音軌</span>
                    </h2>
                    <p className="text-[11px] text-text-muted mt-0.5">編輯腳本、選聲音與 BGM</p>
                  </div>
                  <div className="p-3 flex-1 overflow-y-auto">
                    <ScriptEditor
                      selectedVoice={selectedVoice}
                      onVoiceChange={setSelectedVoice}
                      bgmVolume={bgmVolume}
                      onBgmVolumeChange={setBgmVolume}
                      voiceVolume={voiceVolume}
                      onVoiceVolumeChange={setVoiceVolume}
                      selectedBgm={selectedBgm}
                      onBgmChange={setSelectedBgm}
                    />
                  </div>
                </div>

                {/* Drag divider */}
                <div
                  onMouseDown={onDividerMouseDown}
                  className="group relative w-[5px] shrink-0 cursor-col-resize flex items-center justify-center bg-transparent hover:bg-primary/10 active:bg-primary/20 transition-colors z-10"
                  title="拖曳調整面板寬度"
                >
                  {/* visual pill */}
                  <div className="w-[3px] h-10 rounded-full bg-border group-hover:bg-primary/40 group-active:bg-primary transition-colors" />
                  {/* invisible wider hit area */}
                  <div className="absolute inset-y-0 -left-1.5 -right-1.5" />
                </div>

                {/* Right: Preview — takes remaining space */}
                <div className="flex-1 flex flex-col overflow-y-auto min-w-0">
                  <div className="px-6 pt-4 pb-2 border-b border-border bg-white sticky top-0 z-10">
                    <h3 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                      所見即所得預覽
                      <span className="text-[10px] font-normal text-text-muted ml-1">字幕 · 素材 · 畫面效果即時更新</span>
                    </h3>
                  </div>
                  <div className="flex-1 p-6">
                    <PhonePreview
                      selectedTemplate={selectedTemplate}
                      onTemplateChange={setSelectedTemplate}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Nav */}
              <div className="shrink-0 glass border-t border-border px-8 py-4 z-20">
                <div className="flex justify-between items-center max-w-5xl mx-auto">
                  <button onClick={() => setCurrentStep(1)} className="btn-secondary px-6">
                    ← 返回修改靈感
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="btn-primary px-10 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow"
                  >
                    前往確認 →
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div key="step3" variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className="flex-1 flex flex-col h-full overflow-y-auto w-full">
              <ConfirmPanel
                topic={stepData.topic || "AI 工具介紹：2025 年最值得學的 3 個工具"}
                platforms={stepData.platforms}
                duration={stepData.duration}
                personaId={stepData.personaId}
                selectedVoice={selectedVoice}
                selectedTemplate={selectedTemplate}
              />
              <div className="shrink-0 glass border-t border-border px-8 py-4 sticky bottom-0 z-20 mt-auto">
                <div className="max-w-5xl mx-auto">
                  <button onClick={() => setCurrentStep(2)} className="btn-secondary px-6">
                    ← 返回調試腳本
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
