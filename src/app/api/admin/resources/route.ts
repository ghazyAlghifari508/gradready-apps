import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET: List all learning resources
export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
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

// POST: Create a new resource
export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { skillId, title, url, platform, durationWeeks, isFree } =
    await req.json();
  if (!skillId || !title || !url || !platform) {
    return NextResponse.json(
      { error: "skillId, title, url, and platform are required" },
      { status: 400 }
    );
  }

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
