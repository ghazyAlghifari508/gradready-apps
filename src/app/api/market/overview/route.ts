import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [topSkillsAggregation, jobRoles, skillsByCategoryRaw, demandCounts] = await Promise.all([
      prisma.jobRoleSkill.groupBy({
        by: ["skillId"],
        _count: { skillId: true },
        orderBy: { _count: { skillId: "desc" } },
        take: 10,
      }),
      prisma.jobRole.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true, demandLevel: true, avgSalaryMin: true, avgSalaryMax: true },
      }),
      prisma.skill.groupBy({
        by: ["category"],
        _count: { category: true },
        orderBy: { _count: { category: "desc" } },
      }),
      prisma.jobRole.groupBy({
        by: ["demandLevel"],
        _count: { demandLevel: true },
      }),
    ]);

    const topSkillIds = topSkillsAggregation.map((a) => a.skillId);
    const skills = await prisma.skill.findMany({ where: { id: { in: topSkillIds } } });

    const topSkills = topSkillsAggregation.map((agg) => {
      const skill = skills.find((s) => s.id === agg.skillId);
      return {
        id: agg.skillId,
        name: skill?.name ?? "Unknown",
        category: skill?.category ?? "Unknown",
        demandScore: agg._count.skillId * 10,
      };
    });

    const enrichedRoles = jobRoles.map((role) => {
      let min = role.avgSalaryMin;
      let max = role.avgSalaryMax;

      if (min === null || max === null) {
        const base = role.name.includes("Backend")
          ? 8000000
          : role.name.includes("Frontend")
            ? 7500000
            : role.name.includes("Mobile")
              ? 8500000
              : role.name.includes("Data")
                ? 9000000
                : 6000000;
        min = Math.floor(base * 0.9);
        max = Math.floor(base * 1.5);
      }

      return { ...role, avgSalaryMin: Number(min), avgSalaryMax: Number(max) };
    });

    const skillsByCategory = skillsByCategoryRaw.map((r) => ({
      category: r.category,
      count: r._count.category,
    }));

    const rolesByDemand = demandCounts.map((r) => ({
      level: r.demandLevel as "HIGH" | "MEDIUM" | "LOW",
      count: r._count.demandLevel,
    }));

    return NextResponse.json({ topSkills, jobRoles: enrichedRoles, skillsByCategory, rolesByDemand });
  } catch (error) {
    console.error("Market Overview API Error:", error);
    return NextResponse.json({ error: "Failed to fetch market overview" }, { status: 500 });
  }
}
