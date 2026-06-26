import { assertAdmin } from "@/lib/admin";
import AdminResourcesClientPage from "./AdminResourcesClientPage";

export default async function AdminResourcesPage() {
  await assertAdmin();

  return <AdminResourcesClientPage />;
}
