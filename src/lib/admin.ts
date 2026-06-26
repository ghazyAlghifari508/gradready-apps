import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ROLES } from "@/lib/roles";

export async function assertAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== ROLES.ADMIN) {
    redirect("/forbidden");
  }

  return session;
}
