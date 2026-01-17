"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

interface InputStepProps {
    onComplete: (text: string) => void;
}

export default function InputStep({ onComplete }: InputStepProps) {
    const [text, setText] = useState("");

    return (
        <div className="card-panel p-8 max-w-3xl mx-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                    Define Business Case
                </h2>
                <p className="text-slate-400 max-w-xl">
                    Provide a rough description of the problem and desired outcome. The AI agent will structure this into a formal proposal.
                </p>
            </div>

            <label className="mb-2 block">Opportunity Description</label>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ex: We need to automate invoice processing in Finance to reduce manual hours by 40%..."
                className="w-full h-48 mb-6 resize-none"
            />

            <div className="flex justify-end bg-slate-900/50 -m-8 mt-0 p-4 border-t border-slate-800">
                <button
                    className="btn-primary"
                    onClick={() => onComplete(text)}
                    disabled={text.length < 10}
                >
                    <Sparkles size={18} className="mr-2" />
                    Analyze with AI
                </button>
            </div>
        </div>
    );
}
