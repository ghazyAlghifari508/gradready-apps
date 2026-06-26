import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth, isAdmin } from "@/lib/auth";
import { headers } from "next/headers";
import { handleApiError } from "@/lib/errors";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (await params).userId;
    if (session.user.id !== userId && !isAdmin(session)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const skillProgress = await prisma.userSkillProgress.findMany({
      where: { userId },
      include: {
        skill: {
          include: {
            learningResources: true,
          },
        },
      },
    });

    const roadmapProgress = await prisma.roadmapProgress.findMany({
      where: { userId },
    });

    const completedResourceIds = new Set(
      roadmapProgress
        .filter((rp: (typeof roadmapProgress)[0]) => rp.isCompleted)
        .map((rp: (typeof roadmapProgress)[0]) => rp.resourceId),
    );

    const roadmap = skillProgress.map((progress: (typeof skillProgress)[0]) => {
      const resources = progress.skill.learningResources.map(
        (resource: (typeof progress.skill.learningResources)[0]) => ({
          id: resource.id,
          title: resource.title,
          url: resource.url,
          platform: resource.platform,
          durationWeeks: resource.durationWeeks,
          isFree: resource.isFree,
          isCompleted: completedResourceIds.has(resource.id),
        }),
      );

      return {
        skillId: progress.skill.id,
        skillName: progress.skill.name,
        skillCategory: progress.skill.category,
        status: progress.status,
        resources,
      };
    });

    roadmap.sort((a, b) => {
      const order: Record<string, number> = { RED: 1, YELLOW: 2, GREEN: 3 };
      return order[a.status] - order[b.status];
    });

    return NextResponse.json({ success: true, roadmap });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
