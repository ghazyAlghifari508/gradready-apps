import { prisma } from "./prisma";

export async function checkAndAwardBadges(userId: string) {
  // Fetch latest skill gap for the user to determine readinessPct
  const latestSkillGap = await prisma.skillGap.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { jobRole: true },
  });

  if (!latestSkillGap) return;

  const pct = latestSkillGap.readinessPct;
  const jobRoleId = latestSkillGap.jobRoleId;

  // Retrieve user's existing badges for this job role
  const existingBadges = await prisma.readinessBadge.findMany({
    where: { userId, jobRoleId },
  });
  const existingTypes = existingBadges.map((b) => b.badgeType);

  const awards: { badgeType: "READY_75" | "READY_90" | "FULLY_READY" }[] = [];

  if (pct >= 75 && !existingTypes.includes("READY_75")) {
    awards.push({ badgeType: "READY_75" });
  }
  if (pct >= 90 && !existingTypes.includes("READY_90")) {
    awards.push({ badgeType: "READY_90" });
  }
  if (pct >= 100 && !existingTypes.includes("FULLY_READY")) {
    awards.push({ badgeType: "FULLY_READY" });
  }

  // Create new badges if qualified
  for (const award of awards) {
    await prisma.readinessBadge.create({
      data: {
        userId,
        jobRoleId,
        badgeType: award.badgeType,
      },
    });
  }
}
