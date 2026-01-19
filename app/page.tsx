import { getUseCases } from "@/app/lib/storage";
import DashboardView from "@/components/Dashboard/DashboardView";

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const useCases = await getUseCases();
  
  return <DashboardView serverData={useCases} />;
}