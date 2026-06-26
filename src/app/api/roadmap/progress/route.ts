import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { apiError, handleApiError } from "@/lib/errors";
import { roadmapProgressSchema } from "@/lib/validation/schemas";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const validation = roadmapProgressSchema.safeParse(
      await req.json().catch(() => undefined),
    );

    if (!validation.success) {
      return apiError(400, "INVALID_PAYLOAD", validation.error.issues);
    }

    const { resourceId, isCompleted } = validation.data;

    const allowedResource = await prisma.learningResource.findFirst({
      where: {
        id: resourceId,
        skill: {
          userProgress: {
            some: { userId: session.user.id },
          },
        },
      },
      select: { id: true },
    });

    if (!allowedResource) {
      return apiError(403, "FORBIDDEN", "Forbidden");
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
    return handleApiError(error);
  }
}
