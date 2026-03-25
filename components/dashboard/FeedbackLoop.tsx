"use client";

import { useState } from "react";
import { analyticsData } from "@/lib/mockData";

export default function FeedbackLoop() {
  const [updated, setUpdated] = useState(false);

  return (
    <div className="card space-y-4 border-gradient">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs">
          🔄
        </div>
        <div>
          <div className="text-sm font-bold text-text-primary">AI 覆盤分析</div>
          <div className="text-[10px] text-text-muted">基於本週數據的閉環優化建議</div>
        </div>
      </div>

      <div className="bg-background rounded-xl p-4 border border-border text-sm text-text-secondary leading-relaxed">
        💡 {analyticsData.aiInsight}
      </div>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="bg-primary/10 rounded-xl p-3 border border-primary/20">
          <div className="text-base font-bold text-primary-light">+23%</div>
          <div className="text-[10px] text-text-muted">震驚型標題完播率優勢</div>
        </div>
        <div className="bg-accent/10 rounded-xl p-3 border border-accent/20">
          <div className="text-base font-bold text-accent">8.1%</div>
          <div className="text-[10px] text-text-muted">幽默語氣互動率</div>
        </div>
      </div>

      {!updated ? (
        <button
          onClick={() => setUpdated(true)}
          className="btn-primary w-full text-center py-3 text-sm"
        >
          🔁 將建議更新至人設設定
        </button>
      ) : (
        <div className="w-full py-3 text-center text-sm bg-success/10 border border-success/30 rounded-xl text-success font-medium">
          ✓ 人設已更新！下次生成將採用新偏好
        </div>
      )}
    </div>
  );
}
