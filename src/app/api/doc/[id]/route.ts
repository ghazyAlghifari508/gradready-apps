import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vercel Best Practice: async-parallel - resolve independent promises concurrently
    const [headerList, resolvedParams] = await Promise.all([
      headers(),
      params
    ]);

    const session = await auth.api.getSession({
      headers: headerList,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { contentText } = await req.json();

    const doc = await prisma.generatedDoc.update({
      where: { id: resolvedParams.id, userId: session.user.id },
      data: { contentText },
    });

    return NextResponse.json({ success: true, doc });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Doc Update API Error:", message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vercel Best Practice: async-parallel - resolve independent promises concurrently
    const [headerList, resolvedParams] = await Promise.all([
      headers(),
      params
    ]);

    const session = await auth.api.getSession({
      headers: headerList,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const doc = await prisma.generatedDoc.findUnique({
      where: { id: resolvedParams.id, userId: session.user.id },
    });

    if (!doc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ doc });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Doc GET API Error:", message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
