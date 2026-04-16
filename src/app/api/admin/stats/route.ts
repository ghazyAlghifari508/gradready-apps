import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const [totalUsers, totalCvRecords, cvScores] = await Promise.all([
    prisma.user.count(),
    prisma.cvRecord.count(),
    prisma.cvRecord.findMany({
      where: { score: { not: null } },
      select: { score: true },
    }),
  ]);

  const avgScore =
    cvScores.length > 0
      ? Math.round(
          cvScores.reduce((sum: number, r: { score: number | null }) => sum + (r.score ?? 0), 0) / cvScores.length
        )
      : 0;

  return NextResponse.json({ totalUsers, totalCvRecords, avgScore });
}
