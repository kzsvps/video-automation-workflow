"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/lib/AppContext";

const icons = { success: "✓", error: "✕", info: "ℹ", warning: "⚠" };
const styles = {
  success: "bg-[#1a3a2a] border border-success/40 text-success",
  error:   "bg-[#3a1a1a] border border-danger/40 text-danger",
  info:    "bg-[#1a1a3a] border border-primary/40 text-primary-light",
  warning: "bg-[#3a2a1a] border border-warning/40 text-warning",
};

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.92 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={() => removeToast(t.id)}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium pointer-events-auto cursor-pointer backdrop-blur-sm min-w-[220px] max-w-[320px] ${styles[t.type]}`}
          >
            <span className="shrink-0 font-bold">{icons[t.type]}</span>
            <span>{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
