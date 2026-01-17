import { getUseCases } from "@/app/lib/storage";
import Link from "next/link";
import { Search, Filter, ArrowUpDown, ChevronRight } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function PortfolioPage() {
    const useCases = await getUseCases();

    return (
        <div className="h-full overflow-y-auto p-8 bg-slate-50">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Strategic Portfolio</h1>
                <p className="text-slate-500">Inventory of all AI initiatives and their current trajectory.</p>
            </header>

            {/* Filters / Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        placeholder="Search initiatives, domains, or keywords..." 
                        className="w-full bg-white border-slate-200 pl-10 pr-4 py-2.5 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 text-slate-900 placeholder-slate-400 shadow-sm"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="btn-secondary px-4 py-2.5 bg-white border-slate-200 text-slate-600 hover:text-indigo-700 hover:bg-slate-50 flex items-center gap-2 shadow-sm">
                        <Filter size={16} /> Domain
                    </button>
                    <button className="btn-secondary px-4 py-2.5 bg-white border-slate-200 text-slate-600 hover:text-indigo-700 hover:bg-slate-50 flex items-center gap-2 shadow-sm">
                        <ArrowUpDown size={16} /> Stage
                    </button>
                </div>
            </div>

            {/* Portfolio Grid/Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4">Title & Context</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Potential Value</th>
                            <th className="px-6 py-4">Created</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {useCases.map(uc => (
                            <tr key={uc.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4 max-w-md">
                                    <div className="font-semibold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{uc.title}</div>
                                    <div className="text-xs text-slate-500 line-clamp-1">{uc.domain} • {uc.description}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                        uc.stage === 'Production' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                                        uc.stage === 'Pilot' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                        uc.stage === 'Idea' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                        'bg-slate-100 text-slate-600 border border-slate-200'
                                    }`}>
                                        {uc.stage}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="font-mono text-slate-900 font-medium">
                                        {uc.commercialValue[0] ? `${uc.commercialValue[0].currency} ${uc.commercialValue[0].amount.toLocaleString()}` : "-"}
                                    </div>
                                    <div className="text-[10px] text-slate-400 uppercase">Annualized</div>
                                </td>
                                <td className="px-6 py-4 text-slate-400 text-xs">
                                    {new Date(uc.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link href={`/strategy/${uc.id}`} className="p-2 hover:bg-slate-100 rounded-lg inline-block text-slate-400 hover:text-indigo-600 transition-all">
                                        <ChevronRight size={18} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
