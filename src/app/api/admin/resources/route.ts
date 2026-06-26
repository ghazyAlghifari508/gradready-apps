import { auth, isAdmin } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const resourceSchema = z.object({
  skillId: z.string().min(1),
  title: z.string().min(1).max(200),
  url: z.string().url().max(500),
  platform: z.string().min(1).max(100),
  durationWeeks: z.coerce.number().int().positive().optional(),
  isFree: z.boolean().optional().default(true),
});

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const skillId = searchParams.get("skillId");

  const resources = await prisma.learningResource.findMany({
    where: skillId ? { skillId } : undefined,
    include: { skill: { select: { id: true, name: true, category: true } } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return NextResponse.json({ resources });
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const parsed = resourceSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
  }
  const { skillId, title, url, platform, durationWeeks, isFree } = parsed.data;

  const resource = await prisma.learningResource.create({
    data: {
      skillId,
      title,
      url,
      platform,
      durationWeeks: durationWeeks ? Number(durationWeeks) : null,
      isFree: isFree !== false,
    },
  });

  return NextResponse.json({ resource }, { status: 201 });
}
