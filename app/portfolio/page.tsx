import { getUseCases } from "@/app/lib/storage";
import PortfolioView from "@/components/Portfolio/PortfolioView";

export const dynamic = 'force-dynamic';

export default async function PortfolioPage() {
    const useCases = await getUseCases();

    return <PortfolioView serverData={useCases} />;
}