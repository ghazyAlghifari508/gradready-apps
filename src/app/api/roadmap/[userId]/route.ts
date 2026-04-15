import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";


export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (await params).userId;
    if (session.user.id !== userId && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get User's Skill Progress
    const skillProgress = await prisma.userSkillProgress.findMany({
      where: { userId },
      include: {
        skill: {
          include: {
            learningResources: true
          }
        }
      }
    });

    // Get User's Roadmap Progress (Completion status for resources)
    const roadmapProgress = await prisma.roadmapProgress.findMany({
      where: { userId }
    });
    
    // Create a set/map for completed resource IDs to quickly check
    const completedResourceIds = new Set(
      roadmapProgress.filter(rp => rp.isCompleted).map(rp => rp.resourceId)
    );

    // Format response
    const roadmap = skillProgress.map(progress => {
      const resources = progress.skill.learningResources.map(resource => ({
        id: resource.id,
        title: resource.title,
        url: resource.url,
        platform: resource.platform,
        durationWeeks: resource.durationWeeks,
        isFree: resource.isFree,
        isCompleted: completedResourceIds.has(resource.id)
      }));

      return {
        skillId: progress.skill.id,
        skillName: progress.skill.name,
        skillCategory: progress.skill.category,
        status: progress.status,
        resources
      };
    });

    // Sort: RED first, YELLOW second, GREEN last
    roadmap.sort((a, b) => {
      const order = { "RED": 1, "YELLOW": 2, "GREEN": 3 };
      return order[a.status] - order[b.status];
    });

    return NextResponse.json({ success: true, roadmap });
  } catch (error: any) {
    console.error("Roadmap Fetch Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
