import { getUseCaseById } from "@/app/lib/storage";
import StrategyEditor from "@/components/StrategyEditor/StrategyEditor";
import { notFound } from "next/navigation";

export default async function StrategyPage({ params }: { params: Promise<{ id: string }> }) {
    // Await params before accessing its properties
    const { id } = await params;
    
    const useCase = await getUseCaseById(id);

    if (!useCase) {
        notFound();
    }

    return <StrategyEditor initialData={useCase} />;
}
