"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import IdeaInput from "@/components/step1/IdeaInput";
import ScriptEditor from "@/components/step2/ScriptEditor";
import PhonePreview from "@/components/step2/PhonePreview";
import ConfirmPanel from "@/components/step3/ConfirmPanel";

const steps = [
  { id: 1, label: "靈感輸入", icon: "💡" },
  { id: 2, label: "生成調試", icon: "🛠️" },
  { id: 3, label: "確認生成", icon: "✅" },
];

interface StepData {
  topic: string;
  platform: string;
  duration: number;
  personaId: string;
}

export default function StudioPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepData, setStepData] = useState<StepData>({
    topic: "",
    platform: "tiktok",
    duration: 60,
    personaId: "1",
  });
  const [selectedVoice, setSelectedVoice] = useState("voice-1");
  const [selectedTemplate, setSelectedTemplate] = useState("mrbeast");
  const [bgmVolume, setBgmVolume] = useState(30);
  const [voiceVolume, setVoiceVolume] = useState(85);
  const [selectedBgm, setSelectedBgm] = useState("bgm-1");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top progress bar */}
      <div className="sticky top-0 z-30 glass border-b border-border px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-0">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center flex-1">
              <button
                onClick={() => step.id <= currentStep && setCurrentStep(step.id)}
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
                  "w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                  step.id === currentStep ? "bg-primary text-white shadow-lg" :
                  step.id < currentStep ? "bg-success/20 text-success" :
                  "bg-border text-text-muted"
                )}>
                  {step.id < currentStep ? "✓" : step.icon}
                </div>
                <span>Step {step.id}  {step.label}</span>
              </button>
              {i < steps.length - 1 && (
                <div className={cn(
                  "flex-1 h-px mx-2",
                  step.id < currentStep ? "bg-success/40" : "bg-border"
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1">
        {currentStep === 1 && (
          <IdeaInput
            onNext={(data) => {
              setStepData(data);
              setCurrentStep(2);
            }}
          />
        )}

        {currentStep === 2 && (
          <div className="flex h-[calc(100vh-72px)]">
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
            <div className="w-[340px] p-6 overflow-y-auto bg-background/50">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-text-secondary">所見即所得預覽</h3>
                <p className="text-xs text-text-muted mt-0.5">即時查看字幕與畫面效果</p>
              </div>
              <PhonePreview
                selectedTemplate={selectedTemplate}
                onTemplateChange={setSelectedTemplate}
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="sticky bottom-0 glass border-t border-border px-8 py-4">
            <div className="flex justify-between items-center">
              <button onClick={() => setCurrentStep(1)} className="btn-secondary">
                ← 返回上一步
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="btn-primary px-8"
              >
                前往確認 →
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <>
            <ConfirmPanel
              topic={stepData.topic || "AI 工具介紹：2025 年最值得學的 3 個工具"}
              platform={stepData.platform}
              duration={stepData.duration}
              personaId={stepData.personaId}
              selectedVoice={selectedVoice}
              selectedTemplate={selectedTemplate}
            />
            <div className="sticky bottom-0 glass border-t border-border px-8 py-4">
              <button onClick={() => setCurrentStep(2)} className="btn-secondary">
                ← 返回調試
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
