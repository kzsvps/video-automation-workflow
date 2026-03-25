import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import { AppProvider } from "@/lib/AppContext";
import ToastContainer from "@/components/ui/Toast";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <head>
        <title>VideoFlow AI · 自動化短影音工作流</title>
        <meta name="description" content="全自動化短影音生成工作流" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+TC:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-background text-text-primary flex h-screen overflow-hidden">
        <AppProvider>
          <Sidebar />
          <main className="flex-1 overflow-y-auto min-w-0">
            {children}
          </main>
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  );
}
