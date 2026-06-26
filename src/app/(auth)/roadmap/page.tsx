import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import styles from "./roadmap.module.css";
import RoadmapClient from "./RoadmapClient";

export default async function RoadmapPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const userId = session.user.id;

  const [skillProgress, roadmapProgress] = await Promise.all([
    prisma.userSkillProgress.findMany({
      where: { userId },
      include: { skill: { include: { learningResources: true } } },
    }),
    prisma.roadmapProgress.findMany({ where: { userId } }),
  ]);

  if (skillProgress.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.loader}>
          Belum ada roadmap. Coba lakukan analisis Skill Gap terlebih dahulu.
        </div>
      </div>
    );
  }

  const completedIds = new Set(
    roadmapProgress.filter((rp) => rp.isCompleted).map((rp) => rp.resourceId),
  );

  const roadmap = skillProgress
    .map((progress) => ({
      skillId: progress.skill.id,
      skillName: progress.skill.name,
      skillCategory: progress.skill.category,
      status: progress.status as "RED" | "YELLOW" | "GREEN",
      resources: progress.skill.learningResources.map((r) => ({
        id: r.id,
        title: r.title,
        url: r.url,
        platform: r.platform,
        durationWeeks: r.durationWeeks,
        isFree: r.isFree,
        isCompleted: completedIds.has(r.id),
      })),
    }))
    .sort((a, b) => {
      const order: Record<string, number> = { RED: 1, YELLOW: 2, GREEN: 3 };
      return order[a.status] - order[b.status];
    });

  return <RoadmapClient initialRoadmap={roadmap} />;
}
