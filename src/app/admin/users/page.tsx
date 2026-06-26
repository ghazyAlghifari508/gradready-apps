import { assertAdmin } from "@/lib/admin";
import AdminUsersClientPage from "./AdminUsersClientPage";

export default async function AdminUsersPage() {
  await assertAdmin();

  return <AdminUsersClientPage />;
}
