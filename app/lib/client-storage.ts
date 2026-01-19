import { UseCase } from "./types";
import { SEED_DATA } from "./seed";

const STORAGE_KEY = "bizassist_use_cases_v1";

export function getClientUseCases(): UseCase[] {
    if (typeof window === "undefined") return [];
    
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        // Initialize with seed if empty? Or keep empty? 
        // For consistency, let's say we don't sync seed data to local storage 
        // unless the user edits them. But for simplicity, let's just return empty array
        // and handle merging in the UI.
        return [];
    } catch (e) {
        console.error("Failed to read from local storage", e);
        return [];
    }
}

export function saveClientUseCase(useCase: UseCase) {
    if (typeof window === "undefined") return;
    
    const cases = getClientUseCases();
    const existingIndex = cases.findIndex(c => c.id === useCase.id);
    
    if (existingIndex >= 0) {
        cases[existingIndex] = useCase;
    } else {
        cases.push(useCase);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
}

export function deleteClientUseCase(id: string) {
    if (typeof window === "undefined") return;
    
    const cases = getClientUseCases();
    const filtered = cases.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function getClientUseCaseById(id: string): UseCase | undefined {
    const cases = getClientUseCases();
    return cases.find(c => c.id === id);
}
