import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { apiError, handleApiError } from "@/lib/errors";
import { onboardingSchema } from "@/lib/validation/schemas";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const validation = onboardingSchema.safeParse(
      await request.json().catch(() => undefined),
    );
    if (!validation.success) {
      return apiError(400, "INVALID_PAYLOAD", validation.error.issues);
    }

    const { targetJobId, university, graduationYear } = validation.data;

    if (targetJobId) {
      const targetJob = await prisma.jobRole.findUnique({
        where: { id: targetJobId },
        select: { id: true },
      });
      if (!targetJob) {
        return apiError(400, "INVALID_PAYLOAD", [
          { path: ["targetJobId"], message: "Target job does not exist" },
        ]);
      }
    }

    await prisma.userProfile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        targetJobId: targetJobId ?? null,
        university: university ?? null,
        graduationYear: graduationYear ?? null,
      },
      update: {
        targetJobId: targetJobId ?? null,
        university: university ?? null,
        graduationYear: graduationYear ?? null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
