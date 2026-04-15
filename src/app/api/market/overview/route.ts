import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Top Skills Aggregation
    // In actual app, we would group by skillId and count.
    // Prisma grouping:
    const topSkillsAggregation = await prisma.jobRoleSkill.groupBy({
      by: ["skillId"],
      _count: {
        skillId: true,
      },
      orderBy: {
        _count: {
          skillId: "desc",
        },
      },
      take: 10,
    });

    const topSkillIds = topSkillsAggregation.map((a) => a.skillId);
    
    const skills = await prisma.skill.findMany({
      where: {
        id: { in: topSkillIds }
      }
    });

    // Merge count into skills
    const topSkills = topSkillsAggregation.map((agg) => {
      const skill = skills.find((s) => s.id === agg.skillId);
      return {
        id: agg.skillId,
        name: skill?.name ?? "Unknown",
        category: skill?.category ?? "Unknown",
        demandScore: agg._count.skillId * 10, // Simulated score
      };
    });

    // Job Roles Data for Salary/Trend
    const jobRoles = await prisma.jobRole.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        demandLevel: true,
        avgSalaryMin: true,
        avgSalaryMax: true,
      }
    });

    // Because original schema has avgSalaryMin / max missing or nullable, we might need to mock them if missing.
    // Let's ensure they have realistic values if null.
    const enrichedRoles = jobRoles.map((role) => {
      let min = role.avgSalaryMin;
      let max = role.avgSalaryMax;
      
      if (min === null || max === null) {
        // Mock salaries based on role name heuristically
        const base = role.name.includes("Backend") ? 8000000 : 
                     role.name.includes("Frontend") ? 7500000 : 
                     role.name.includes("Mobile") ? 8500000 :
                     role.name.includes("Data") ? 9000000 : 6000000;
        
        min = Math.floor(base * 0.9);
        max = Math.floor(base * 1.5);
      }

      return {
        ...role,
        avgSalaryMin: Number(min),
        avgSalaryMax: Number(max),
      };
    });

    return NextResponse.json({
      topSkills,
      jobRoles: enrichedRoles,
    });
  } catch (error) {
    console.error("Market Overview API Error:", error);
    return NextResponse.json({ error: "Failed to fetch market overview" }, { status: 500 });
  }
}
