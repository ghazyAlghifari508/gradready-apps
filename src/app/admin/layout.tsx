import React from "react";
import { assertAdmin } from "@/lib/admin";
import AdminLayoutShell from "./AdminLayoutShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertAdmin();

  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
