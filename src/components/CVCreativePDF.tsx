// Non-ATS "creative" CV template — two-column layout with photo, colored
// sidebar, headline, languages & certifications. Visual richness over ATS
// parseability (the opposite trade-off from CVPDF.tsx). Same CVData shape;
// creative-only fields (photo, headline, languages, certifications) are used here.

import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import type { CVData } from "@/components/CVPDF";

const ACCENT = "#1CB0F6";
const DARK = "#1A1A2E";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    flexDirection: "row",
    color: "#222",
  },
  // ── Sidebar ──
  sidebar: {
    width: "34%",
    backgroundColor: DARK,
    color: "#fff",
    paddingTop: 32,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  photoWrap: {
    alignItems: "center",
    marginBottom: 20,
  },
  photo: {
    width: 96,
    height: 96,
    borderRadius: 48,
    objectFit: "cover",
    border: `3px solid ${ACCENT}`,
  },
  photoPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: ACCENT,
    alignItems: "center",
    justifyContent: "center",
  },
  photoInitial: {
    fontFamily: "Helvetica-Bold",
    fontSize: 36,
    color: "#fff",
  },
  sidebarHeading: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: ACCENT,
    marginTop: 18,
    marginBottom: 7,
  },
  sidebarText: {
    fontSize: 8.5,
    color: "#dfe3ea",
    lineHeight: 1.5,
    marginBottom: 3,
  },
  sidebarChip: {
    fontSize: 8.5,
    color: "#fff",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginBottom: 4,
  },
  // ── Main column ──
  main: {
    width: "66%",
    paddingTop: 32,
    paddingBottom: 32,
    paddingHorizontal: 26,
  },
  name: {
    fontFamily: "Helvetica-Bold",
    fontSize: 24,
    color: DARK,
    letterSpacing: 0.5,
  },
  headline: {
    fontSize: 11,
    color: ACCENT,
    fontFamily: "Helvetica-Bold",
    marginTop: 3,
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    color: DARK,
    marginTop: 14,
    marginBottom: 2,
  },
  sectionRule: {
    height: 2,
    width: 36,
    backgroundColor: ACCENT,
    marginBottom: 7,
  },
  bodyText: {
    fontSize: 9.5,
    color: "#444",
    lineHeight: 1.55,
  },
  entry: { marginBottom: 9 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  entryTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10.5,
    color: DARK,
    flex: 1,
    marginRight: 8,
  },
  entryDate: {
    fontSize: 9,
    color: ACCENT,
    fontFamily: "Helvetica-Bold",
    flexShrink: 0,
  },
  entrySub: {
    fontSize: 9.5,
    color: "#666",
    marginTop: 1,
    marginBottom: 2,
  },
  bullet: {
    fontSize: 9.5,
    color: "#444",
    lineHeight: 1.5,
    marginBottom: 1,
  },
});

function splitList(raw?: string) {
  if (!raw) return [];
  return raw
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function renderBullets(description: string) {
  return description
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line, i) => {
      const clean =
        line.startsWith("-") || line.startsWith("•") ? line.slice(1).trim() : line;
      return (
        <Text key={i} style={styles.bullet}>
          {"• "}
          {clean}
        </Text>
      );
    });
}

export function CVCreativePDF({ data }: { data: CVData }) {
  const { personalInfo, summary, education, experience, projects, skills } = data;
  const skillList = splitList(skills);
  const languageList = splitList(data.languages);
  const certList = splitList(data.certifications);
  const initial = (personalInfo.fullName || "?").trim().charAt(0).toUpperCase();

  const contactLines = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.linkedin,
    personalInfo.portfolio,
  ].filter(Boolean) as string[];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ── Sidebar ── */}
        <View style={styles.sidebar}>
          <View style={styles.photoWrap}>
            {personalInfo.photo ? (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={personalInfo.photo} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.photoInitial}>{initial}</Text>
              </View>
            )}
          </View>

          {contactLines.length > 0 && (
            <>
              <Text style={styles.sidebarHeading}>Kontak</Text>
              {contactLines.map((c, i) => (
                <Text key={i} style={styles.sidebarText}>
                  {c}
                </Text>
              ))}
            </>
          )}

          {skillList.length > 0 && (
            <>
              <Text style={styles.sidebarHeading}>Keahlian</Text>
              {skillList.map((s, i) => (
                <Text key={i} style={styles.sidebarChip}>
                  {s}
                </Text>
              ))}
            </>
          )}

          {languageList.length > 0 && (
            <>
              <Text style={styles.sidebarHeading}>Bahasa</Text>
              {languageList.map((l, i) => (
                <Text key={i} style={styles.sidebarText}>
                  {l}
                </Text>
              ))}
            </>
          )}

          {certList.length > 0 && (
            <>
              <Text style={styles.sidebarHeading}>Sertifikasi</Text>
              {certList.map((c, i) => (
                <Text key={i} style={styles.sidebarText}>
                  {c}
                </Text>
              ))}
            </>
          )}
        </View>

        {/* ── Main column ── */}
        <View style={styles.main}>
          <Text style={styles.name}>
            {personalInfo.fullName || "Nama Lengkap"}
          </Text>
          {personalInfo.headline ? (
            <Text style={styles.headline}>{personalInfo.headline}</Text>
          ) : (
            <View style={{ marginBottom: 10 }} />
          )}

          {summary.trim() ? (
            <>
              <Text style={styles.sectionTitle}>Tentang Saya</Text>
              <View style={styles.sectionRule} />
              <Text style={styles.bodyText}>{summary.trim()}</Text>
            </>
          ) : null}

          {experience.some((e) => e.company.trim()) ? (
            <>
              <Text style={styles.sectionTitle}>Pengalaman</Text>
              <View style={styles.sectionRule} />
              {experience.map((exp, i) =>
                exp.company.trim() ? (
                  <View key={i} style={styles.entry}>
                    <View style={styles.rowBetween}>
                      <Text style={styles.entryTitle}>
                        {exp.role || exp.company}
                      </Text>
                      {(exp.startDate || exp.endDate) && (
                        <Text style={styles.entryDate}>
                          {[exp.startDate, exp.endDate].filter(Boolean).join(" - ")}
                        </Text>
                      )}
                    </View>
                    <Text style={styles.entrySub}>{exp.company}</Text>
                    {exp.description.trim() ? renderBullets(exp.description) : null}
                  </View>
                ) : null,
              )}
            </>
          ) : null}

          {education.some((e) => e.institution.trim()) ? (
            <>
              <Text style={styles.sectionTitle}>Pendidikan</Text>
              <View style={styles.sectionRule} />
              {education.map((edu, i) =>
                edu.institution.trim() ? (
                  <View key={i} style={styles.entry}>
                    <View style={styles.rowBetween}>
                      <Text style={styles.entryTitle}>{edu.institution}</Text>
                      {(edu.startYear || edu.endYear) && (
                        <Text style={styles.entryDate}>
                          {[edu.startYear, edu.endYear].filter(Boolean).join(" - ")}
                        </Text>
                      )}
                    </View>
                    {edu.degree ? (
                      <Text style={styles.entrySub}>{edu.degree}</Text>
                    ) : null}
                    {edu.gpa ? (
                      <Text style={styles.entrySub}>IPK / GPA: {edu.gpa}</Text>
                    ) : null}
                  </View>
                ) : null,
              )}
            </>
          ) : null}

          {projects.some((p) => p.name.trim()) ? (
            <>
              <Text style={styles.sectionTitle}>Proyek</Text>
              <View style={styles.sectionRule} />
              {projects.map((proj, i) =>
                proj.name.trim() ? (
                  <View key={i} style={styles.entry}>
                    <View style={styles.rowBetween}>
                      <Text style={styles.entryTitle}>{proj.name}</Text>
                      {proj.link ? (
                        <Text style={styles.entryDate}>{proj.link}</Text>
                      ) : null}
                    </View>
                    {proj.description.trim() ? (
                      <Text style={styles.bodyText}>{proj.description.trim()}</Text>
                    ) : null}
                  </View>
                ) : null,
              )}
            </>
          ) : null}
        </View>
      </Page>
    </Document>
  );
}
