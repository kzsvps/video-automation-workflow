"use client";

import PublishPanel from "@/components/dashboard/PublishPanel";
import StatsChart from "@/components/dashboard/StatsChart";
import FeedbackLoop from "@/components/dashboard/FeedbackLoop";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              發布管理 <span className="text-text-muted font-normal">&</span>{" "}
              <span className="text-gradient">成效追蹤</span>
            </h1>
            <p className="text-text-muted text-sm mt-1">管理你的影片排程，追蹤各平台表現數據</p>
          </div>
          <Link href="/studio" className="btn-primary text-sm px-5 py-2.5">
            ✦ 建立新影片
          </Link>
        </div>

        {/* Main 2-column layout */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left: Publish */}
          <div className="space-y-0">
            <h2 className="text-sm font-semibold text-text-secondary mb-4 flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-accent/20 text-accent flex items-center justify-center text-xs">📤</span>
              發布管理
            </h2>
            <PublishPanel />
          </div>

          {/* Right: Analytics + Feedback */}
          <div className="space-y-0">
            <h2 className="text-sm font-semibold text-text-secondary mb-4 flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-primary/20 text-primary-light flex items-center justify-center text-xs">📊</span>
              成效數據
            </h2>
            <div className="space-y-4">
              <StatsChart />
              <FeedbackLoop />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
