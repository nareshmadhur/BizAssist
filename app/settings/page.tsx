"use client";

import { useState, useEffect } from "react";
import { getSettingsAction, saveSettingsAction } from "@/app/actions";
import { AppSettings } from "@/app/lib/settings";
import { Plus, X } from "lucide-react";
import { useToast } from "@/components/providers/ToastProvider";

export default function SettingsPage() {
    const [settings, setSettings] = useState<AppSettings | null>(null);
    const [newDomain, setNewDomain] = useState("");
    const { showToast } = useToast();

    useEffect(() => {
        getSettingsAction().then(setSettings);
    }, []);

    const handleSave = async (updated: AppSettings) => {
        setSettings(updated);
        try {
            await saveSettingsAction(updated);
            showToast("Settings updated", "success");
        } catch (e) {
            showToast("Failed to save settings", "error");
        }
    };

    const addDomain = () => {
        if (!newDomain.trim() || !settings) return;
        const updated = { ...settings, domains: [...settings.domains, newDomain.trim()] };
        handleSave(updated);
        setNewDomain("");
    };

    const removeDomain = (index: number) => {
        if (!settings) return;
        const updated = { ...settings, domains: settings.domains.filter((_, i) => i !== index) };
        handleSave(updated);
    };

    if (!settings) return <div className="p-8 text-slate-500">Loading settings...</div>;

    return (
        <div className="h-full overflow-y-auto p-8 max-w-4xl bg-slate-50">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Platform Settings</h1>
                <p className="text-slate-500">Configure global taxonomies and system preferences.</p>
            </header>

            <div className="space-y-12">
                {/* Domain Management */}
                <section>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Business Domains</h3>
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <div className="flex flex-wrap gap-2 mb-6">
                            {settings.domains.map((domain, i) => (
                                <span key={i} className="bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-2 text-sm group">
                                    {domain}
                                    <button 
                                        onClick={() => removeDomain(i)}
                                        className="text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                        
                        <div className="flex gap-2 max-w-md">
                            <input 
                                value={newDomain}
                                onChange={e => setNewDomain(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && addDomain()}
                                placeholder="Add new domain (e.g. Legal)..."
                                className="flex-1 bg-white border-slate-200 rounded-lg px-4 py-2 text-sm focus:border-indigo-500 shadow-sm"
                            />
                            <button 
                                onClick={addDomain}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors shadow-sm"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Currency Management (Simplified) */}
                <section>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Regional Currencies</h3>
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <div className="flex flex-wrap gap-2">
                            {settings.currencies.map((curr, i) => (
                                <span key={i} className="bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 text-sm">
                                    {curr}
                                </span>
                            ))}
                        </div>
                        <p className="text-xs text-slate-500 mt-4 italic">Currency additions are currently restricted to platform admins.</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
