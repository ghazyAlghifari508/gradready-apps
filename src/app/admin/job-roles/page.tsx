import { assertAdmin } from "@/lib/admin";
import AdminJobRolesClientPage from "./AdminJobRolesClientPage";

export default async function AdminJobRolesPage() {
  await assertAdmin();

  return <AdminJobRolesClientPage />;
}
