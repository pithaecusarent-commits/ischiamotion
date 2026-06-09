import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { requireAdmin } from "@/lib/supabase/admin-auth";
import { getAdminDashboardData } from "@/lib/supabase/queries/admin-dashboard";

export default async function AdminPage() {
  const { accessToken, profile } = await requireAdmin("/admin");
  const dashboardData = await getAdminDashboardData(accessToken);

  return <AdminDashboard data={dashboardData} adminEmail={profile.email} />;
}
