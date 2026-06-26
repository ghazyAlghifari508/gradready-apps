"use client";

import { useState } from "react";
import styles from "./roadmap.module.css";
import Link from "next/link";
import { Check } from "lucide-react";

interface LearningResource {
  id: string;
  title: string;
  url: string;
  platform: string;
  durationWeeks: number | null;
  isFree: boolean;
  isCompleted: boolean;
}

interface RoadmapSkill {
  skillId: string;
  skillName: string;
  skillCategory: string;
  status: "RED" | "YELLOW" | "GREEN";
  resources: LearningResource[];
}

interface Props {
  initialRoadmap: RoadmapSkill[];
}

export default function RoadmapClient({ initialRoadmap }: Props) {
  const [roadmap, setRoadmap] = useState<RoadmapSkill[]>(initialRoadmap);

  const toggleResource = async (resourceId: string, currentCompleted: boolean) => {
    setRoadmap((prev) =>
      prev.map((skill) => ({
        ...skill,
        resources: skill.resources.map((res) =>
          res.id === resourceId ? { ...res, isCompleted: !currentCompleted } : res,
        ),
      })),
    );

    try {
      await fetch("/api/roadmap/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId, isCompleted: !currentCompleted }),
      });
    } catch (err) {
      console.error("Failed to update progress", err);
      setRoadmap(initialRoadmap);
    }
  };

  let totalResources = 0;
  let completedResources = 0;
  roadmap.forEach((skill) => {
    if (skill.status !== "GREEN") {
      totalResources += skill.resources.length;
      completedResources += skill.resources.filter((r) => r.isCompleted).length;
    }
  });

  const progressPct =
    totalResources > 0 ? Math.round((completedResources / totalResources) * 100) : 100;

  const redSkills = roadmap.filter((s) => s.status === "RED");
  const yellowSkills = roadmap.filter((s) => s.status === "YELLOW");

  const renderSkillGroup = (title: string, skills: RoadmapSkill[], badgeClass: string) => {
    if (skills.length === 0) return null;
    return (
      <div className={styles.skillSection}>
        <h2 className={styles.sectionTitle}>
          {title}
          <span className={`${styles.sectionBadge} ${badgeClass}`}>{skills.length} Topik</span>
        </h2>
        <div className={styles.skillList}>
          {skills.map((skill) => (
            <div key={skill.skillId} className={styles.skillCard}>
              <div className={styles.skillCardHeader}>
                <h3 className={styles.skillCardTitle}>{skill.skillName}</h3>
                <span className={styles.skillCategory}>{skill.skillCategory}</span>
              </div>
              <div className={styles.resourceList}>
                {skill.resources.length > 0 ? (
                  skill.resources.map((res) => (
                    <div
                      key={res.id}
                      className={`${styles.resourceItem} ${res.isCompleted ? styles.completed : ""}`}
                    >
                      <div className={styles.resourceInfo}>
                        <div
                          className={`${styles.resourceCheck} ${res.isCompleted ? styles.checked : ""}`}
                          onClick={() => toggleResource(res.id, res.isCompleted)}
                        >
                          {res.isCompleted ? <Check size={12} strokeWidth={4} color="white" /> : ""}
                        </div>
                        <div>
                          <span className={styles.resourceTitle}>{res.title}</span>
                          <div className={styles.resourceMeta}>
                            <span className={styles.resourceBadge}>{res.platform}</span>
                            <span>• {res.durationWeeks} Minggu</span>
                            {res.isFree && (
                              <span style={{ color: "var(--green, #10b981)", fontWeight: 600 }}>
                                Gratis
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Link
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.resourceAction}
                      >
                        Pelajari
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptySkillState}>
                    Belum ada rekomendasi resource teknis untuk topik ini.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>Learning Roadmap</h1>
            <p className={styles.subtitle}>Lacak progress Anda menuju target karir.</p>
          </div>
          <div className={styles.overallProgress}>
            <span className={styles.progressLabel}>Total Progres ({progressPct}%)</span>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </div>
      </header>

      {renderSkillGroup("Prioritas Utama (Red)", redSkills, styles.badgeRED)}
      {renderSkillGroup("Penyesuaian Menengah (Yellow)", yellowSkills, styles.badgeYELLOW)}
    </div>
  );
}
