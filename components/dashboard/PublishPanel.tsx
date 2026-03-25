"use client";

import { useState } from "react";
import { scheduledPosts, platforms } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const statusColors = {
  scheduled: "bg-primary/20 text-primary-light",
  draft: "bg-warning/20 text-warning",
  published: "bg-success/20 text-success",
};
const statusLabels = { scheduled: "已排程", draft: "草稿", published: "已發布" };

// Simple month calendar mock
const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
const scheduledDays = [27, 28, 29];
const today = 26;

export default function PublishPanel() {
  const [activePost, setActivePost] = useState<string | null>(null);
  const [title, setTitle] = useState("你一定沒用過的 AI 工具！90% 的人都不知道");
  const [desc, setDesc] = useState("今天分享一個改變我工作方式的 AI 工具，讓你的生產力直接翻倍！");
  const [hashtags, setHashtags] = useState("#AI工具 #效率提升 #科技 #人工智慧 #工作技巧");

  return (
    <div className="space-y-4">
      {/* Calendar */}
      <div className="card space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-text-secondary">📅 發布行事曆</div>
          <span className="text-xs text-text-muted">2026 年 3 月</span>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {["日", "一", "二", "三", "四", "五", "六"].map((d) => (
            <div key={d} className="text-[9px] text-text-muted py-1">{d}</div>
          ))}
          {/* offset for March 2026 starting on Sunday */}
          {Array.from({ length: 0 }).map((_, i) => <div key={`e${i}`} />)}
          {calendarDays.map((d) => (
            <div
              key={d}
              className={cn(
                "aspect-square flex items-center justify-center rounded-lg text-xs relative cursor-pointer transition-all",
                d === today ? "bg-primary text-white font-bold" :
                scheduledDays.includes(d) ? "bg-accent/20 text-accent font-medium ring-1 ring-accent/40" :
                "text-text-secondary hover:bg-white/5"
              )}
            >
              {d}
              {scheduledDays.includes(d) && (
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Scheduled Posts */}
      <div className="card space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-text-secondary">📤 排程影片</div>
          <button className="text-xs text-primary-light hover:text-primary transition-colors">+ 新增</button>
        </div>
        <div className="space-y-2">
          {scheduledPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => setActivePost(activePost === post.id ? null : post.id)}
              className={cn(
                "p-3 rounded-xl border cursor-pointer transition-all",
                activePost === post.id ? "border-primary/50 bg-primary/5" : "border-border hover:border-border/80 bg-background"
              )}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-surface rounded-xl flex items-center justify-center text-xl shrink-0">
                  {post.thumbnail}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-text-primary truncate">{post.title}</div>
                  <div className="text-[10px] text-text-muted mt-0.5">{post.platform} · {post.scheduledAt}</div>
                </div>
                <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0", statusColors[post.status as keyof typeof statusColors])}>
                  {statusLabels[post.status as keyof typeof statusLabels]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Meta Editor */}
      <div className="card space-y-3">
        <div className="text-xs font-semibold text-text-secondary flex items-center gap-2">
          ✏️ Metadata 編輯器
          <span className="text-[10px] bg-primary/10 text-primary-light px-1.5 py-0.5 rounded-full">AI 生成</span>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-[10px] text-text-muted mb-1 block">標題</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-base w-full text-sm"
            />
          </div>
          <div>
            <label className="text-[10px] text-text-muted mb-1 block">描述</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              className="input-base w-full text-sm resize-none"
            />
          </div>
          <div>
            <label className="text-[10px] text-text-muted mb-1 block">Hashtags</label>
            <input
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              className="input-base w-full text-sm"
            />
          </div>
        </div>
      </div>

      {/* Platform adaption */}
      <div className="card space-y-3">
        <div className="text-xs font-semibold text-text-secondary">🌐 跨平台適配</div>
        <div className="grid grid-cols-3 gap-2">
          {platforms.slice(0, 3).map((p) => (
            <div key={p.id} className="bg-background rounded-xl border border-border p-3 text-center">
              <div className="text-xl mb-1">{p.icon}</div>
              <div className="text-xs font-medium">{p.name}</div>
              <div className="text-[9px] text-text-muted">{p.ratio}</div>
              <div className="mt-2 text-[9px] text-success">✓ 已最佳化</div>
            </div>
          ))}
        </div>
        <button className="btn-primary w-full text-center py-3 text-sm font-semibold">
          📡 一鍵發布至所有平台
        </button>
      </div>
    </div>
  );
}
