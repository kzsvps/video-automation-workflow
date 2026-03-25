"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, RadialBarChart, RadialBar, Legend
} from "recharts";
import { analyticsData } from "@/lib/mockData";

export default function StatsChart() {
  const viewData = analyticsData.days.map((d, i) => ({
    day: d,
    觀看數: analyticsData.views[i],
    完播率: analyticsData.completionRate[i],
    互動率: analyticsData.engagement[i],
  }));

  const radialData = [
    { name: "完播率", value: 82, fill: "#6366f1" },
    { name: "互動率", value: 81, fill: "#06b6d4" },
  ];

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "本週觀看", value: "58,900", change: "+40%", icon: "👁", color: "text-primary-light" },
          { label: "平均完播率", value: "82%", change: "+14%", icon: "▶", color: "text-success" },
          { label: "平均互動率", value: "8.1%", change: "+12%", icon: "💬", color: "text-accent" },
        ].map((kpi) => (
          <div key={kpi.label} className="card text-center">
            <div className="text-xl mb-1">{kpi.icon}</div>
            <div className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</div>
            <div className="text-[10px] text-text-muted">{kpi.label}</div>
            <div className="text-[10px] text-success mt-1">{kpi.change} ↑</div>
          </div>
        ))}
      </div>

      {/* Views Chart */}
      <div className="card space-y-3">
        <div className="text-xs font-semibold text-text-secondary">📈 7 天觀看趨勢</div>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={viewData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A38" />
              <XAxis dataKey="day" tick={{ fill: "#555570", fontSize: 10 }} />
              <YAxis tick={{ fill: "#555570", fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: "#1A1A24", border: "1px solid #2A2A38", borderRadius: 12, fontSize: 11 }}
                labelStyle={{ color: "#F0F0F8" }}
              />
              <Area type="monotone" dataKey="觀看數" stroke="#6366f1" strokeWidth={2} fill="url(#colorViews)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Completion + Engagement */}
      <div className="card space-y-3">
        <div className="text-xs font-semibold text-text-secondary">🎯 完播率 & 互動率</div>
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={viewData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A38" />
              <XAxis dataKey="day" tick={{ fill: "#555570", fontSize: 10 }} />
              <YAxis tick={{ fill: "#555570", fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: "#1A1A24", border: "1px solid #2A2A38", borderRadius: 12, fontSize: 11 }}
              />
              <Line type="monotone" dataKey="完播率" stroke="#22c55e" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="互動率" stroke="#06b6d4" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AB Test */}
      <div className="card space-y-3">
        <div className="text-xs font-semibold text-text-secondary">🧪 A/B 測試對比</div>
        <div className="space-y-2">
          {[
            { label: "版本 A", title: analyticsData.abTest.a.title, views: analyticsData.abTest.a.views, ctr: analyticsData.abTest.a.ctr, winner: false },
            { label: "版本 B", title: analyticsData.abTest.b.title, views: analyticsData.abTest.b.views, ctr: analyticsData.abTest.b.ctr, winner: true },
          ].map((ab) => (
            <div key={ab.label} className={`p-3 rounded-xl border ${ab.winner ? "border-success/40 bg-success/5" : "border-border bg-background"}`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ab.winner ? "bg-success/20 text-success" : "bg-border text-text-muted"}`}>
                    {ab.label} {ab.winner ? "🏆 勝出" : ""}
                  </span>
                </div>
                <span className="text-xs text-text-muted">{ab.views.toLocaleString()} 觀看</span>
              </div>
              <p className="text-xs text-text-primary mb-2">{ab.title}</p>
              <div className="flex gap-4 text-[10px] text-text-muted">
                <span>點擊率 <span className={ab.winner ? "text-success font-bold" : "text-text-primary"}>{ab.ctr}%</span></span>
              </div>
              <div className="mt-1.5 h-1 bg-border rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${ab.winner ? "bg-success" : "bg-primary"}`}
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
