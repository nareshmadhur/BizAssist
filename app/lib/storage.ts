"use server";

import fs from "fs/promises";
import path from "path";
import os from "os";
import { UseCase } from "./types";
import { SEED_DATA } from "./seed";

// In production (Vercel), only /tmp is writable. 
// In development, we want to persist to the local file system.
const IS_PROD = process.env.NODE_ENV === "production";
const FILE_NAME = "use-cases.json";

// The persistent (or repo-based) source file
const REPO_DATA_FILE = path.join(process.cwd(), "data", FILE_NAME);

// The active file we read/write to
const ACTIVE_DATA_FILE = IS_PROD 
    ? path.join(os.tmpdir(), FILE_NAME) 
    : REPO_DATA_FILE;

async function ensureDataFile() {
    try {
        await fs.access(ACTIVE_DATA_FILE);
    } catch {
        // Active file doesn't exist.
        // If in production, try to populate it from the repo file first.
        let initialData = SEED_DATA;
        
        if (IS_PROD) {
            try {
                const repoData = await fs.readFile(REPO_DATA_FILE, "utf-8");
                initialData = JSON.parse(repoData);
            } catch (e) {
                // Fallback to seed if repo file missing or invalid
                console.warn("Could not read repo data file, using seed:", e);
            }
        }

        // Create dir if needed (mostly for local dev under data/)
        await fs.mkdir(path.dirname(ACTIVE_DATA_FILE), { recursive: true });
        
        // Initialize
        await fs.writeFile(ACTIVE_DATA_FILE, JSON.stringify(initialData, null, 2));
    }
}

export async function getUseCases(): Promise<UseCase[]> {
    await ensureDataFile();
    try {
        const data = await fs.readFile(ACTIVE_DATA_FILE, "utf-8");
        const parsed = JSON.parse(data) as UseCase[];
        
        // Auto-seed if empty (fixes issue where user sees no data if file was created empty)
        if (parsed.length === 0) {
            await fs.writeFile(ACTIVE_DATA_FILE, JSON.stringify(SEED_DATA, null, 2));
            return SEED_DATA;
        }
        
        return parsed;
    } catch (error) {
        // If file is corrupted or unreadable, return seed
        console.error("Error reading use cases:", error);
        return SEED_DATA;
    }
}

export async function getUseCaseById(id: string): Promise<UseCase | undefined> {
    const cases = await getUseCases();
    return cases.find(c => c.id === id);
}

export async function deleteUseCase(id: string): Promise<void> {
    const cases = await getUseCases();
    const filtered = cases.filter(c => c.id !== id);
    await fs.writeFile(ACTIVE_DATA_FILE, JSON.stringify(filtered, null, 2));
}

export async function saveUseCase(useCase: UseCase): Promise<void> {
    const cases = await getUseCases();
    cases.push(useCase);
    await fs.writeFile(ACTIVE_DATA_FILE, JSON.stringify(cases, null, 2));
}

export async function updateUseCase(id: string, updates: Partial<UseCase>): Promise<void> {
    const cases = await getUseCases();
    const index = cases.findIndex(c => c.id === id);
    if (index !== -1) {
        cases[index] = { ...cases[index], ...updates };
        await fs.writeFile(ACTIVE_DATA_FILE, JSON.stringify(cases, null, 2));
    }
}

// Helper to calculate total value (simplistic aggregation for dashboard)
export async function getTotalPotentialValue(): Promise<number> {
    const cases = await getUseCases();
    return cases.reduce((total, c) => {
        // Summing all commercial values (assuming USD for simplicity in this prototype)
        const caseTotal = c.commercialValue.reduce((sum, v) => sum + v.amount, 0);
        return total + caseTotal;
    }, 0);
}
