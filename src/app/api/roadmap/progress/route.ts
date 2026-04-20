import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { resourceId, isCompleted } = await req.json();

    if (!resourceId || typeof isCompleted !== "boolean") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const progress = await prisma.roadmapProgress.upsert({
      where: {
        userId_resourceId: {
          userId,
          resourceId
        }
      },
      create: {
        userId,
        resourceId,
        isCompleted,
        completedAt: isCompleted ? new Date() : null
      },
      update: {
        isCompleted,
        completedAt: isCompleted ? new Date() : null
      }
    });

    return NextResponse.json({ success: true, progress });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Roadmap Progress Update Error:", message);
    return NextResponse.json(
      { error: "Internal Server Error", details: message },
      { status: 500 }
    );
  }
}
