"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { defaultScript } from "./mockData";

export interface ToastItem {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

export interface ScheduledEvent {
  id: string;
  title: string;
  platform: string;
  scheduledAt: string; // ISO string
  status: "scheduled" | "draft" | "published";
  thumbnail: string;
}

export function getInitialScriptText() {
  return {
    opening: defaultScript.opening.text,
    "body.0": defaultScript.body[0].text,
    "body.1": defaultScript.body[1].text,
    closing: defaultScript.closing.text,
  };
}

interface AppState {
  selectedPersonaId: string;
  setSelectedPersonaId: (id: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  aiInsightApplied: boolean;
  setAiInsightApplied: (v: boolean) => void;
  toasts: ToastItem[];
  addToast: (message: string, type?: ToastItem["type"]) => void;
  removeToast: (id: string) => void;
  scriptText: Record<string, string>;
  setScriptText: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  uploadedFiles: string[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<string[]>>;
  activeFrame: number;
  setActiveFrame: React.Dispatch<React.SetStateAction<number>>;
  scheduledEvents: ScheduledEvent[];
  addScheduledEvent: (e: ScheduledEvent) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [selectedPersonaId, setSelectedPersonaId] = useState("1");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [aiInsightApplied, setAiInsightApplied] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [scriptText, setScriptText] = useState<Record<string, string>>(getInitialScriptText());
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [activeFrame, setActiveFrame] = useState(0);
  const [scheduledEvents, setScheduledEvents] = useState<ScheduledEvent[]>([]);

  const addScheduledEvent = useCallback((e: ScheduledEvent) => {
    setScheduledEvents(prev => [...prev, e]);
  }, []);

  const addToast = useCallback((message: string, type: ToastItem["type"] = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <AppContext.Provider value={{
      selectedPersonaId, setSelectedPersonaId,
      sidebarCollapsed, setSidebarCollapsed,
      aiInsightApplied, setAiInsightApplied,
      toasts, addToast, removeToast,
      scriptText, setScriptText,
      uploadedFiles, setUploadedFiles,
      activeFrame, setActiveFrame,
      scheduledEvents, addScheduledEvent,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
