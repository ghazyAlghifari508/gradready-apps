import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const jobRoles = await prisma.jobRole.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, category: true, description: true },
    });
    return NextResponse.json({ jobRoles });
  } catch {
    return NextResponse.json({ jobRoles: [] }, { status: 500 });
  }
}
