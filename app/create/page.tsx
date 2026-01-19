"use client";

import { useState } from "react";
import { UseCase } from "@/app/lib/types";
import { saveUseCase } from "@/app/lib/storage";
import { saveClientUseCase } from "@/app/lib/client-storage";
import { extractUseCaseFromText } from "@/app/actions";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/providers/ToastProvider";
import Link from "next/link";

export default function CreatePage() {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSkipping, setIsSkipping] = useState(false);
    const { showToast } = useToast();
    const router = useRouter();

    const generateId = () => {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    };

    const handleStartAnalysis = async () => {
        if (text.length < 20) {
            showToast("Please provide a bit more detail (at least 20 characters).", "error");
            return;
        }

        setLoading(true);
        try {
            const extracted = await extractUseCaseFromText(text);
            const newId = generateId();
            const finalData = {
                ...extracted,
                id: newId,
                createdAt: new Date().toISOString()
            } as UseCase;
            
            // Save to client storage first (reliable)
            saveClientUseCase(finalData);

            // Attempt to save to server (might fail in production without DB)
            try {
                await saveUseCase(finalData);
            } catch (err) {
                console.warn("Server save failed, proceeding with client storage", err);
            }

            router.push(`/strategy/${newId}`);
        } catch (e) {
            console.error(e);
            showToast("Analysis failed. Please try again.", "error");
            setLoading(false);
        }
    };

    const handleSkipToEditor = async () => {
        setIsSkipping(true);
        try {
            const newId = generateId();
            const emptyData: UseCase = {
                id: newId,
                title: "Untitled Strategy",
                description: "",
                domain: "General",
                stage: "Idea",
                commercialValue: [],
                softBenefits: [],
                createdAt: new Date().toISOString()
            };
            
            // Save to client storage first (reliable)
            saveClientUseCase(emptyData);

            // Attempt to save to server
            try {
                await saveUseCase(emptyData);
            } catch (err) {
                console.warn("Server save failed, proceeding with client storage", err);
            }

            router.push(`/strategy/${newId}`);
        } catch (error) {
            console.error("Skip to editor failed:", error);
            showToast("Failed to create new strategy. Please try again.", "error");
            setIsSkipping(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-indigo-200 blur-3xl opacity-40 animate-pulse"></div>
                    <Loader2 className="animate-spin text-indigo-600 relative" size={64} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-3">Consulting AI Analyst</h2>
                <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                    We&apos;re structuring your thoughts into a professional business case. This usually takes 10-15 seconds...
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50">
            <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Link href="/" className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
                    <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
                </Link>

                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Brief your Copilot</h1>
                    <p className="text-xl text-slate-500">
                        Describe the initiative in your own words. Don&apos;t worry about the structure—the AI will handle the heavy lifting.
                    </p>
                </div>

                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xl">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Example: We want to use computer vision at our loading docks to automatically scan pallets for damage. We expect this to save $2M annually in insurance claims and speed up unloading by 15%..."
                            className="w-full h-64 p-6 bg-transparent border-none text-slate-800 placeholder-slate-400 focus:ring-0 text-lg resize-none leading-relaxed"
                            autoFocus
                        />
                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                            <span className="text-xs text-slate-400">
                                {text.length} characters
                            </span>
                            <button
                                onClick={handleStartAnalysis}
                                disabled={text.length < 20}
                                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
                            >
                                <Sparkles size={18} />
                                Generate First Draft
                            </button>
                        </div>
                    </div>
                    <div className="mt-6 text-center relative z-10">
                        <button 
                            onClick={handleSkipToEditor} 
                            disabled={isSkipping || loading}
                            className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors py-2 px-4 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSkipping ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="animate-spin" size={14} />
                                    Creating...
                                </span>
                            ) : (
                                "Skip AI & Start Manually"
                            )}
                        </button>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                        <div className="text-indigo-600 text-xs font-bold uppercase mb-1">Step 1</div>
                        <div className="text-slate-600 text-sm">Brief your idea</div>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                        <div className="text-indigo-600 text-xs font-bold uppercase mb-1">Step 2</div>
                        <div className="text-slate-600 text-sm">AI structures the case</div>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                        <div className="text-indigo-600 text-xs font-bold uppercase mb-1">Step 3</div>
                        <div className="text-slate-600 text-sm">Refine in Boardroom</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

