import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProfileClientForm from "./ProfileClientForm";
import Card from "@/components/ui/Card";
import { checkAndAwardBadges } from "@/lib/badges";
import { Trophy, Award } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const userId = session.user.id;

  // Let's passively check badges again assuming reading profile might trigger
  await checkAndAwardBadges(userId);

  // Fetch full user data including profile
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true }
  });

  // Fetch badges
  const badges = await prisma.readinessBadge.findMany({
    where: { userId },
    include: { jobRole: true },
    orderBy: { earnedAt: "desc" }
  });

  // Fetch Job Roles for the dropdown
  const jobRoles = await prisma.jobRole.findMany({
    orderBy: { name: "asc" }
  });

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px" }}>
      {/* ── Welcome Header ── */}
      <h1
        style={{
          fontFamily: "'Fredoka One', cursive",
          fontSize: 32,
          color: "var(--dark-blue)",
          marginBottom: 16,
        }}
      >
        My Profile
      </h1>
      <p style={{ color: "var(--gray-text)", marginBottom: 32 }}>
        Atur informasi dasar, tautan profesional, dan pantau lencana pencapaianmu.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 32, alignItems: "start" }}>
         {/* Profile Form Content */}
         <Card>
            <ProfileClientForm 
              user={{
                name: user?.name || "",
                email: user?.email || "",
                ...user?.profile
              }} 
              jobRoles={jobRoles} 
            />
         </Card>

         {/* Badges Showcase Sidebar */}
         <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ background: "linear-gradient(135deg, var(--dark-blue) 0%, #1a1855 100%)", borderRadius: 16 }}>
              <Card className="bg-transparent border-0">
               <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--green)", marginBottom: 16 }}>
                 Lencana Saya
               </h3>
               {badges.length > 0 ? (
                 <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                   {badges.map(badge => {
                     // Determine golden/green styles based on badgeType
                     const isFullyReady = badge.badgeType === "FULLY_READY";
                     const bg = isFullyReady ? "linear-gradient(135deg, #fceabb 0%, #f8b500 100%)" : "rgba(88,204,2,0.15)";
                     const color = isFullyReady ? "#1a1855" : "var(--green)";
                     const title = badge.badgeType.replace("_", " ");
                     
                     return (
                       <div key={badge.id} style={{ 
                         padding: "16px",
                         background: bg,
                         border: isFullyReady ? "none" : "1px solid rgba(88,204,2,0.3)",
                         borderRadius: 16,
                         textAlign: "center"
                       }}>
                          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                            {isFullyReady ? <Trophy size={48} color="#1a1855" /> : <Award size={48} color="var(--green)" />}
                          </div>
                          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 16, color: color, marginBottom: 4 }}>
                            {title}
                          </div>
                          <div style={{ fontSize: 11, color: isFullyReady ? "rgba(26,24,85,0.7)" : "var(--gray-light)" }}>
                            {badge.jobRole.name}
                          </div>
                       </div>
                     )
                   })}
                 </div>
               ) : (
                 <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, textAlign: "center", padding: "20px 0" }}>
                   Belum ada lencana yang diraih. Kerjakan kuis & roadmap untuk meningkatkan skor Readiness!
                 </div>
               )}
             </Card>
            </div>
         </div>
      </div>
    </div>
  );
}
