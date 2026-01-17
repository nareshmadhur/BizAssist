import { UseCase } from "./types";

export const SEED_DATA: UseCase[] = [
    {
        id: "1",
        title: "AI-Driven Supply Chain Optimization",
        description: "Implement predictive analytics to optimize inventory levels across regional distribution centers. By analyzing historical sales data, weather patterns, and local events, we can reduce stockouts and minimize overstock holding costs.",
        domain: "Supply Chain",
        stage: "Pilot",
        commercialValue: [
            { amount: 2500000, currency: "USD", type: "Cost Savings", duration: "Annual" },
            { amount: 500000, currency: "USD", type: "Productivity Gains", duration: "Annual" }
        ],
        softBenefits: ["Improved supplier relationships", "Reduced waste footprint", "Faster reaction to market shifts"],
        createdAt: new Date().toISOString()
    },
    {
        id: "2",
        title: "Customer Service Auto-Triage Agent",
        description: "Deploy a GenAI-powered triage system for L1 support tickets. The system will categorize incoming requests, suggest responses to agents, and fully automate simple queries like 'Reset Password' or 'Order Status'.",
        domain: "Customer Experience",
        stage: "PoC",
        commercialValue: [
            { amount: 1200000, currency: "USD", type: "Cost Savings", duration: "Annual" }
        ],
        softBenefits: ["Higher agent job satisfaction", "24/7 instant response availability", "Consistent tone of voice"],
        createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
    },
    {
        id: "3",
        title: "Personalized Marketing Content Engine",
        description: "A centralized platform for generating personalized email and ad copy at scale. Using customer segment data, the engine tailors messaging to specific demographics, increasing engagement rates.",
        domain: "Marketing",
        stage: "Idea",
        commercialValue: [
            { amount: 4000000, currency: "USD", type: "Revenue Growth", duration: "Annual" }
        ],
        softBenefits: ["Faster campaign time-to-market", "Brand consistency", "A/B testing automation"],
        createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
    }
];
