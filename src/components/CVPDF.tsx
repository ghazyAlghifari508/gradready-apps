import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Register fonts — Helvetica is built-in, we use Bold/BoldOblique variants
// @react-pdf/renderer ships Helvetica family by default

const COLORS = {
  black: "#1a1a1a",
  darkGray: "#333333",
  midGray: "#555555",
  lightGray: "#888888",
  divider: "#cccccc",
  white: "#ffffff",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 52,
    fontFamily: "Helvetica",
    backgroundColor: COLORS.white,
    color: COLORS.black,
  },

  // ── Header ──────────────────────────────────────────────────────────────
  headerContainer: {
    marginBottom: 16,
    alignItems: "center",
  },
  headerPhoto: {
    width: 72,
    height: 72,
    borderRadius: 36,
    objectFit: "cover",
    marginBottom: 8,
  },
  headerName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 22,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: COLORS.black,
    marginBottom: 4,
  },
  headerDividerLine: {
    height: 1.5,
    backgroundColor: COLORS.black,
    width: "100%",
    marginBottom: 5,
  },
  headerContact: {
    fontSize: 9.5,
    color: COLORS.darkGray,
    textAlign: "center",
  },

  // ── Section ─────────────────────────────────────────────────────────────
  section: {
    marginTop: 12,
    marginBottom: 2,
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10.5,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: COLORS.black,
    marginBottom: 4,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: COLORS.black,
    marginBottom: 7,
  },

  // ── Summary ─────────────────────────────────────────────────────────────
  summaryText: {
    fontSize: 9.5,
    color: COLORS.darkGray,
    lineHeight: 1.55,
  },

  // ── Education ───────────────────────────────────────────────────────────
  rowSpaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  institutionName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: COLORS.black,
    flex: 1,
    marginRight: 8,
  },
  dateText: {
    fontSize: 9.5,
    color: COLORS.midGray,
    textAlign: "right",
    flexShrink: 0,
  },
  degreeText: {
    fontSize: 9.5,
    color: COLORS.midGray,
    marginTop: 2,
  },
  gpaText: {
    fontSize: 9.5,
    color: COLORS.midGray,
    marginTop: 1,
  },

  // ── Experience ──────────────────────────────────────────────────────────
  expBlock: {
    marginBottom: 10,
  },
  companyName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10.5,
    color: COLORS.black,
    marginBottom: 3,
  },
  roleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 3,
  },
  roleName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    color: COLORS.darkGray,
    flex: 1,
    marginRight: 8,
  },
  bulletPoint: {
    fontSize: 9.5,
    color: COLORS.darkGray,
    lineHeight: 1.5,
    marginBottom: 2,
    paddingLeft: 2,
  },

  // ── Projects ────────────────────────────────────────────────────────────
  projectBlock: {
    marginBottom: 8,
  },
  projectRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  projectName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: COLORS.black,
    flex: 1,
    marginRight: 8,
  },
  projectLink: {
    fontSize: 9,
    color: COLORS.midGray,
    textAlign: "right",
    flexShrink: 0,
  },
  projectDesc: {
    fontSize: 9.5,
    color: COLORS.darkGray,
    lineHeight: 1.5,
    marginTop: 2,
  },

  // ── Skills ───────────────────────────────────────────────────────────────
  skillsText: {
    fontSize: 9.5,
    color: COLORS.darkGray,
    lineHeight: 1.55,
  },
});

// ─── Types ───────────────────────────────────────────────────────────────────

export type CVMode = "ats" | "creative";

export interface CVData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    linkedin?: string;
    portfolio?: string;
    // Creative-only (non-ATS) fields — ignored by the ATS template.
    headline?: string;
    photo?: string;
    location?: string;
  };
  summary: string;
  // Creative-only sections (comma/newline separated). Optional so ATS data stays valid.
  languages?: string;
  certifications?: string;
  education: Array<{
    institution: string;
    degree: string;
    startYear: string;
    endYear: string;
    gpa: string;
  }>;
  experience: Array<{
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    link?: string;
  }>;
  skills: string;
}

// ─── Helper: Bullet Renderer ─────────────────────────────────────────────────

function renderBullets(description: string) {
  if (!description.trim()) return null;
  const lines = description
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return lines.map((line, i) => {
    const cleanLine = line.startsWith("-") || line.startsWith("•") ? line.slice(1).trim() : line;
    return (
      <Text key={i} style={styles.bulletPoint}>
        {"• "}{cleanLine}
      </Text>
    );
  });
}

// ─── Section Wrapper ─────────────────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionDivider} />
      {children}
    </View>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function CVPDF({ data }: { data: CVData }) {
  const { personalInfo, summary, education, experience, projects, skills } =
    data;

  // Build contact line
  const contactParts = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.linkedin,
    personalInfo.portfolio,
  ].filter(Boolean);
  const contactLine = contactParts.join(" | ");

  // Skills: split by comma
  const skillList = skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .join("  •  ");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ── Header ── */}
        <View style={styles.headerContainer}>
          {personalInfo.photo ? (
            <Image src={personalInfo.photo} style={styles.headerPhoto} />
          ) : null}
          <Text style={styles.headerName}>{personalInfo.fullName || "Your Name"}</Text>
          <View style={styles.headerDividerLine} />
          {contactLine ? (
            <Text style={styles.headerContact}>{contactLine}</Text>
          ) : null}
        </View>

        {/* ── Summary ── */}
        {summary.trim() ? (
          <Section title="Tentang Saya">
            <Text style={styles.summaryText}>{summary.trim()}</Text>
          </Section>
        ) : null}

        {/* ── Education ── */}
        {education.some((e) => e.institution.trim()) ? (
          <Section title="Pendidikan">
            {education.map((edu, i) =>
              edu.institution.trim() ? (
                <View key={i} style={{ marginBottom: 7 }}>
                  <View style={styles.rowSpaceBetween}>
                    <Text style={styles.institutionName}>{edu.institution}</Text>
                    {(edu.startYear || edu.endYear) ? (
                      <Text style={styles.dateText}>
                        {[edu.startYear, edu.endYear].filter(Boolean).join(" - ")}
                      </Text>
                    ) : null}
                  </View>
                  {edu.degree ? (
                    <Text style={styles.degreeText}>{edu.degree}</Text>
                  ) : null}
                  {edu.gpa ? (
                    <Text style={styles.gpaText}>IPK / GPA: {edu.gpa}</Text>
                  ) : null}
                </View>
              ) : null
            )}
          </Section>
        ) : null}

        {/* ── Experience ── */}
        {experience.some((e) => e.company.trim()) ? (
          <Section title="Pengalaman">
            {experience.map((exp, i) =>
              exp.company.trim() ? (
                <View key={i} style={styles.expBlock}>
                  <Text style={styles.companyName}>{exp.company}</Text>
                  <View style={styles.roleRow}>
                    <Text style={styles.roleName}>{exp.role}</Text>
                    {(exp.startDate || exp.endDate) ? (
                      <Text style={styles.dateText}>
                        {[exp.startDate, exp.endDate].filter(Boolean).join(" - ")}
                      </Text>
                    ) : null}
                  </View>
                  {exp.description.trim() ? renderBullets(exp.description) : null}
                </View>
              ) : null
            )}
          </Section>
        ) : null}

        {/* ── Projects ── */}
        {projects.some((p) => p.name.trim()) ? (
          <Section title="Proyek">
            {projects.map((proj, i) =>
              proj.name.trim() ? (
                <View key={i} style={styles.projectBlock}>
                  <View style={styles.projectRow}>
                    <Text style={styles.projectName}>{proj.name}</Text>
                    {proj.link ? (
                      <Text style={styles.projectLink}>{proj.link}</Text>
                    ) : null}
                  </View>
                  {proj.description.trim() ? (
                    <Text style={styles.projectDesc}>{proj.description.trim()}</Text>
                  ) : null}
                </View>
              ) : null
            )}
          </Section>
        ) : null}

        {/* ── Skills ── */}
        {skillList ? (
          <Section title="Keahlian">
            <Text style={styles.skillsText}>{skillList}</Text>
          </Section>
        ) : null}
      </Page>
    </Document>
  );
}
