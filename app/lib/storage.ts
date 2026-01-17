"use server";

import fs from "fs/promises";
import path from "path";
import { UseCase } from "./types";
import { SEED_DATA } from "./seed";

const DATA_FILE = path.join(process.cwd(), "data", "use-cases.json");

async function ensureDataFile() {
    try {
        await fs.access(DATA_FILE);
    } catch {
        // Create dir if not exists
        await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
        // Initialize with seed data
        await fs.writeFile(DATA_FILE, JSON.stringify(SEED_DATA, null, 2));
    }
}

export async function getUseCases(): Promise<UseCase[]> {
    await ensureDataFile();
    const data = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(data) as UseCase[];
    
    // Auto-seed if empty (fixes issue where user sees no data if file was created empty)
    if (parsed.length === 0) {
        await fs.writeFile(DATA_FILE, JSON.stringify(SEED_DATA, null, 2));
        return SEED_DATA;
    }
    
    return parsed;
}

export async function getUseCaseById(id: string): Promise<UseCase | undefined> {
    const cases = await getUseCases();
    return cases.find(c => c.id === id);
}

export async function deleteUseCase(id: string): Promise<void> {
    const cases = await getUseCases();
    const filtered = cases.filter(c => c.id !== id);
    await fs.writeFile(DATA_FILE, JSON.stringify(filtered, null, 2));
}

export async function saveUseCase(useCase: UseCase): Promise<void> {
    const cases = await getUseCases();
    cases.push(useCase);
    await fs.writeFile(DATA_FILE, JSON.stringify(cases, null, 2));
}

export async function updateUseCase(id: string, updates: Partial<UseCase>): Promise<void> {
    const cases = await getUseCases();
    const index = cases.findIndex(c => c.id === id);
    if (index !== -1) {
        cases[index] = { ...cases[index], ...updates };
        await fs.writeFile(DATA_FILE, JSON.stringify(cases, null, 2));
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
