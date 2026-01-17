import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/providers/ToastProvider";
import Link from "next/link";
import { LayoutDashboard, FileText, Settings, Sparkles } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BizAssist - Strategic Portfolio",
  description: "Executive AI-powered strategy builder.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-slate-50 text-slate-900 antialiased overflow-hidden`}>
        <ToastProvider>
          <div className="flex h-screen w-screen bg-slate-50">
            {/* Sidebar Navigation */}
            <aside className="w-20 md:w-64 flex-shrink-0 border-r border-slate-200 bg-white flex flex-col justify-between z-30 shadow-sm">
              <div>
                <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-indigo-700 font-bold text-xl">
                    <Sparkles size={24} className="text-indigo-600" />
                    <span className="hidden md:block">BizAssist</span>
                  </div>
                </div>

                <nav className="p-4 space-y-1">
                  <Link href="/" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors group font-medium">
                    <LayoutDashboard size={20} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    <span className="hidden md:block">Dashboard</span>
                  </Link>
                  <Link href="/portfolio" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors group font-medium">
                    <FileText size={20} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    <span className="hidden md:block">Portfolio</span>
                  </Link>
                  <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors group font-medium">
                    <Settings size={20} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    <span className="hidden md:block">Settings</span>
                  </Link>
                </nav>
              </div>

              <div className="p-4 border-t border-slate-100">
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">
                    NM
                  </div>
                  <div className="hidden md:block overflow-hidden">
                    <div className="text-sm font-semibold text-slate-700 truncate">Naresh M.</div>
                    <div className="text-xs text-slate-500 truncate">Chief Officer</div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-50">
              {children}
            </main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
