import dotenv from "dotenv";

// Load .env.local first (priority), then .env
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { hashPassword } from "better-auth/crypto";

// Use DATABASE_URL for seed
const connectionString = process.env.DATABASE_URL!;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// ─── Admin seed config ───
const ADMIN_EMAIL = "admin@gradready.id";
const ADMIN_PASSWORD = "Admin123!";
const ADMIN_NAME = "Admin GradReady";

const JOB_ROLES = [
  {
    name: "Frontend Developer",
    category: "Engineering",
    description: "Membangun UI web yang interaktif dan responsif",
    demandLevel: "HIGH" as const,
  },
  {
    name: "Backend Developer",
    category: "Engineering",
    description: "Merancang API, database, dan logika server-side",
    demandLevel: "HIGH" as const,
  },
  {
    name: "Mobile Developer",
    category: "Engineering",
    description: "Membuat aplikasi mobile Android/iOS",
    demandLevel: "HIGH" as const,
  },
  {
    name: "Data Analyst",
    category: "Data",
    description: "Menganalisis data dan menghasilkan insight bisnis",
    demandLevel: "HIGH" as const,
  },
  {
    name: "UI/UX Designer",
    category: "Design",
    description: "Mendesain antarmuka yang intuitif dan berpusat pada pengguna",
    demandLevel: "MEDIUM" as const,
  },
];

const SKILLS: Record<
  string,
  { name: string; category: string; priority: "HIGH" | "MED" | "LOW" }[]
> = {
  "Frontend Developer": [
    { name: "HTML & CSS", category: "Web", priority: "HIGH" },
    { name: "JavaScript (ES6+)", category: "Programming", priority: "HIGH" },
    { name: "React.js", category: "Framework", priority: "HIGH" },
    { name: "TypeScript", category: "Programming", priority: "MED" },
    { name: "Git & GitHub", category: "Tools", priority: "HIGH" },
    { name: "Responsive Design", category: "Web", priority: "HIGH" },
    { name: "REST API Integration", category: "Web", priority: "MED" },
    { name: "Testing (Jest)", category: "Quality", priority: "LOW" },
  ],
  "Backend Developer": [
    { name: "Node.js", category: "Runtime", priority: "HIGH" },
    { name: "REST API Design", category: "Architecture", priority: "HIGH" },
    { name: "SQL & Databases", category: "Database", priority: "HIGH" },
    { name: "Authentication (JWT)", category: "Security", priority: "HIGH" },
    { name: "Git & GitHub", category: "Tools", priority: "HIGH" },
    { name: "TypeScript", category: "Programming", priority: "MED" },
    { name: "Docker Basics", category: "DevOps", priority: "MED" },
    { name: "Unit Testing", category: "Quality", priority: "LOW" },
  ],
  "Mobile Developer": [
    { name: "Flutter / Dart", category: "Framework", priority: "HIGH" },
    { name: "Kotlin (Android)", category: "Programming", priority: "MED" },
    {
      name: "REST API Consumption",
      category: "Integration",
      priority: "HIGH",
    },
    { name: "State Management", category: "Architecture", priority: "HIGH" },
    { name: "Git & GitHub", category: "Tools", priority: "HIGH" },
    {
      name: "Play Store Deployment",
      category: "DevOps",
      priority: "MED",
    },
  ],
  "Data Analyst": [
    { name: "Python (Pandas)", category: "Programming", priority: "HIGH" },
    { name: "SQL", category: "Database", priority: "HIGH" },
    {
      name: "Data Visualization",
      category: "Visualization",
      priority: "HIGH",
    },
    {
      name: "Excel / Google Sheets",
      category: "Tools",
      priority: "HIGH",
    },
    { name: "Statistics Basics", category: "Math", priority: "HIGH" },
    {
      name: "Tableau / Power BI",
      category: "Visualization",
      priority: "MED",
    },
    {
      name: "Machine Learning Basics",
      category: "ML",
      priority: "LOW",
    },
  ],
  "UI/UX Designer": [
    { name: "Figma", category: "Tool", priority: "HIGH" },
    { name: "User Research", category: "UX", priority: "HIGH" },
    {
      name: "Wireframing & Prototyping",
      category: "UX",
      priority: "HIGH",
    },
    { name: "Design Systems", category: "UI", priority: "HIGH" },
    { name: "Usability Testing", category: "UX", priority: "MED" },
    {
      name: "Typography & Color Theory",
      category: "UI",
      priority: "MED",
    },
    { name: "Motion Design", category: "UI", priority: "LOW" },
  ],
};

const RESOURCES: Record<
  string,
  {
    title: string;
    url: string;
    platform: string;
    durationWeeks: number;
    isFree: boolean;
  }[]
> = {
  "HTML & CSS": [
    {
      title: "HTML & CSS Crash Course",
      url: "https://www.youtube.com/watch?v=mU6anWqZJcc",
      platform: "YouTube",
      durationWeeks: 1,
      isFree: true,
    },
  ],
  "JavaScript (ES6+)": [
    {
      title: "JavaScript Algorithms and Data Structures",
      url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/",
      platform: "freeCodeCamp",
      durationWeeks: 4,
      isFree: true,
    },
  ],
  "React.js": [
    {
      title: "React Full Course",
      url: "https://www.youtube.com/watch?v=bMknfKXIFA8",
      platform: "YouTube",
      durationWeeks: 2,
      isFree: true,
    },
  ],
  TypeScript: [
    {
      title: "TypeScript Course for Beginners",
      url: "https://www.youtube.com/watch?v=d56mG7DezGs",
      platform: "YouTube",
      durationWeeks: 1,
      isFree: true,
    },
  ],
  "Node.js": [
    {
      title: "Node.js and Express.js - Full Course",
      url: "https://www.youtube.com/watch?v=Oe421EPjeBE",
      platform: "YouTube",
      durationWeeks: 2,
      isFree: true,
    },
  ],
  "SQL & Databases": [
    {
      title: "Relational Database Certification",
      url: "https://www.freecodecamp.org/learn/relational-database/",
      platform: "freeCodeCamp",
      durationWeeks: 3,
      isFree: true,
    },
  ],
  "Python (Pandas)": [
    {
      title: "Data Analysis with Python",
      url: "https://www.freecodecamp.org/learn/data-analysis-with-python/",
      platform: "freeCodeCamp",
      durationWeeks: 4,
      isFree: true,
    },
  ],
  Figma: [
    {
      title: "Figma UI Design Tutorial",
      url: "https://www.youtube.com/watch?v=c9Wg6Cb_YlU",
      platform: "YouTube",
      durationWeeks: 1,
      isFree: true,
    },
  ],
  "Flutter / Dart": [
    {
      title: "Flutter Course for Beginners",
      url: "https://www.youtube.com/watch?v=VPvVD8t02U8",
      platform: "YouTube",
      durationWeeks: 4,
      isFree: true,
    },
  ],
};

async function main() {
  console.log("🌱 Seeding GradReady database...");

  // 0. Seed Admin User
  console.log("  → Seeding admin user...");
  const existingAdmin = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
  });

  if (!existingAdmin) {
    const hashedPassword = await hashPassword(ADMIN_PASSWORD);
    const adminUser = await prisma.user.create({
      data: {
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        emailVerified: true,
        role: "admin",
      },
    });

    await prisma.account.create({
      data: {
        userId: adminUser.id,
        accountId: adminUser.id,
        providerId: "credential",
        password: hashedPassword,
      },
    });

    console.log(`    ✓ Admin created: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  } else {
    console.log(`    ⏭ Admin already exists: ${ADMIN_EMAIL}`);
  }

  // 1. Seed Job Roles
  console.log("  → Seeding job roles...");
  const createdJobRoles: Record<string, string> = {};

  for (const jr of JOB_ROLES) {
    const created = await prisma.jobRole.upsert({
      where: { name: jr.name },
      create: jr,
      update: jr,
    });
    createdJobRoles[jr.name] = created.id;
    console.log(`    ✓ ${jr.name}`);
  }

  // 2. Seed Skills & JobRoleSkills
  console.log("  → Seeding skills & skill mappings...");
  const createdSkills: Record<string, string> = {};

  for (const [jobRoleName, skills] of Object.entries(SKILLS)) {
    const jobRoleId = createdJobRoles[jobRoleName];
    if (!jobRoleId) continue;

    for (const skillDef of skills) {
      // Upsert skill
      let skillId = createdSkills[skillDef.name];
      if (!skillId) {
        const skill = await prisma.skill.upsert({
          where: { name: skillDef.name },
          create: { name: skillDef.name, category: skillDef.category },
          update: {},
        });
        skillId = skill.id;
        createdSkills[skillDef.name] = skillId;
      }

      // Upsert link
      await prisma.jobRoleSkill.upsert({
        where: { jobRoleId_skillId: { jobRoleId, skillId } },
        create: { jobRoleId, skillId, priorityLevel: skillDef.priority },
        update: { priorityLevel: skillDef.priority },
      });
    }
    console.log(
      `    ✓ ${jobRoleName} — ${skills.length} skills linked`
    );
  }

  // 3. Seed Learning Resources
  console.log("  → Seeding learning resources...");
  await prisma.learningResource.deleteMany();

  for (const [skillName, skillId] of Object.entries(createdSkills)) {
    const specificResources = RESOURCES[skillName];
    const resourcesToCreate = specificResources || [
      {
        title: `Learn ${skillName} from Scratch`,
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skillName + " programming tutorial")}`,
        platform: "YouTube",
        durationWeeks: Math.floor(Math.random() * 3) + 1,
        isFree: true,
      },
    ];

    for (const res of resourcesToCreate) {
      await prisma.learningResource.create({
        data: {
          skillId,
          title: res.title,
          url: res.url,
          platform: res.platform,
          durationWeeks: res.durationWeeks,
          isFree: res.isFree,
        },
      });
    }
  }
  console.log(
    `    ✓ ${Object.keys(createdSkills).length} skills now have learning resources attached.`
  );

  console.log(`\n✅ Seeding complete!`);
  console.log(`   1 admin user (${ADMIN_EMAIL})`);
  console.log(`   ${JOB_ROLES.length} job roles`);
  console.log(`   ${Object.keys(createdSkills).length} unique skills`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e.message ?? e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
