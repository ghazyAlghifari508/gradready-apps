import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { apiError, handleApiError } from "@/lib/errors";
import { profileUpdateSchema } from "@/lib/validation/schemas";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const validation = profileUpdateSchema.safeParse(
      await req.json().catch(() => undefined),
    );
    if (!validation.success) {
      return apiError(400, "INVALID_PAYLOAD", validation.error.issues);
    }

    const {
      name,
      university,
      graduationYear,
      bio,
      linkedinUrl,
      githubUrl,
      phone,
      targetJobId,
    } = validation.data;

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

    if (name && name !== session.user.name) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { name },
      });
    }

    const profile = await prisma.userProfile.upsert({
      where: { userId: session.user.id },
      update: {
        university: university ?? null,
        graduationYear: graduationYear ?? null,
        bio: bio ?? null,
        linkedinUrl: linkedinUrl ?? null,
        githubUrl: githubUrl ?? null,
        phone: phone ?? null,
        targetJobId: targetJobId ?? null,
      },
      create: {
        userId: session.user.id,
        university: university ?? null,
        graduationYear: graduationYear ?? null,
        bio: bio ?? null,
        linkedinUrl: linkedinUrl ?? null,
        githubUrl: githubUrl ?? null,
        phone: phone ?? null,
        targetJobId: targetJobId ?? null,
      },
    });

    const currentGap = await prisma.skillGap.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    if (currentGap && targetJobId && currentGap.jobRoleId !== targetJobId) {
      await prisma.skillGap.delete({ where: { id: currentGap.id } });
    }

    return NextResponse.json({ success: true, profile });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
