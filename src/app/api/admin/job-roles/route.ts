import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET: List all job roles
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const jobRoles = await prisma.jobRole.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { skills: true, profiles: true } },
    },
  });

  return NextResponse.json({ jobRoles });
}

// POST: Create new job role
export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { name, category, description, avgSalaryMin, avgSalaryMax, demandLevel } =
    await req.json();

  if (!name || !category) {
    return NextResponse.json(
      { error: "name and category are required" },
      { status: 400 }
    );
  }

  const jobRole = await prisma.jobRole.create({
    data: {
      name,
      category,
      description: description || null,
      avgSalaryMin: avgSalaryMin ? Number(avgSalaryMin) : null,
      avgSalaryMax: avgSalaryMax ? Number(avgSalaryMax) : null,
      demandLevel: demandLevel ?? "MEDIUM",
    },
  });

  return NextResponse.json({ jobRole }, { status: 201 });
}
