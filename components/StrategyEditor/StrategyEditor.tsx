"use client";

import { useState, useEffect } from "react";
import { Stage, UseCase, Currency, DEFAULT_DOMAINS, ValueType, Duration } from "@/app/lib/types";
import { updateUseCaseAction, deleteUseCaseAction } from "@/app/actions";
import { ArrowLeft, Send, Sparkles, Wand2, Plus, X, Trash2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/providers/ToastProvider";

interface StrategyEditorProps {
    initialData: UseCase;
}

export default function StrategyEditor({ initialData }: StrategyEditorProps) {
    const [data, setData] = useState<UseCase>(initialData);
    const [saving, setSaving] = useState(false);
    const { showToast } = useToast();
    const router = useRouter();
    const [chatInput, setChatInput] = useState("");
    const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai', text: string }[]>([
        { role: 'ai', text: `I've loaded the context for "${initialData.title}". How can I help refine this strategy today?` }
    ]);
    
    // Auto-save logic (debounce)
    useEffect(() => {
        const handleAutoSave = async () => {
            if (JSON.stringify(data) !== JSON.stringify(initialData)) {
                setSaving(true);
                try {
                    await updateUseCaseAction(data.id, data);
                } catch (e) {
                    showToast("Failed to save changes", "error");
                } finally {
                    setSaving(false);
                }
            }
        };

        const timer = setTimeout(handleAutoSave, 3000);
        return () => clearTimeout(timer);
    }, [data, initialData, showToast]);

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this strategy? This action cannot be undone.")) {
            try {
                await deleteUseCaseAction(data.id);
                showToast("Strategy deleted", "success");
                router.push("/");
            } catch (e) {
                showToast("Failed to delete", "error");
            }
        }
    };

    const handleChatSubmit = async () => {
        if (!chatInput.trim()) return;
        
        const newMsg = { role: 'user' as const, text: chatInput };
        setChatHistory(prev => [...prev, newMsg]);
        setChatInput("");
        
        // Simulate AI response (Mock for now, can hook up to real Gemini later)
        setTimeout(() => {
            setChatHistory(prev => [...prev, { 
                role: 'ai', 
                text: "That's a good point. I suggest we expand the 'Risks' section to include data privacy concerns. Would you like me to draft that for you?" 
            }]);
        }, 1000);
    };

    return (
        <div className="flex flex-1 min-h-0 bg-slate-50 overflow-hidden h-full">
            {/* Left Panel: The Document */}
            <div className="flex-1 flex flex-col min-w-0 bg-white border-r border-slate-200 h-full relative shadow-sm z-10">
                {/* Toolbar */}
                <div className="h-14 flex-none border-b border-slate-100 flex items-center justify-between px-6 bg-white z-20 sticky top-0">
                    <Link href="/" className="text-slate-500 hover:text-indigo-600 flex items-center gap-2 text-sm font-medium transition-colors">
                        <ArrowLeft size={16} /> Back to Dashboard
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className={`text-xs uppercase tracking-wider font-medium transition-colors ${saving ? "text-indigo-500" : "text-slate-400"}`}>
                            {saving ? "Saving..." : "Saved"}
                        </span>
                        <div className="h-4 w-px bg-slate-200"></div>
                        <button 
                            onClick={handleDelete}
                            className="text-slate-400 hover:text-red-600 transition-colors"
                            title="Delete Strategy"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>

                {/* Document Canvas */}
                <div className="flex-1 overflow-y-auto p-8 md:p-12 scroll-smooth">
                    <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
                        {/* Title Section */}
                        <div className="group relative">
                            <input
                                value={data.title}
                                onChange={e => setData({ ...data, title: e.target.value })}
                                className="text-4xl font-bold bg-transparent border-none text-slate-900 w-full focus:ring-0 p-0 placeholder-slate-300 tracking-tight"
                                placeholder="Untitled Strategy"
                            />
                            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 hover:border-indigo-300 transition-colors">
                                    <span className="text-slate-400 font-medium">Domain:</span>
                                    <select
                                        value={data.domain}
                                        onChange={e => setData({ ...data, domain: e.target.value })}
                                        className="bg-transparent border-none text-slate-700 focus:ring-0 p-0 text-sm font-medium cursor-pointer min-w-[120px]"
                                    >
                                        <option value="" disabled>Select Domain</option>
                                        {/* Add current domain if not in defaults to avoid it disappearing */}
                                        {!DEFAULT_DOMAINS.includes(data.domain) && data.domain && (
                                            <option value={data.domain}>{data.domain}</option>
                                        )}
                                        {DEFAULT_DOMAINS.map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 hover:border-indigo-300 transition-colors">
                                    <span className="text-slate-400 font-medium">Stage:</span>
                                    <select 
                                        value={data.stage}
                                        onChange={e => setData({ ...data, stage: e.target.value as Stage })}
                                        className="bg-transparent border-none text-slate-700 focus:ring-0 p-0 text-sm font-medium cursor-pointer"
                                    >
                                        <option value="Idea">Idea</option>
                                        <option value="PoC">PoC</option>
                                        <option value="Pilot">Pilot</option>
                                        <option value="Production">Production</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Executive Summary */}
                        <section className="group relative">
                            <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2 border-l-4 border-indigo-500 pl-3">
                                Executive Summary
                            </h3>
                            <textarea
                                value={data.description}
                                onChange={e => setData({ ...data, description: e.target.value })}
                                className="w-full bg-slate-50 hover:bg-white focus:bg-white border-none focus:ring-0 rounded-lg p-4 text-slate-700 leading-relaxed resize-none transition-all shadow-sm min-h-[160px] text-lg"
                            />
                        </section>

                        {/* Value Analysis */}
                        <section className="group">
                            <div className="flex items-center justify-between mb-4 border-l-4 border-emerald-500 pl-3">
                                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                    Commercial Value
                                </h3>
                                <button className="text-xs text-slate-400 hover:text-emerald-600 flex items-center gap-1 transition-colors px-2 py-1 hover:bg-emerald-50 rounded">
                                    <Wand2 size={12} /> Auto-Calculate
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {data.commercialValue.map((cv, i) => (
                                    <div key={i} className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col relative group/card">
                                        <button 
                                            onClick={() => {
                                                const newVal = [...data.commercialValue];
                                                newVal.splice(i, 1);
                                                setData({...data, commercialValue: newVal});
                                            }}
                                            className="absolute top-2 right-2 text-slate-300 hover:text-red-400 opacity-0 group-hover/card:opacity-100 transition-opacity"
                                        >
                                            <X size={16} />
                                        </button>
                                        <div className="flex items-baseline gap-1 mb-2">
                                            <select
                                                value={cv.currency}
                                                onChange={e => {
                                                    const newVal = [...data.commercialValue];
                                                    newVal[i].currency = e.target.value as Currency;
                                                    setData({...data, commercialValue: newVal});
                                                }}
                                                className="bg-transparent border-none text-slate-400 text-sm font-medium focus:ring-0 p-0 w-auto cursor-pointer"
                                            >
                                                {["USD", "EUR", "GBP", "Other"].map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                            <input 
                                                type="number"
                                                value={cv.amount}
                                                onChange={e => {
                                                    const newVal = [...data.commercialValue];
                                                    newVal[i].amount = Number(e.target.value);
                                                    setData({...data, commercialValue: newVal});
                                                }}
                                                className="bg-transparent border-none text-3xl font-bold text-slate-900 w-full focus:ring-0 p-0"
                                            />
                                        </div>
                                        <div className="flex justify-between items-center text-sm gap-2">
                                            <select
                                                value={cv.type}
                                                onChange={e => {
                                                    const newVal = [...data.commercialValue];
                                                    newVal[i].type = e.target.value as ValueType;
                                                    setData({...data, commercialValue: newVal});
                                                }}
                                                className="bg-slate-100 border-none text-slate-600 font-medium px-2 py-0.5 rounded text-xs cursor-pointer focus:ring-0 w-auto"
                                            >
                                                {["Cost Savings", "Revenue Growth", "Productivity Gains", "Risk Reduction"].map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                            
                                            <select
                                                value={cv.duration}
                                                onChange={e => {
                                                    const newVal = [...data.commercialValue];
                                                    newVal[i].duration = e.target.value as Duration;
                                                    setData({...data, commercialValue: newVal});
                                                }}
                                                className="bg-transparent border-none uppercase text-[10px] tracking-wider text-slate-400 font-bold cursor-pointer focus:ring-0 w-auto text-right"
                                            >
                                                {["Annual", "One-time"].map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                ))}
                                <button 
                                    onClick={() => setData({
                                        ...data, 
                                        commercialValue: [...data.commercialValue, { amount: 0, currency: "USD", type: "Cost Savings", duration: "Annual" }]
                                    })}
                                    className="border-2 border-dashed border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:text-emerald-600 transition-all h-full min-h-[120px] gap-2"
                                >
                                    <div className="p-2 bg-slate-100 rounded-full group-hover:bg-white"><Plus size={20} /></div>
                                    <span className="font-medium text-sm">Add Value Driver</span>
                                </button>
                            </div>
                        </section>

                        {/* Soft Benefits */}
                        <section className="group">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4 border-l-4 border-blue-500 pl-3">Qualitative Benefits</h3>
                            <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-sm">
                                <div className="space-y-1">
                                    {data.softBenefits.map((sb, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-lg group/item transition-colors">
                                            <div className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></div>
                                            <input
                                                value={sb}
                                                onChange={e => {
                                                    const newBenefits = [...data.softBenefits];
                                                    newBenefits[i] = e.target.value;
                                                    setData({ ...data, softBenefits: newBenefits });
                                                }}
                                                className="w-full bg-transparent border-none text-slate-700 focus:ring-0 p-0 leading-relaxed text-sm font-medium"
                                            />
                                            <button 
                                                onClick={() => {
                                                    const newBenefits = [...data.softBenefits];
                                                    newBenefits.splice(i, 1);
                                                    setData({ ...data, softBenefits: newBenefits });
                                                }}
                                                className="text-slate-300 hover:text-red-400 opacity-0 group-hover/item:opacity-100 transition-opacity"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button 
                                    onClick={() => setData({ ...data, softBenefits: [...data.softBenefits, "New strategic benefit..."] })}
                                    className="w-full py-3 text-sm text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-b-lg border-t border-dashed border-slate-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Plus size={14} /> Add Benefit
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {/* Right Panel: The AI Consultant */}
            <div className="w-[380px] flex-none bg-slate-50 border-l border-slate-200 flex flex-col h-full z-20 shadow-xl">
                <div className="h-14 flex-none border-b border-slate-200 flex items-center px-5 bg-white shadow-sm z-10">
                    <Sparkles size={18} className="text-indigo-600 mr-2" />
                    <span className="font-semibold text-slate-800">Strategy Copilot</span>
                </div>

                {/* Chat History */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50">
                    {chatHistory.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[90%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                msg.role === 'user' 
                                ? 'bg-indigo-600 text-white rounded-br-none' 
                                : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {/* Spacer for bottom input */}
                    <div className="h-2"></div>
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-slate-200 bg-white">
                    <div className="relative">
                        <input
                            value={chatInput}
                            onChange={e => setChatInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleChatSubmit()}
                            placeholder="Ask me to refine a section..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-4 pr-12 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all text-sm shadow-inner"
                        />
                        <button 
                            onClick={handleChatSubmit}
                            className="absolute right-2 top-2 p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 mt-3 text-[10px] text-slate-400">
                         <AlertCircle size={10} />
                         <span>AI insights are generated for guidance. Verify all data.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}