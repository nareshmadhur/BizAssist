"use server";

import fs from "fs/promises";
import path from "path";

const SETTINGS_FILE = path.join(process.cwd(), "data", "settings.json");

export interface AppSettings {
    domains: string[];
    currencies: string[];
}

const DEFAULT_SETTINGS: AppSettings = {
    domains: [
        "Customer Experience",
        "Supply Chain",
        "Merchandising",
        "HR",
        "Finance",
        "Marketing",
        "IT / Tech",
        "Legal",
        "R&D"
    ],
    currencies: ["USD", "EUR", "GBP", "JPY", "CAD", "AUD"]
};

async function ensureSettingsFile() {
    try {
        await fs.access(SETTINGS_FILE);
    } catch {
        await fs.mkdir(path.dirname(SETTINGS_FILE), { recursive: true });
        await fs.writeFile(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2));
    }
}

export async function getSettings(): Promise<AppSettings> {
    await ensureSettingsFile();
    const data = await fs.readFile(SETTINGS_FILE, "utf-8");
    return JSON.parse(data) as AppSettings;
}

export async function saveSettings(settings: AppSettings): Promise<void> {
    await ensureSettingsFile();
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2));
}
