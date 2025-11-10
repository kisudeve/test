import { fetchDashboardData } from "@/components/dashboard/model/dashboard";
import DashboardContentWrapper from "@/components/dashboard/ui/DashboardContentWrapper";

export default async function DashboardContent() {
  const data = await fetchDashboardData(); // 더미 데이터

  return <DashboardContentWrapper initialData={data} />;
}
