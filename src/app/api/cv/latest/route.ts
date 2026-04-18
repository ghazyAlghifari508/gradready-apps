// app/api/cv/latest/route.ts — GET /api/cv/latest
// Returns the user's most recent CV record + score history

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
  void request;
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const latestCv = await prisma.cvRecord.findFirst({
      where: { userId: session.user.id, isLatest: true },
      include: {
        scoreHistory: {
          orderBy: { recordedAt: "asc" },
          select: { score: true, recordedAt: true },
        },
      },
    });

    if (!latestCv) {
      return NextResponse.json({ cv: null });
    }

    return NextResponse.json({ cv: latestCv });
  } catch (error) {
    console.error("GET /api/cv/latest error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
