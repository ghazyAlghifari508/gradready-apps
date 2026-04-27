import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// PATCH: Update job role
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();

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

// DELETE: Remove job role
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.jobRole.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
