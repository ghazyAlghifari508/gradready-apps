import { assertAdmin } from "@/lib/admin";
import AdminArticlesClientPage from "./AdminArticlesClientPage";

export default async function AdminArticlesPage() {
  await assertAdmin();

  return <AdminArticlesClientPage />;
}
