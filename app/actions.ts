"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { UseCase } from "./lib/types";
import { updateUseCase, deleteUseCase } from "./lib/storage";
import { getSettings as getAppSettings, saveSettings as saveAppSettings, AppSettings } from "./lib/settings";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function getSettingsAction() {
    return await getAppSettings();
}

export async function saveSettingsAction(settings: AppSettings) {
    await saveAppSettings(settings);
}

export async function extractUseCaseFromText(text: string): Promise<Partial<UseCase>> {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("Missing GEMINI_API_KEY environment variable");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `
You are an expert Business Analyst. Your task is to extract a structured Business Use Case from the loose text provided below.
Input text:
"${text}"
Return ONLY a valid JSON object. Do not include explanations, comments, or formatting outside JSON.
Extract and populate the following fields. All fields must be present, even if empty.
title: A professional, executive-ready summary title (max 10 words).
description: A clear, business-focused description of the problem and proposed solution (max 3 sentences). Do not invent or infer quantitative results.
domain: Select exactly one best-fitting domain from [Customer Experience, Supply Chain, Merchandising, HR, Finance, Marketing, IT / Tech]. If none fit, propose one concise new domain (max 3 words).
stage: Select exactly one stage from [Idea, PoC, MVP, Pilot, Production]. If unclear, default to "Idea".
commercialValue: An array of objects with the following structure:
{
amount: number,
currency: "USD" | "EUR" | "Other",
type: "Cost Savings" | "Revenue Growth" | "Productivity Gains" | "Risk Reduction",
duration: "Annual" | "One-time"
}
Rules for commercialValue:
Include entries only if the input text explicitly states a concrete monetary value.
Convert shorthand (e.g., "$1M" → 1000000).
If a range is given, use the average only if both bounds are explicitly stated.
Do NOT estimate, infer, or benchmark values.
If no concrete values are found, return an empty array.
softBenefits: An array of qualitative benefits explicitly mentioned or clearly implied in the text (strings).
    Return ONLY the raw JSON object. Do not include markdown formatting like 
  `;

    console.error(`[AI_DEBUG ${new Date().toISOString()}] --- AI Extraction Prompt ---`);
    console.error(prompt);
    console.error("----------------------------");

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textResponse = response.text();

        console.error(`[AI_DEBUG ${new Date().toISOString()}] --- AI Extraction Response ---`);
        console.error(textResponse);
        console.error("------------------------------");

        // Clean up if the model adds markdown
        const jsonStr = textResponse.replace(/```json/g, "").replace(/```/g, "").trim();

        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("AI Extraction Failed:", error);
        // Fallback to basic structure if AI fails
        return {
            title: "New AI Initiative",
            description: text.slice(0, 100) + "...",
            domain: "General",
            stage: "Idea",
            commercialValue: [],
            softBenefits: []
        };
    }
}

export async function updateUseCaseAction(id: string, data: Partial<UseCase>) {
    await updateUseCase(id, data);
}

export async function deleteUseCaseAction(id: string) {
    await deleteUseCase(id);
}

export async function chatWithStrategy(
    message: string,
    history: { role: 'user' | 'ai', text: string }[],
    context: Partial<UseCase>
): Promise<string> {
    if (!process.env.GEMINI_API_KEY) {
        return "I'm sorry, but I can't connect to my brain right now (Missing API Key).";
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const contextStr = JSON.stringify(context, null, 2);

    const systemPrompt = `
You are an expert Business Strategy Consultant Copilot.
You are helping a user refine a business case strategy.
Current Strategy Context (JSON):
${contextStr}

Your goal is to help the user improve, clarify, or expand on this strategy.
- Be ultra-concise, professional, and insightful. Keep it within 1 paragraph wherever possible.
- If the user asks for changes, suggest specific text or improvements.
- You cannot directly modify the database, so guide the user on what to write or provide draft text they can copy.
- Refer to the specific fields in the context (title, description, commercialValue, etc.) when relevant.

Conversation History:
${history.map(h => `${h.role.toUpperCase()}: ${h.text}`).join('\n')}
USER: ${message}
AI:
`;

    try {
        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("AI Chat Failed:", error);
        return "I'm having trouble thinking right now. Please try again later.";
    }
}
