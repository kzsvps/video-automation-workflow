"use client";

import { useState } from "react";
import Link from "next/link";
import { historyVideos } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const statusColors = {
  published: "bg-success/15 text-success border border-success/30",
  scheduled: "bg-primary/15 text-primary-light border border-primary/30",
  draft: "bg-warning/15 text-warning border border-warning/30",
};

const statusLabels = {
  published: "已發布",
  scheduled: "已排程",
  draft: "草稿",
};

export default function HistoryPage() {
  const [filter, setFilter] = useState<"all" | "published" | "scheduled" | "draft">("all");
  const [search, setSearch] = useState("");

  const filteredVideos = historyVideos.filter(v => {
    if (filter !== "all" && v.status !== filter) return false;
    if (search && !v.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen p-8 animate-fade-in custom-scrollbar overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              <span className="text-gradient">影片庫</span>
            </h1>
            <p className="text-text-muted text-sm mt-1">管理與回顧已生成的所有數位資產</p>
          </div>
          <Link href="/studio" className="btn-primary text-sm px-5 py-2.5 whitespace-nowrap">
            ✦ 建立新影片
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="card flex flex-col sm:flex-row items-center justify-between gap-4 p-4 box-border">
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 custom-scrollbar">
            {(["all", "published", "scheduled", "draft"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all",
                  filter === f 
                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                    : "bg-surface border border-border text-text-muted hover:text-text-primary hover:bg-white/5"
                )}
              >
                {f === "all" ? "全部影片" : statusLabels[f]} 
                <span className="ml-1.5 opacity-60 font-normal">
                  ({f === "all" ? historyVideos.length : historyVideos.filter(v => v.status === f).length})
                </span>
              </button>
            ))}
          </div>
          
          <div className="relative w-full sm:w-64 shrink-0">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">🔍</span>
            <input 
              type="text" 
              placeholder="搜尋影片標題..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-base w-full pl-9 text-sm"
            />
          </div>
        </div>

        {/* Video Grid */}
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredVideos.map(video => (
              <div key={video.id} className="card p-0 overflow-hidden group hover:border-primary/40 transition-all cursor-pointer">
                <div className="aspect-video bg-surface-hover relative flex items-center justify-center text-5xl">
                  {video.thumbnail}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                     <button className="w-12 h-12 rounded-full bg-primary/90 text-white flex items-center justify-center text-xl shadow-[0_0_20px_rgba(99,102,241,0.5)] scale-90 group-hover:scale-100 transition-all">
                       ▶
                     </button>
                  </div>
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-medium backdrop-blur-sm">
                    00:{video.duration}
                  </div>
                </div>
                
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-semibold text-sm text-text-primary line-clamp-2 leading-snug group-hover:text-primary-light transition-colors">
                      {video.title}
                    </h3>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", statusColors[video.status as keyof typeof statusColors])}>
                      {statusLabels[video.status as keyof typeof statusLabels]}
                    </span>
                    <span className="text-[10px] text-text-muted bg-surface border border-border px-2 py-0.5 rounded-full">
                      {video.platform}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border mt-3 text-[11px]">
                    <div className="flex gap-3 text-text-muted">
                      <span className="flex items-center gap-1" title="觀看數">👁 {video.views.toLocaleString()}</span>
                      <span className="flex items-center gap-1" title="完播率">▶ {video.completionRate}%</span>
                    </div>
                    <div className="text-text-muted font-mono">{video.createdAt}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card py-20 text-center flex flex-col items-center justify-center space-y-3">
            <div className="text-4xl">📭</div>
            <div className="text-text-primary font-bold">找不到相符的影片</div>
            <div className="text-text-muted text-sm">試著清除搜尋條件或篩選器</div>
            <button onClick={() => { setFilter("all"); setSearch(""); }} className="text-primary hover:underline text-sm font-medium mt-2">
              清除所有條件
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
