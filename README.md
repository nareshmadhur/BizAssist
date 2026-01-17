# BizAssist - Strategic AI Portfolio Manager

**BizAssist** is an executive-grade application designed for Chief Data/AI Officers and Business Leaders to ideate, structure, and manage their portfolio of AI initiatives.

Moving beyond simple "form filling," BizAssist creates an **"AI Boardroom"** experience where leaders draft strategies in natural language, and an AI Copilot structures them into professional business cases with quantified value.

![BizAssist Dashboard Concept](https://placeholder-image-url.com/dashboard) *(Replace with actual screenshot if available)*

## 🚀 Key Features

### 1. The Executive Dashboard
- **High-Level KPIs:** Real-time visibility into Total Value Pipeline, Active Initiatives, and Average Maturity.
- **Innovation Funnel:** Visual breakdown of projects from Idea to Production.
- **Strategic Briefing:** A quick-glance table of the most critical initiatives.

### 2. The AI Boardroom (Strategy Editor)
- **Split-Screen Interface:** A "Living Document" on the left and an AI Consultant on the right.
- **AI-Powered Structuring:** Converts rough brain dumps into structured proposals (Executive Summary, Commercial Value, Soft Benefits).
- **Direct Manipulation:** Click-to-edit any section of the strategy document.
- **Auto-Save:** Seamless persistence of your strategic thinking.

### 3. Portfolio Management
- **Searchable Inventory:** Filter initiatives by Domain, Stage, or Keyword.
- **Status Tracking:** Monitor progress from PoC to Production.

### 4. Configurable Platform
- **Domain Taxonomy:** Customize business domains (e.g., Supply Chain, HR, Legal) to fit your organization.
- **Regional Support:** Manage multiple currency types for global organizations.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **AI Integration:** [Google Gemini API](https://ai.google.dev/) (`gemini-2.0-flash-exp`)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Storage:** Local JSON file system (Prototype-ready, easily upscalable to DB).

## 🏁 Getting Started

### Prerequisites
- Node.js 18+ installed.
- A Google Gemini API Key ([Get one here](https://aistudio.google.com/)).

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/bizassist.git
   cd bizassist
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Run the application:**
   ```bash
   npm run dev
   ```

5. **Access the Boardroom:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```
├── app/
│   ├── actions.ts          # Server Actions (AI, Storage)
│   ├── layout.tsx          # Main Layout (Sidebar + Shell)
│   ├── page.tsx            # Executive Dashboard
│   ├── create/             # "Brief Your Copilot" Flow
│   ├── portfolio/          # List View of Initiatives
│   ├── settings/           # Domain & Currency Config
│   ├── strategy/[id]/      # The "Boardroom" Editor Page
│   └── lib/
│       ├── seed.ts         # Demo Data
│       ├── storage.ts      # File-based Persistence
│       └── types.ts        # TypeScript Interfaces
├── components/
│   └── StrategyEditor/     # Core Split-Screen Component
└── data/                   # JSON Storage (Gitignored)
```

## 🧠 AI Integration

The application uses Google's Gemini Pro model to act as a **Business Analyst**.
- **Input:** Raw, unstructured text (e.g., "We need to fix our supply chain delays using AI").
- **Process:** The AI analyzes the intent, identifies the domain, estimates the stage, and extracts potential commercial value (Cost Savings vs. Revenue Growth).
- **Output:** A structured JSON object that populates the Strategy Document.

## 📝 Usage Guide

1.  **Draft:** Click "New Initiative" and describe your idea in plain English.
2.  **Refine:** The AI generates a draft. Enter the **Boardroom** view to tweak numbers, rewrite descriptions, or ask the AI to expand on specific sections.
3.  **Monitor:** Use the **Dashboard** to track the total potential value of your portfolio as it grows.

---

*Built for the modern Executive.*