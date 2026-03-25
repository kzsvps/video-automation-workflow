"use client";

import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, RadialBarChart, RadialBar, Legend
} from "recharts";
import { analyticsData } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function StatsChart() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("7d");

  // Generate view data based on timeRange
  const viewData = (() => {
    if (timeRange === "7d") {
      return analyticsData.days7.map((d, i) => ({
        day: d,
        觀看數: analyticsData.views7[i],
        完播率: analyticsData.completionRate[i],
        互動率: analyticsData.engagement[i],
      }));
    } else if (timeRange === "30d") {
      return analyticsData.days30.map((d, i) => ({
        day: d,
        觀看數: analyticsData.views30[i],
        完播率: 70 + Math.random() * 15,
        互動率: 4 + Math.random() * 5,
      }));
    } else {
      // 90d mock
      return Array.from({ length: 90 }, (_, i) => ({
        day: `${Math.floor(i / 30) + 1}月${(i % 30) + 1}日`,
        觀看數: 10000 + Math.random() * 60000,
        完播率: 60 + Math.random() * 25,
        互動率: 3 + Math.random() * 6,
      }));
    }
  })();

  const avgCompletion = Math.round(viewData.reduce((acc, curr) => acc + curr.完播率, 0) / viewData.length);
  const avgEngagement = +(viewData.reduce((acc, curr) => acc + curr.互動率, 0) / viewData.length).toFixed(1);
  const totalViews = viewData.reduce((acc, curr) => acc + curr.觀看數, 0).toLocaleString();

  const radialData = [
    { name: "互動率", value: avgEngagement * 10, fill: "#06b6d4" }, // scale up to be visible next to 100%
    { name: "完播率", value: avgCompletion, fill: "#6366f1" },
  ];

  return (
    <div className="space-y-4">
      {/* Target Audience / Time Range Filter */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-text-primary">數據成效概覽</h2>
        <div className="flex bg-surface border border-border rounded-lg p-1">
          {(["7d", "30d", "90d"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition-all",
                timeRange === range
                  ? "bg-primary text-white shadow-sm"
                  : "text-text-muted hover:text-text-primary"
              )}
            >
              {range === "7d" ? "7天" : range === "30d" ? "30天" : "90天"}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { label: "總觀看數", value: totalViews, change: timeRange === "7d" ? "+40%" : "+12%", icon: "👁", color: "text-primary-light" },
          { label: "平均完播率", value: `${avgCompletion}%`, change: timeRange === "7d" ? "+14%" : "+3%", icon: "▶", color: "text-success" },
          { label: "平均互動率", value: `${avgEngagement}%`, change: timeRange === "7d" ? "+12%" : "+1%", icon: "💬", color: "text-accent" },
        ].map((kpi) => (
          <div key={kpi.label} className="card text-center">
            <div className="text-xl mb-1">{kpi.icon}</div>
            <div className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</div>
            <div className="text-[10px] text-text-muted">{kpi.label}</div>
            <div className="text-[10px] text-success mt-1">{kpi.change} ↑</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Views Chart */}
        <div className="card space-y-3 lg:col-span-2">
          <div className="text-xs font-semibold text-text-secondary">📈 觀看趨勢</div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={viewData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A38" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  tick={{ fill: "#8f8fa3", fontSize: 10 }} 
                  axisLine={false} 
                  tickLine={false} 
                  minTickGap={20}
                />
                <YAxis 
                  tick={{ fill: "#8f8fa3", fontSize: 10 }} 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(val) => `${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{ background: "#1A1A24", border: "1px solid #2A2A38", borderRadius: 12, fontSize: 11 }}
                  labelStyle={{ color: "#F0F0F8", marginBottom: 4 }}
                  itemStyle={{ padding: 0 }}
                  formatter={(value: number) => [value.toLocaleString(), "觀看數"]}
                />
                <Area type="monotone" dataKey="觀看數" stroke="#6366f1" strokeWidth={3} fill="url(#colorViews)" animationDuration={1000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Completion Radial Chart - F10 */}
        <div className="card space-y-3 flex flex-col">
          <div className="text-xs font-semibold text-text-secondary">🎯 核心轉換率</div>
          <div className="flex-1 flex items-center justify-center relative min-h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                cx="50%" cy="50%" innerRadius="40%" outerRadius="90%" barSize={12} data={radialData} 
                startAngle={90} endAngle={-270}
              >
                <RadialBar
                  background={{ fill: '#2A2A38' }}
                  dataKey="value"
                  cornerRadius={10}
                  animationDuration={1500}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ background: "#1A1A24", border: "1px solid #2A2A38", borderRadius: 8, fontSize: 11 }}
                  formatter={(value: number, name: string) => [name === "互動率" ? `${(value/10).toFixed(1)}%` : `${value}%`, name]}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold tracking-tighter text-text-primary">{avgCompletion}%</span>
              <span className="text-[9px] text-text-muted">完播</span>
            </div>
          </div>
          <div className="flex justify-center gap-4 text-[10px] pb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span className="text-text-secondary">完播率</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-accent" />
              <span className="text-text-secondary">互動率</span>
            </div>
          </div>
        </div>
      </div>

      {/* AB Test */}
      <div className="card space-y-3">
        <div className="flex justify-between items-center">
          <div className="text-xs font-semibold text-text-secondary">🧪 A/B 測試對比 (近7日)</div>
          <button className="text-[10px] text-primary hover:text-primary-light transition-colors">查看全部</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: "版本 A 原始對照組", title: analyticsData.abTest.a.title, views: analyticsData.abTest.a.views, ctr: analyticsData.abTest.a.ctr, winner: false },
            { label: "版本 B 實驗測試組", title: analyticsData.abTest.b.title, views: analyticsData.abTest.b.views, ctr: analyticsData.abTest.b.ctr, winner: true },
          ].map((ab) => (
            <div key={ab.label} className={cn("p-4 rounded-xl border relative overflow-hidden transition-all", ab.winner ? "border-success/40 bg-success/5 shadow-sm" : "border-border bg-background")}>
              {ab.winner && <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-success/20 to-transparent -z-10" />}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md", ab.winner ? "bg-success/20 text-success" : "bg-surface text-text-muted")}>
                    {ab.label} {ab.winner ? "🏆 勝出" : ""}
                  </span>
                </div>
              </div>
              <p className="text-xs text-text-primary mb-3 font-medium line-clamp-2 h-8">{ab.title}</p>
              
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-[10px] text-text-muted mb-0.5">點擊率 CTR</div>
                  <div className={cn("text-lg font-bold", ab.winner ? "text-success" : "text-text-primary")}>{ab.ctr}%</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-text-muted mb-0.5">觸及觀看</div>
                  <div className="text-sm font-semibold text-text-secondary">{ab.views.toLocaleString()}</div>
                </div>
              </div>
              <div className="mt-2.5 h-1.5 bg-border rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-1000", ab.winner ? "bg-success" : "bg-primary")}
                  style={{ width: `${(ab.ctr / 15) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
