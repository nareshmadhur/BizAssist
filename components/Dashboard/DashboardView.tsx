"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, TrendingUp, DollarSign, Activity, ArrowRight, Briefcase, Zap, Loader2 } from "lucide-react";
import { UseCase } from "@/app/lib/types";
import { getClientUseCases, saveClientUseCase } from "@/app/lib/client-storage";

interface DashboardViewProps {
    serverData: UseCase[];
}

export default function DashboardView({ serverData }: DashboardViewProps) {
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load local data
    const local = getClientUseCases();
    
    // If local is empty, use server data and save it to local for consistency
    // This effectively "seeds" the local storage on first load
    if (local.length === 0 && serverData.length > 0) {
        setUseCases(serverData);
        // Persist seed data to local storage so edits are saved
        // We only do this if we are sure local is truly empty (not just unread)
        // But getClientUseCases returns [] if empty.
        // Let's seed it one by one to avoid overwriting if there's a race?
        // No, just set it.
        // Wait, saving all at once requires a bulk save function or loop.
        // Let's just set state to serverData, and rely on edits to save specific ones?
        // No, if I click a seed strategy and edit it, it needs to be in LS.
        // So let's loop and save.
        serverData.forEach(saveClientUseCase);
    } else {
        // If we have local data, use it.
        // We might want to merge server seed data if it's missing?
        // For now, assume local supersedes server once established.
        setUseCases(local);
    }
    setLoading(false);
  }, [serverData]);

  // Recalculate metrics on client
  const totalValue = useCases.reduce((total, c) => {
    return total + c.commercialValue.reduce((sum, v) => sum + v.amount, 0);
  }, 0);

  const byStage = {
    Idea: useCases.filter(c => c.stage === 'Idea').length,
    PoC: useCases.filter(c => c.stage === 'PoC').length,
    Pilot: useCases.filter(c => c.stage === 'Pilot').length,
    Production: useCases.filter(c => c.stage === 'Production').length,
  };

  const byDomain: Record<string, number> = {};
  useCases.forEach(c => {
    byDomain[c.domain] = (byDomain[c.domain] || 0) + 1;
  });

  if (loading) {
      return (
          <div className="h-full flex items-center justify-center">
              <Loader2 className="animate-spin text-indigo-600" size={32} />
          </div>
      );
  }

  return (
    <div className="h-full flex flex-col p-6 overflow-hidden">
      {/* Header - Compact */}
      <header className="flex-none flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Executive Overview</h1>
          <p className="text-sm text-slate-500">Portfolio performance and strategic value analysis.</p>
        </div>
        <Link
          href="/create"
          className="btn-primary shadow-lg shadow-indigo-500/20"
        >
          <Plus className="mr-2" size={18} />
          New Initiative
        </Link>
      </header>

      {/* Main Grid - Bento Layout */}
      <div className="flex-1 min-h-0 grid grid-cols-12 gap-4">
        
        {/* KPI Column (Left) */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-3">
            <div className="flex-1 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><DollarSign size={16} /></div>
                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Value Pipeline</span>
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-0.5">${(totalValue / 1000000).toFixed(1)}M</div>
                <div className="text-[10px] text-emerald-600 flex items-center gap-1 font-medium bg-emerald-50 w-fit px-1.5 py-0.5 rounded-full">
                    <TrendingUp size={10} /> +12% YoY
                </div>
            </div>

            <div className="flex-1 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Briefcase size={16} /></div>
                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Active</span>
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-0.5">{useCases.length}</div>
                <div className="text-[10px] text-slate-500">Across {Object.keys(byDomain).length} domains</div>
            </div>

            <div className="flex-1 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg"><Zap size={16} /></div>
                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Velocity</span>
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-0.5">MVP</div>
                <div className="text-[10px] text-slate-500">Avg. maturity stage</div>
            </div>
        </div>

        {/* Center Stage: Funnel & Visuals */}
        <div className="col-span-12 md:col-span-5 flex flex-col gap-3 min-w-0">
            <div className="flex-1 bg-white border border-slate-200 rounded-xl p-4 shadow-sm overflow-hidden flex flex-col min-w-0">
                <h3 className="text-xs font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <Activity size={14} className="text-slate-400" /> Innovation Funnel
                </h3>
                <div className="flex-1 flex flex-col justify-center space-y-3 min-w-0">
                    {Object.entries(byStage).map(([stage, count]) => (
                        <div key={stage} className="relative group cursor-default">
                            <div className="flex justify-between text-[10px] font-medium mb-1 z-10 relative">
                                <span className="text-slate-700">{stage}</span>
                                <span className="text-slate-500">{count} projects</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full transition-all duration-500 ${
                                        stage === 'Production' ? 'bg-emerald-500' :
                                        stage === 'Pilot' ? 'bg-indigo-500' :
                                        stage === 'PoC' ? 'bg-blue-400' : 'bg-slate-300'
                                    }`}
                                    style={{ width: `${Math.max(5, (count / (useCases.length || 1)) * 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="h-[35%] bg-white border border-slate-200 rounded-xl p-4 shadow-sm overflow-hidden">
                <h3 className="text-xs font-semibold text-slate-800 mb-2">Top Domains</h3>
                <div className="flex flex-wrap gap-1.5">
                    {Object.entries(byDomain).sort((a,b) => b[1] - a[1]).slice(0, 5).map(([domain, count]) => (
                        <div key={domain} className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded border border-slate-100">
                            <span className="text-[10px] font-medium text-slate-700">{domain}</span>
                            <span className="text-[9px] font-bold text-slate-500 bg-white px-1 rounded shadow-sm border border-slate-100">{count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Right Column: Briefing List */}
        <div className="col-span-12 md:col-span-4 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-sm font-semibold text-slate-800">Strategy Briefing</h3>
                <Link href="/portfolio" className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">View All <ArrowRight size={12}/></Link>
            </div>
            <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left">
                    <tbody className="divide-y divide-slate-50">
                        {useCases.slice(0, 6).map(uc => (
                            <tr key={uc.id} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                                <td className="px-4 py-3">
                                    <Link href={`/strategy/${uc.id}`} className="block">
                                        <div className="text-sm font-semibold text-slate-900 truncate max-w-[180px] mb-0.5">{uc.title}</div>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className={`px-1.5 py-0.5 rounded-full font-medium ${
                                                uc.stage === 'Production' ? 'bg-emerald-100 text-emerald-700' :
                                                uc.stage === 'Pilot' ? 'bg-indigo-100 text-indigo-700' :
                                                'bg-slate-100 text-slate-600'
                                            }`}>
                                                {uc.stage}
                                            </span>
                                            <span className="text-slate-400">•</span>
                                            <span className="text-slate-500 font-medium font-mono">
                                                {uc.commercialValue[0] ? `${(uc.commercialValue[0].amount / 1000).toFixed(0)}k` : "-"}
                                            </span>
                                        </div>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center">
                <Link href="/create" className="text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors flex items-center justify-center gap-1">
                    <Plus size={12} /> Add Quick Entry
                </Link>
            </div>
        </div>

      </div>
    </div>
  );
}
