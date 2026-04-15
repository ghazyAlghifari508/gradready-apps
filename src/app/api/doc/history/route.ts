import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { DocType } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const docType = searchParams.get("type");

    const docs = await prisma.generatedDoc.findMany({
      where: { 
        userId: session.user.id,
        ...(docType ? { docType: docType as DocType } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ docs });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Doc History API Error:", message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
