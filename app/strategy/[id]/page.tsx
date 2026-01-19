import { getUseCaseById } from "@/app/lib/storage";
import StrategyEditor from "@/components/StrategyEditor/StrategyEditor";

export default async function StrategyPage({ params }: { params: Promise<{ id: string }> }) {
    // Await params before accessing its properties
    const { id } = await params;
    
    // Try to load from server (seed data or persistent if available)
    const useCase = await getUseCaseById(id);

    // Even if not found on server, render the editor.
    // The editor will check client-side storage for the data.
    return <StrategyEditor initialData={useCase} strategyId={id} />;
}
