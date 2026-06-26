import { assertAdmin } from "@/lib/admin";
import AdminDashboardClientPage from "./AdminDashboardClientPage";

export default async function AdminDashboardPage() {
  await assertAdmin();

  return <AdminDashboardClientPage />;
}
