import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

function stringSimilarity(s1: string, s2: string): number {
  const v1 = s1.toLowerCase();
  const v2 = s2.toLowerCase();
  if (v1 === v2) return 1;
  if (v1.includes(v2) || v2.includes(v1)) return 0.8;
  
  // simple intersection for partial matches (e.g. "React.js" vs "React")
  const tokens1 = v1.split(/[\s,.-]+/);
  const tokens2 = v2.split(/[\s,.-]+/);
  const intersection = tokens1.filter(t => tokens2.includes(t));
  if (intersection.length > 0) {
    return intersection.length / Math.max(tokens1.length, tokens2.length);
  }
  return 0;
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { cvRecordId } = await req.json().catch(() => ({}));

    const userProfile = await prisma.userProfile.findUnique({
      where: { userId },
      include: { targetJob: { include: { skills: { include: { skill: true } } } } },
    });

    if (!userProfile?.targetJob) {
      return NextResponse.json(
        { error: "Target job role not set in profile" },
        { status: 400 }
      );
    }

    const targetJob = userProfile.targetJob;

    // Get CV Record
    let cvRecord;
    if (cvRecordId) {
      cvRecord = await prisma.cvRecord.findUnique({
        where: { id: cvRecordId, userId },
      });
    } else {
      cvRecord = await prisma.cvRecord.findFirst({
        where: { userId, isLatest: true },
        orderBy: { createdAt: 'desc' }
      });
    }

    if (!cvRecord || !cvRecord.parsedSkills) {
      return NextResponse.json(
        { error: "Valid CV record with parsed skills not found" },
        { status: 404 }
      );
    }

    const parsedSkills = cvRecord.parsedSkills as string[];
    
    const gapDetails: Array<{ skillId: string, skillName: string, status: "GREEN" | "YELLOW" | "RED", priority: string }> = [];
    
    let totalScore = 0;
    let maxScore = 0;

    for (const jrSkill of targetJob.skills) {
      const requiredName = jrSkill.skill.name;
      const priority = jrSkill.priorityLevel;
      
      let bestMatchScore = 0;
      for (const parsed of parsedSkills) {
        const score = stringSimilarity(requiredName, parsed);
        if (score > bestMatchScore) bestMatchScore = score;
      }
      
      let status: "GREEN" | "YELLOW" | "RED" = "RED";
      let weight = priority === "HIGH" ? 3 : priority === "MED" ? 2 : 1;
      maxScore += weight * 100;

      if (bestMatchScore >= 0.8) {
        status = "GREEN";
        totalScore += weight * 100;
      } else if (bestMatchScore >= 0.4) {
        status = "YELLOW";
        totalScore += weight * 50;
      }
      
      gapDetails.push({
        skillId: jrSkill.skill.id,
        skillName: requiredName,
        status,
        priority
      });
      
      // Upsert UserSkillProgress
      await prisma.userSkillProgress.upsert({
        where: { userId_skillId: { userId, skillId: jrSkill.skill.id } },
        create: {
          userId,
          skillId: jrSkill.skill.id,
          status,
        },
        update: {
          status, // update flag to reflect actual state today
        }
      });
    }

    const readinessPct = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

    const skillGap = await prisma.skillGap.create({
      data: {
        userId,
        cvRecordId: cvRecord.id,
        jobRoleId: targetJob.id,
        gapDetailJson: gapDetails,
        readinessPct,
      }
    });

    return NextResponse.json({ success: true, skillGap });

  } catch (error: any) {
    console.error("Skill Gap Analysis Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
