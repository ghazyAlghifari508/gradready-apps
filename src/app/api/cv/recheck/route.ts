// app/api/cv/recheck/route.ts — POST /api/cv/recheck
// Upload new CV, compare scores with previous version

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

    // Get last 2 CV versions for comparison
    const cvRecords = await prisma.cvRecord.findMany({
      where: { userId: session.user.id },
      orderBy: { versionNumber: "desc" },
      take: 2,
    });

    return NextResponse.json({ cvRecords });
  } catch (error) {
    console.error("GET /api/cv/recheck error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
