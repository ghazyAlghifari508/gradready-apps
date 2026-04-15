import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { checkAndAwardBadges } from "@/lib/badges";
import { FileText, BarChart2, Map, Bot, TrendingUp, Target } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const userId = session.user.id;
  const userName = session.user.name?.split(" ")[0] ?? "Pengguna";

  // Check and award badges passively
  await checkAndAwardBadges(userId);

  // Fetch CV Record
  const latestCv = await prisma.cvRecord.findFirst({
    where: { userId, isLatest: true },
    orderBy: { createdAt: "desc" },
  });

  // Fetch Skill Gap (for readiness %)
  const skillGap = await prisma.skillGap.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { jobRole: true },
  });

  // Fetch Roadmap Progress
  const roadmapProgressCount = await prisma.roadmapProgress.count({
    where: { userId, isCompleted: true },
  });
  
  // Total roadmap items could be derived from JobRole skills -> LearningResources
  // For simplicity, we just count all resources tied to the User's Target Job Role skills
  const totalRoadmapItems = skillGap ? await prisma.learningResource.count({
    where: {
      skill: {
        jobRoleSkills: {
          some: { jobRoleId: skillGap.jobRoleId }
        }
      }
    }
  }) : 0;

  // Fetch Docs
  const latestDocs = await prisma.generatedDoc.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  const features = [
    {
      icon: <FileText size={32} color="var(--green)" />,
      title: "CV Analyzer",
      desc: "Upload CV dan dapatkan AI score + feedback",
      href: "/cv-analyzer",
      badge: "START",
      color: "var(--green)",
    },
    {
      icon: <BarChart2 size={32} color="var(--blue)" />,
      title: "Skill Gap",
      desc: "Lihat gap antara skillmu dan target job",
      href: "/skill-gap",
      badge: "NEXT",
      color: "var(--blue)",
    },
    {
      icon: <Map size={32} color="var(--orange)" />,
      title: "Roadmap Belajar",
      desc: "Timeline personalisasi untuk capai target",
      href: "/roadmap",
      badge: "PLAN",
      color: "var(--orange)",
    },
    {
      icon: <Bot size={32} color="var(--golden)" />,
      title: "AI Doc Builder",
      desc: "Generate surat lamaran, LinkedIn, dll",
      href: "/doc-builder",
      badge: "AI",
      color: "var(--golden)",
    },
    {
      icon: <TrendingUp size={32} color="var(--green)" />,
      title: "My History",
      desc: "Lacak perkembangan skor CV dan dokumen",
      href: "/history",
      badge: "NEW",
      color: "var(--green)",
    },
    {
      icon: <Target size={32} color="var(--blue)" />,
      title: "My Profile",
      desc: "Atur target karir dan lihat badge readiness",
      href: "/profile",
      badge: "NEW",
      color: "var(--blue)",
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px" }}>
      {/* ── Welcome Header ── */}
      <div
        style={{
          marginBottom: 32,
          padding: "28px 32px",
          background:
            "linear-gradient(135deg, var(--dark-blue) 0%, #1a1855 100%)",
          borderRadius: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap"
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'Fredoka One', cursive",
              fontSize: 28,
              color: "var(--green)",
              marginBottom: 6,
            }}
          >
            Halo, {userName}!
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.6)",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {skillGap?.jobRole 
              ? `Target Karir: ${skillGap.jobRole.name}` 
              : "Selamat datang di GradReady. Mulai perjalanan karirmu hari ini."}
          </p>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          {/* CV Score Gauge */}
          <div
            style={{
              flexShrink: 0,
              textAlign: "center",
              padding: "16px 24px",
              backgroundColor: "rgba(255,255,255,0.06)",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div
              style={{
                fontFamily: "'Fredoka One', cursive",
                fontSize: 36,
                color: latestCv?.score ? "var(--green)" : "var(--gray)",
                lineHeight: 1,
                marginBottom: 4,
              }}
            >
              {latestCv?.score ? latestCv.score : "—"}
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "rgba(255,255,255,0.35)",
              }}
            >
              SKOR CV TERAKHIR
            </div>
          </div>

          {/* Readiness Score */}
          <div
            style={{
              flexShrink: 0,
              textAlign: "center",
              padding: "16px 24px",
              backgroundColor: "rgba(255,255,255,0.06)",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div
              style={{
                fontFamily: "'Fredoka One', cursive",
                fontSize: 36,
                color: "var(--blue)",
                lineHeight: 1,
                marginBottom: 4,
              }}
            >
              {skillGap ? `${skillGap.readinessPct.toFixed(0)}%` : "—"}
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "rgba(255,255,255,0.35)",
              }}
            >
              READINESS CAPAIAN
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 32, marginBottom: 32, flexDirection: "row", flexWrap: "wrap" }}>
        
        {/* Roadmap Progress */}
        <div style={{ flex: 1, minWidth: 300 }}>
          <Card>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--dark-blue)", marginBottom: 12 }}>
              Progress Roadmap Belajar
            </h3>
            {totalRoadmapItems > 0 ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: "var(--gray-text)" }}>Modul selesai</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "var(--green)" }}>{roadmapProgressCount} / {totalRoadmapItems}</span>
                </div>
                <ProgressBar value={(roadmapProgressCount / totalRoadmapItems) * 100} variant="default" />
              </>
            ) : (
             <div style={{ fontSize: 13, color: "var(--gray-light)" }}>Belum ada roadmap yang dibuat. Cek Skill Gap kamu terlebih dahulu.</div>
            )}
          </Card>
        </div>

        {/* Latest Documents Generate */}
        <div style={{ flex: 1, minWidth: 300 }}>
           <Card>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--dark-blue)", marginBottom: 12 }}>
              Dokumen Terakhir
            </h3>
            {latestDocs.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {latestDocs.map((doc: any) => (
                  <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: "8px 12px", border: "1px solid var(--gray-border)", borderRadius: 8 }}>
                     <span style={{ fontSize: 13, fontWeight: 700, color: "var(--gray-text)" }}>{doc.docType}</span>
                     <span style={{ fontSize: 12, color: "var(--gray-light)" }}>{new Date(doc.createdAt).toLocaleDateString("id-ID")}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 13, color: "var(--gray-light)" }}>Belum ada dokumen yang digenerate AI. Pilih menu AI Doc Builder untuk mulai.</div>
            )}
          </Card>
        </div>
      </div>

      {/* ── Feature Grid ── */}
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--dark-blue)", marginBottom: 16 }}>Menu Pilihan</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {features.map((f) => (
          <a
            key={f.href}
            href={f.href}
            style={{ textDecoration: "none" }}
          >
            <Card>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ flexShrink: 0 }}>{f.icon}</span>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 800,
                        color: "var(--gray-text)",
                      }}
                    >
                      {f.title}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        color: f.color,
                        backgroundColor: `${f.color}15`,
                        padding: "2px 8px",
                        borderRadius: 10,
                      }}
                    >
                      {f.badge}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 13,
                      color: "var(--gray-light)",
                      lineHeight: 1.4,
                    }}
                  >
                    {f.desc}
                  </span>
                </div>
              </div>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
