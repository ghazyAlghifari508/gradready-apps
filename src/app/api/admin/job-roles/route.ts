import { auth, isAdmin } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const jobRoleSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.string().min(1).max(100),
  description: z.string().optional().default(""),
  avgSalaryMin: z.coerce.number().positive().optional(),
  avgSalaryMax: z.coerce.number().positive().optional(),
  demandLevel: z.enum(["HIGH", "MEDIUM", "LOW"]).optional().default("MEDIUM"),
});

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!isAdmin(session)) {
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

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const parsed = jobRoleSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
  }
  const { name, category, description, avgSalaryMin, avgSalaryMax, demandLevel } = parsed.data;

  if (!name || !category) {
    return NextResponse.json(
      { error: "name and category are required" },
      { status: 400 },
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
