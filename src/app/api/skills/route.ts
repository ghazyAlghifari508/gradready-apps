import { auth, isAdmin } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const skills = await prisma.skill.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, category: true },
  });

  return NextResponse.json({ skills });
}
