"use client";

import { useState } from "react";
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
              <div className="flex flex-1 overflow-hidden min-h-0">
                {/* Left: Script */}
                <div className="flex-1 p-6 overflow-y-auto border-r border-border">
                  <div className="mb-4">
                    <h2 className="text-xl font-bold">
                      <span className="text-gradient">Step 2</span>
                      <span className="text-text-primary ml-2">— 腳本與音軌調試</span>
                    </h2>
                    <p className="text-xs text-text-muted mt-1">調整 AI 生成的腳本，選擇聲音與背景音樂</p>
                  </div>
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

                {/* Right: Preview */}
                <div className="w-[340px] md:w-[400px] p-6 overflow-y-auto bg-background/30 border-l border-border/50 shadow-inner">
                  <div className="mb-4">
                    <h3 className="text-sm font-bold text-text-secondary">所見即所得預覽</h3>
                    <p className="text-xs text-text-muted mt-0.5">即時查看字幕、素材與畫面效果</p>
                  </div>
                  <PhonePreview
                    selectedTemplate={selectedTemplate}
                    onTemplateChange={setSelectedTemplate}
                  />
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
