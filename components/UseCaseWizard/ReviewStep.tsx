"use client";

import { useState } from "react";
import { UseCase, DEFAULT_DOMAINS, STAGE_DEFINITIONS, Stage, ValueType, Currency, Duration } from "@/app/lib/types";
import { Save, AlertCircle, Info, Plus, X, Edit2 } from "lucide-react";
import { useToast } from "@/components/providers/ToastProvider";

interface ReviewStepProps {
    initialData: Partial<UseCase>;
    onSave: (data: UseCase) => void;
}

export default function ReviewStep({ initialData, onSave }: ReviewStepProps) {
    const { showToast } = useToast();
    const [formData, setFormData] = useState<Partial<UseCase>>({
        ...initialData,
        commercialValue: initialData.commercialValue || [],
        softBenefits: initialData.softBenefits || [],
    });

    const [newValue, setNewValue] = useState({
        amount: 0,
        currency: "USD" as Currency,
        type: "Cost Savings" as ValueType,
        duration: "Annual" as Duration
    });

    const [softBenefitInput, setSoftBenefitInput] = useState("");
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const addCommercialValue = () => {
        if (newValue.amount <= 0) return;

        if (editingIndex !== null) {
            // Update existing
            setFormData(prev => {
                const updatedList = [...(prev.commercialValue || [])];
                updatedList[editingIndex] = { ...newValue };
                return { ...prev, commercialValue: updatedList };
            });
            setEditingIndex(null);
        } else {
            // Add new
            setFormData(prev => ({
                ...prev,
                commercialValue: [...(prev.commercialValue || []), { ...newValue }]
            }));
        }
        setNewValue({ ...newValue, amount: 0 }); // Reset amount but keep currency/type/duration
    };

    const removeCommercialValue = (index: number) => {
        if (editingIndex === index) {
            cancelEditing();
        }
        setFormData(prev => ({
            ...prev,
            commercialValue: prev.commercialValue?.filter((_, i) => i !== index)
        }));
    };

    const startEditing = (index: number) => {
        const item = formData.commercialValue?.[index];
        if (item) {
            setNewValue(item);
            setEditingIndex(index);
        }
    };

    const cancelEditing = () => {
        setEditingIndex(null);
        setNewValue({ ...newValue, amount: 0 });
    };

    const addSoftBenefit = () => {
        if (!softBenefitInput.trim()) return;
        setFormData(prev => ({
            ...prev,
            softBenefits: [...(prev.softBenefits || []), softBenefitInput.trim()]
        }));
        setSoftBenefitInput("");
    };

    const handleSave = () => {
        // Validation
        if (!formData.title || !formData.domain || !formData.stage) {
            showToast("Please fill in all core fields (Title, Domain, Stage).", "error");
            return;
        }
        if (!formData.commercialValue || formData.commercialValue.length === 0) {
            showToast("At least one Commercial Value is required.", "error");
            return;
        }

        onSave(formData as UseCase);
    };

    return (
        <div className="card-panel p-8 max-w-4xl mx-auto border border-slate-700/50 shadow-2xl bg-slate-900/80 backdrop-blur-md">
            <h2 className="text-2xl font-bold text-white mb-8 border-b border-slate-700/50 pb-5 flex items-center justify-between">
                <span>Refine Proposal</span>
                <span className="text-sm font-normal text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">Step 2 of 3</span>
            </h2>

            {/* Core Info */}
            <div className="grid gap-8 mb-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <label className="text-slate-400 font-medium mb-1.5 block">Title</label>
                        <input
                            value={formData.title || ""}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., AI-Driven Inventory Optimization"
                            className="w-full bg-slate-950/50 border-slate-700 text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 rounded-md py-2.5 px-4"
                        />
                    </div>
                    <div>
                        <label className="text-slate-400 font-medium mb-1.5 block">Domain</label>
                        <select
                            value={formData.domain || ""}
                            onChange={e => setFormData({ ...formData, domain: e.target.value })}
                            className="w-full bg-slate-950/50 border-slate-700 text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 rounded-md py-2.5 px-4"
                        >
                            <option value="">Select Domain...</option>
                            {DEFAULT_DOMAINS.map(d => <option key={d} value={d} className="bg-slate-900">{d}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="text-slate-400 font-medium mb-1.5 block">Description</label>
                    <textarea
                        value={formData.description || ""}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-slate-950/50 border-slate-700 text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 rounded-md py-3 px-4 min-h-[100px] resize-none leading-relaxed"
                        placeholder="Describe the business value..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="flex items-center gap-2 text-slate-400 font-medium mb-1.5">
                            Current Stage
                            <div className="group relative">
                                <Info size={14} className="text-slate-500 cursor-help" />
                                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-slate-800 text-xs text-slate-300 rounded shadow-lg border border-slate-700 z-10">
                                    Current maturity level of the project.
                                </div>
                            </div>
                        </label>
                        <select
                            value={formData.stage || ""}
                            onChange={e => setFormData({ ...formData, stage: e.target.value as Stage })}
                            className="w-full bg-slate-950/50 border-slate-700 text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 rounded-md py-2.5 px-4"
                        >
                            <option value="">Select Stage...</option>
                            {(Object.keys(STAGE_DEFINITIONS) as Stage[]).map(s => (
                                <option key={s} value={s} className="bg-slate-900">{s}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Value Section */}
            <div className="bg-slate-950/30 border border-slate-800/60 rounded-xl p-8 mb-8">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <span className="bg-indigo-500/20 text-indigo-300 p-1.5 rounded-lg"><Save size={20} /></span>
                    Value Proposition
                </h3>

                {/* Hard Gains */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Commercial Value (Hard)
                        </h4>
                        <span className="text-xs text-slate-500">Quantifiable outcomes</span>
                    </div>

                    {/* List of added values */}
                    <div className="space-y-3 mb-6">
                        {formData.commercialValue?.map((cv, i) => {
                            if (editingIndex === i) return null; // Hide while editing
                            return (
                                <div key={i} className="group flex items-center justify-between bg-slate-900/50 hover:bg-slate-800/50 p-4 rounded-lg border border-slate-800 hover:border-slate-700 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col">
                                            <span className="font-mono text-lg font-bold text-emerald-400">
                                                {cv.currency} {cv.amount.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="h-8 w-px bg-slate-800 mx-2"></div>
                                        <div className="flex flex-col">
                                            <span className="text-slate-200 font-medium">{cv.type}</span>
                                            <span className="text-xs text-slate-500 uppercase tracking-wide">{cv.duration}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => startEditing(i)} 
                                            className="p-2 hover:bg-blue-500/10 text-slate-400 hover:text-blue-400 rounded-md transition-colors"
                                            title="Edit Value"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button 
                                            onClick={() => removeCommercialValue(i)} 
                                            className="p-2 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-md transition-colors"
                                            title="Remove Value"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                        {formData.commercialValue?.length === 0 && (
                            <div className="text-center py-6 border border-dashed border-slate-800 rounded-lg text-slate-500 text-sm">
                                No commercial values added yet.
                            </div>
                        )}
                    </div>

                    {/* Add/Edit Value Form */}
                    <div className={`p-5 rounded-lg border transition-all duration-300 ${editingIndex !== null ? 'bg-indigo-500/5 border-indigo-500/30' : 'bg-slate-900/40 border-slate-800'}`}>
                        <div className="text-xs font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
                            {editingIndex !== null ? (
                                <>
                                    <span className="text-indigo-400">Editing Value</span>
                                    <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded text-[10px]">#{editingIndex + 1}</span>
                                </>
                            ) : (
                                <span className="text-slate-500">Add New Value</span>
                            )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                            <div className="md:col-span-4">
                                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Amount</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        placeholder="0" 
                                        value={newValue.amount || ''} 
                                        onChange={e => setNewValue({ ...newValue, amount: parseFloat(e.target.value) })}
                                        className="w-full bg-slate-950 border-slate-700 focus:border-indigo-500 rounded-md py-2 px-3 pl-3"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Currency</label>
                                <select 
                                    value={newValue.currency} 
                                    onChange={e => setNewValue({ ...newValue, currency: e.target.value as Currency })}
                                    className="w-full bg-slate-950 border-slate-700 focus:border-indigo-500 rounded-md py-2 px-3"
                                >
                                    {["USD", "EUR", "GBP", "Other"].map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
                                </select>
                            </div>
                            <div className="md:col-span-3">
                                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Type</label>
                                <select 
                                    value={newValue.type} 
                                    onChange={e => setNewValue({ ...newValue, type: e.target.value as ValueType })}
                                    className="w-full bg-slate-950 border-slate-700 focus:border-indigo-500 rounded-md py-2 px-3"
                                >
                                    {["Cost Savings", "Revenue Growth", "Productivity Gains", "Risk Reduction"].map(t => <option key={t} value={t} className="bg-slate-900">{t}</option>)}
                                </select>
                            </div>
                            <div className="md:col-span-3 flex gap-2">
                                {editingIndex !== null && (
                                    <button
                                        className="flex-1 btn-secondary h-[40px] justify-center bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white"
                                        onClick={cancelEditing}
                                        title="Cancel Edit"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    className={`flex-1 h-[40px] flex items-center justify-center rounded-md font-medium transition-all ${
                                        !newValue.amount 
                                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                    }`}
                                    onClick={addCommercialValue}
                                    disabled={!newValue.amount}
                                >
                                    {editingIndex !== null ? (
                                        <>
                                            <Save size={16} className="mr-2" /> Update
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={16} className="mr-2" /> Add
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Soft Benefits */}
                <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                        Qualitative Benefits
                    </h4>
                    <div className="bg-slate-900/30 p-4 rounded-lg border border-slate-800/50">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {formData.softBenefits?.map((sb, i) => (
                                <span key={i} className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1.5 rounded-full text-sm flex items-center gap-2 group transition-colors hover:bg-indigo-500/20">
                                    {sb}
                                    <button
                                        onClick={() => setFormData(prev => ({ ...prev, softBenefits: prev.softBenefits?.filter((_, idx) => idx !== i) }))}
                                        className="text-indigo-400/50 group-hover:text-indigo-300 hover:text-white transition-colors"
                                    ><X size={14} /></button>
                                </span>
                            ))}
                            {formData.softBenefits?.length === 0 && (
                                <span className="text-slate-500 text-sm italic">No qualitative benefits added.</span>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <input
                                placeholder="Add benefit (e.g. Employee Satisfaction)..."
                                value={softBenefitInput}
                                onChange={e => setSoftBenefitInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && addSoftBenefit()}
                                className="flex-1 bg-slate-950/50 border-slate-700 text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 rounded-md py-2.5 px-4"
                            />
                            <button 
                                className="btn-secondary px-6 bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200" 
                                onClick={addSoftBenefit}
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-700/50">
                <button className="btn-primary py-3 px-8 text-lg shadow-xl shadow-indigo-500/20" onClick={handleSave}>
                    <Save size={20} className="mr-2" />
                    Save Proposal
                </button>
            </div>
        </div>
    );
}
