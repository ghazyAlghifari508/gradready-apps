import { auth, isAdmin } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const jobRolePatchSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  category: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  avgSalaryMin: z.coerce.number().positive().optional(),
  avgSalaryMax: z.coerce.number().positive().optional(),
  demandLevel: z.enum(["HIGH", "MEDIUM", "LOW"]).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const parsed = jobRolePatchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
  }
  const body = parsed.data;

  const jobRole = await prisma.jobRole.update({
    where: { id },
    data: {
      name: body.name,
      category: body.category,
      description: body.description ?? null,
      avgSalaryMin: body.avgSalaryMin ? Number(body.avgSalaryMin) : null,
      avgSalaryMax: body.avgSalaryMax ? Number(body.avgSalaryMax) : null,
      demandLevel: body.demandLevel ?? "MEDIUM",
    },
  });

  return NextResponse.json({ jobRole });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.jobRole.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
