import { fetchDashboardData } from "@/components/dashboard/model/dashboard";
import DashboardContentWrapper from "@/components/dashboard/ui/DashboardContentWrapper";

// 실제 currentUsers 값은 클라이언트 컴포넌트(DashboardContentWrapper)에서 업데이트됨
export default async function DashboardContent() {
  const data = await fetchDashboardData(1); // 현재 접속자 기본 1 선언
  return <DashboardContentWrapper initialData={data} />;
}
