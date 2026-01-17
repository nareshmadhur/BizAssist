export type Stage = "Idea" | "PoC" | "MVP" | "Pilot" | "Production";

export const STAGE_DEFINITIONS: Record<Stage, string> = {
    Idea: "Concept phase, no code yet.",
    PoC: "Technical feasibility confirmed, minimal functionality.",
    MVP: "Core value deliverable to a small group.",
    Pilot: "Real-world test with a limited scope/user base.",
    Production: "Fully deployed and operational.",
};

export type ValueType = "Cost Savings" | "Revenue Growth" | "Productivity Gains" | "Risk Reduction";
export type Currency = "USD" | "EUR" | "GBP" | "Other";
export type Duration = "Annual" | "One-time";

export interface CommercialValue {
    amount: number;
    currency: Currency;
    type: ValueType;
    duration: Duration;
}

export interface UseCase {
    id: string; // UUID
    title: string;
    description: string;
    domain: string;
    stage: Stage;

    // Value Props
    commercialValue: CommercialValue[]; // Array to allow multiple types of value
    softBenefits: string[]; // List of tags/sentences

    createdAt: string; // ISO Date
}

// Config lists
export const DEFAULT_DOMAINS = [
    "Customer Experience",
    "Supply Chain",
    "Merchandising",
    "HR",
    "Finance",
    "Marketing",
    "IT / Tech"
];
