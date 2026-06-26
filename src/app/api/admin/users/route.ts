import { auth, isAdmin, isRole } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/errors";
import { z } from "zod";

export const dynamic = "force-dynamic";

const getSchema = z.object({ search: z.string().max(100).optional() });
const patchSchema = z.object({
  userId: z.string().cuid(),
  role: z.string(),
});

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const parsed = getSchema.safeParse({ search: searchParams.get("search") ?? undefined });
  if (!parsed.success) return apiError(400, "INVALID_PAYLOAD", parsed.error.issues);
  const search = parsed.data.search ?? "";

  const users = await prisma.user.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { cvRecords: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ users });
}

export async function PATCH(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = patchSchema.safeParse(await req.json().catch(() => null));
  if (!body.success) return apiError(400, "INVALID_PAYLOAD", body.error.issues);
  const { userId, role } = body.data;
  if (!isRole(role)) return apiError(400, "INVALID_PAYLOAD", "Invalid role value");

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: { id: true, name: true, role: true },
  });

  return NextResponse.json({ user: updated });
}
