# GradReady — AGENTS & SKILLS Guide

> **Platform**: Career Readiness Assistant | **Stack**: Next.js 16 + React 19 + TypeScript + Tailwind + Prisma ORM + Better Auth + PostgreSQL  
> **Deployment**: Vercel | **AI**: NVIDIA NIM (OpenAI-compatible REST)

---

## Mandatory Coding Rules

- UTAMAKAN analisis codebase **MENYELURUH** sebelum menulis kode. Gunakan `graphify update` setelah perubahan file.
- Pahami alur data end-to-end, struktur folder, dependency, state management, API flow, reusable components, dan dampak perubahan.
- Jangan breaking change, refactor besar, atau file baru tanpa alasan jelas & analisis matang.
- Jangan duplikasi logic—leverage pattern yang sudah ada.
- Sebelum coding: jelaskan analisis, akar masalah, file terdampak, rencana implementasi.
- Jangan commit/push/merge tanpa instruksi eksplisit user.

---

## MCP Servers (Priority Order)

### 1. **Context7** — Documentation & API Lookup (REQUIRED)
- **Use for**: Fetch current docs untuk Next.js, React, Prisma, Tailwind, TypeScript, NVIDIA NIM API.
- **When**: User asks setup/API/version questions. Don't guess—fetch docs via Context7.
- **Example**: "How do I use Prisma driver adapters?" → `mcp__context7__resolve-library-id` + `mcp__context7__query-docs`.

### 2. **Supabase** — Database Introspection & SQL Validation (REQUIRED)
- **Use for**: Inspect Postgres schema, validate RLS policies, debug migrations, optimize queries.
- **When**: Building SQL, creating migrations, designing schema, troubleshooting data access.
- **Note**: Project uses Prisma ORM (not direct Supabase SDK), but schema is PostgreSQL—Supabase MCP introspects it.

### 3. **21st.dev (MCP Magic)** — UI Component Inspiration (OPTIONAL)
- **Use for**: Find component designs, copy snippets, refine UI.
- **When**: Building new UI or refining existing components.
- **Example**: Need a job tracker card? → search 21st for "job tracker", copy pattern, adapt.

---

## Graphify Knowledge Graph

- **Location**: `graphify-out/GRAPH_REPORT.md`
- **Use Before**: Answering architecture/relationship questions ("How does X relate to Y?").
- **Commands**:
  - `graphify query "<question>"` — traverse graph for cross-module patterns
  - `graphify path "<A>" "<B>"` — find dependency chain between features
  - `graphify explain "<concept>"` — understand concept's role in system
- **After Modifying Code**: Run `graphify update .` (AST-only, no API cost).

---

## Core Communities (God Nodes)

From GRAPH_REPORT—main architectural clusters:

| Community | Role | Key Files |
|-----------|------|-----------|
| **Admin & User Management** | Admin CRUD, user roles, isAdmin guard | `src/app/admin/*`, `src/lib/auth.ts`, `src/lib/roles.ts` |
| **AI & CV Analysis Pipeline** | CV upload → score → feedback | `src/lib/cv-scorer.ts`, `src/app/api/cv/*` |
| **User Dashboard & Career Services** | Dashboard, checklist, CV builder, cover letter | `src/app/(auth)/dashboard`, `src/app/(auth)/cv-builder/*` |
| **Document Generation API** | PDF generation, LinkedIn/Cover Letter builders | `src/app/api/doc/*`, `src/components/StandardPDF.tsx` |
| **Job Roles Admin CRUD** | Job role management | `src/app/admin/job-roles`, `src/app/api/admin/job-roles/*` |
| **Resources Admin CRUD** | Learning resource management | `src/app/admin/resources`, `src/app/api/admin/resources/*` |
| **Saved Jobs Management** | Job tracker, status updates | `src/app/api/jobs/saved`, `src/app/(auth)/saved-jobs` |
| **Auth Proxy Middleware** | Route guards, auth flow | `src/proxy.ts`, `src/app/(auth)/layout.tsx` |
| **Database Schema & Migrations** | Prisma schema, seed data | `prisma/schema.prisma`, `prisma/migrations/`, `prisma/seed.ts` |

---

## ECC Agents & When to Use

**🔴 REQUIRED (run immediately after editing):**

- **`ecc:react-reviewer`** — React/TSX changes. Checks hooks, render performance, server/client boundaries, a11y, security.
- **`ecc:typescript-reviewer`** — TypeScript/JS logic. Type safety, async correctness, security.
- **`ecc:database-reviewer`** — SQL, schema design, migrations, query optimization (PostreSQL specialist).
- **`ecc:security-reviewer`** — Input validation, auth, API endpoints, sensitive data handling.

**🟡 RECOMMENDED (use proactively):**

- **`ecc:react-build-resolver`** — Build fails (JSX/TSX errors, hydration mismatch, type issues).
- **`ecc:code-reviewer`** — General quality, maintainability, efficiency review.
- **`ecc:code-simplifier`** — Refactor for clarity without behavior change.
- **`ecc:code-architect`** — Design complex feature before implementation.
- **`ecc:code-explorer`** — Understand existing code before adding features.
- **`ecc:planner`** — Plan large features/refactors.
- **`ecc:refactor-cleaner`** — Remove dead code, duplicates.
- **`ecc:performance-optimizer`** — Profile bottlenecks, bundle size, memory leaks.
- **`ecc:a11y-architect`** — WCAG 2.2 compliance for UI components.
- **`ecc:e2e-runner`** — Generate & maintain end-to-end tests (Vercel Agent Browser).
- **`ecc:silent-failure-hunter`** — Find swallowed errors, bad fallbacks.
- **`ecc:doc-updater`** — Update codemaps & docs.

**🟢 OPTIONAL (use as needed):**

- **`ecc:comment-analyzer`** — Audit comment accuracy & rot risk.
- **`ecc:type-design-analyzer`** — Analyze type encapsulation & invariants.

---

## ECC Skills (by Category)

### Frontend & React

- **`ecc:react-patterns`** — React idioms, hooks, state management patterns.
- **`ecc:react-performance`** — Optimize renders, memoization, lazy loading.
- **`ecc:react-testing`** — Unit/component testing with React.
- **`ecc:nextjs-turbopack`** — Next.js 16 + Turbopack configuration, optimization.
- **`ecc:frontend-patterns`** — Frontend architecture, client/server boundary, SSR/CSR patterns.
- **`ecc:frontend-a11y`** — Accessibility: ARIA, keyboard nav, screen readers.

### UI/UX & Design System

- **`ecc:design-system`** — Build design system, component library, token management.
- **`ecc:make-interfaces-feel-better`** — Micro-interactions, animations, UX polish.
- **`ecc:liquid-glass-design`** — Glassmorphic, modern design trends.

### Database & Backend

- **`ecc:postgres-patterns`** — PostgreSQL idioms, indexes, query design.
- **`ecc:database-migrations`** — Safe schema changes, versioning, rollback strategies.
- **`ecc:deployment-patterns`** — Deployment architectures, CI/CD, staging.

### Quality & Security

- **`ecc:code-review`** — Structured code review at chosen effort level.
- **`ecc:test-coverage`** — Measure & improve test coverage.
- **`ecc:quality-gate`** — Pre-commit quality checks.
- **`ecc:security-review`** — OWASP Top 10, vulnerability assessment.
- **`ecc:security-scan`** — Automated security scanning.

### DevOps & Infrastructure

- **`ecc:docker-patterns`** — Containerization, multi-stage builds.
- **`ecc:git-workflow`** — Branch strategy, commit hygiene, rebase vs merge.
- **`ecc:github-ops`** — GitHub Actions, PR automation, releases.

### Methodologies

- **`ecc:tdd-guide`** — Test-driven development (write tests first).
- **`ecc:docs-lookup`** — Fetch current docs via Context7 (library-specific).

---

## Required Skills for GradReady

**STATUS**: ✅ **ALL INSTALLED** (as of 2026-06-26). Reference with `/[skill-name]` in prompts.

---

### `/test-driven-development` — Test-Driven Development
- **Capability**: Write tests BEFORE implementation, TDD patterns, test coverage.
- **GUNAKAN KETIKA**:
  - Building CV scoring algorithm (`src/lib/cv-scorer.ts`)
  - Implementing job matching logic (`src/app/api/job-fit/analyze`)
  - Adding badge award rules (`src/lib/badges.ts`)
  - Roadmap progress calculation logic
- **CONTOH KASUS**: "Implement test-first for CV score matching. User uploads CV → parser extracts skills → matcher compares to job requirements → returns match percentage. /test-driven-development"
- **Status**: ✅ Installed

---

### `/better-auth-authentication` — Better Auth Setup & User Management
- **Capability**: Better Auth integration, user creation, roles/permissions, session flow.
- **GUNAKAN KETIKA**:
  - Setting up user registration/login flow
  - Assigning admin roles to new users
  - Implementing role-based access control (user vs admin vs super-admin)
  - Managing user sessions and logout
  - Creating permission guards for protected routes
- **CONTOH KASUS**: "User signup → auto-create profile → assign 'user' role → redirect to dashboard. Later admin can promote to 'admin' for job role management. /better-auth-authentication"
- **Status**: ✅ Installed

---

### `/better-auth-security-best-practices` — Auth Security & Hardening
- **Capability**: CSRF protection, rate limiting, session security, secure token handling.
- **GUNAKAN KETIKA**:
  - Hardening login/signup endpoints against brute force
  - Validating CSRF tokens on state-changing forms
  - Securing OAuth token storage
  - Implementing session expiry & refresh tokens
  - Auditing auth flow for vulnerabilities
- **CONTOH KASUS**: "Admin panel forms for job role CRUD should have CSRF protection. Login route needs rate limiting (max 5 attempts/min). /better-auth-security-best-practices"
- **Status**: ✅ Installed

---

### `/document-pdf` — PDF Generation & Document Building
- **Capability**: Generate PDFs, extract text, handle forms, merge/split documents.
- **GUNAKAN KETIKA**:
  - Building CV PDF export from CV builder
  - Generating LinkedIn About PDF template
  - Creating Cover Letter PDF download
  - Generating Motivation Letter PDF
  - Creating job offer letter templates
  - Exporting CV scoring report as PDF
- **CONTOH KASUS**: "User clicks 'Download CV as PDF' → StandardPDF component renders with user data → PDF generated & downloaded. /document-pdf"
- **Status**: ✅ Installed

---

### `/webapp-testing` — Web App Testing & QA
- **Capability**: Test web app behavior, fill forms, click buttons, verify UI states, screenshot capture.
- **GUNAKAN KETIKA**:
  - Testing CV upload → scoring flow end-to-end
  - Verifying job tracker status transitions (SAVED→APPLIED→INTERVIEW→OFFERED→ACCEPTED)
  - Testing dashboard feature grid loads correctly
  - Validating form validation (profile update, job role CRUD)
  - Screenshotting quiz & mock interview UI
  - Automated testing of admin panel CRUD operations
- **CONTOH KASUS**: "Test CV upload flow: user selects PDF → parser extracts → score displays → history updates. Verify no score lost on page refresh. /webapp-testing"
- **Status**: ✅ Installed

---

### `/vercel-react-best-practices` — React Patterns & Performance
- **Capability**: React hooks, state management, render optimization, server/client boundaries.
- **GUNAKAN KETIKA**:
  - Building dashboard readiness score component with real-time updates
  - Optimizing CV builder with lazy-loaded PDF renderer
  - Implementing skill gap visualization (RED/YELLOW/GREEN badges)
  - Managing quiz state during multi-step questions
  - Handling job tracker list with filters (SAVED/APPLIED/INTERVIEW/etc)
  - Refactoring components for better performance
- **CONTOH KASUS**: "CV builder re-renders on every keystroke in form. Optimize with useMemo + useCallback. Also, @react-pdf/renderer should lazy-load to avoid SSR reconciliation. /vercel-react-best-practices"
- **Status**: ✅ Installed

---

### `/supabase-postgres-best-practices` — PostgreSQL & DB Optimization
- **Capability**: Query design, indexes, schema patterns, RLS policies, migrations.
- **GUNAKAN KETIKA**:
  - Optimizing CV score history queries (join with User + CVRecord)
  - Designing job role → skill many-to-many relationship
  - Adding indexes for saved jobs fast filtering (status, createdAt)
  - Writing RLS policies (users can only see own CV scores, admin sees all)
  - Optimizing readiness badge query (count GREEN skills)
  - Creating safe migrations without downtime
- **CONTOH KASUS**: "SavedJob query with filters (status=APPLIED, createdAt DESC) is slow. Add composite index on (userId, status, createdAt). Also verify RLS prevents users seeing others' jobs. /supabase-postgres-best-practices"
- **Status**: ✅ Installed

---

### `/supabase-extract-db-string` — Security: Detect Exposed DB Strings
- **Capability**: Detect exposed PostgreSQL connection strings in client-side code.
- **GUNAKAN KETIKA**:
  - Auditing client components for hardcoded DATABASE_URL
  - Scanning API routes for leaked Postgres credentials in error messages
  - Checking env variables are properly gated (server-only vs NEXT_PUBLIC_)
  - Reviewing logs/console output for sensitive data leaks
- **CONTOH KASUS**: "Dev accidentally logs DATABASE_URL in CV scorer error handler. Client sees full connection string. Scan & fix all logging. /supabase-extract-db-string"
- **Status**: ✅ Installed

---

### `/ui-design-system` — UI Components & Design System
- **Capability**: Shadcn/ui patterns, TailwindCSS, component library, dark mode, theming.
- **GUNAKAN KETIKA**:
  - Building new admin panel pages (users, job roles, resources CRUD)
  - Designing readiness badge component (READY_75 / READY_90 / FULLY_READY states)
  - Creating skill gap visualization cards
  - Refactoring UI components for consistency
  - Implementing dark mode support
  - Creating accessible form inputs for CV builder
- **CONTOH KASUS**: "Admin job roles page needs CRUD cards. Use ui-design-system patterns: Card wrapper, Button variants (primary/secondary/destructive), Input with validation. Ensure a11y labels. /ui-design-system"
- **Status**: ✅ Installed

---

### `/agent-browser` — Browser Automation & Testing
- **Capability**: Navigate websites, fill forms, click buttons, extract data, take screenshots, test web apps.
- **GUNAKAN KETIKA**:
  - Manual QA testing of CV builder wizard
  - Verifying job tracker UI under different screen sizes
  - Testing mock interview flow (questions → answers → evaluation)
  - Screenshotting dashboard for documentation
  - Testing admin panel CRUD workflows
  - Checking responsive design on mobile breakpoints
- **CONTOH KASUS**: "Test CV builder: upload file → fill form → preview PDF → download. Screenshot each step. Verify form validation errors show correctly. /agent-browser"
- **Status**: ✅ Installed

---

## Additional Installed Skills (GradReady-Specific)

### `/nextjs-developer` — Next.js Patterns & App Router
- **GUNAKAN KETIKA**:
  - Building new protected routes in `(auth)` group
  - Setting up Server Components for data fetching (CV scores, roadmap progress)
  - Implementing dynamic routes (`/quiz/[skillId]`, `/roadmap/[userId]`)
  - Middleware for auth redirects in `src/proxy.ts`
  - Optimizing images with `next/image` in CV templates
- **CONTOH KASUS**: "Dashboard needs real-time badges. Use Server Component + Suspense boundary, fetch badges server-side. /nextjs-developer"
- **Status**: ✅ Installed

---

### `/supabase-postgres-best-practices` — Postgres Patterns for GradReady Schema
- **GUNAKAN KETIKA**:
  - Querying skill roadmap progress (which skills done, which in progress)
  - Calculating user readiness score from badge count
  - Analyzing job fit between CV skills and job requirements
  - Optimizing saved jobs filter by status
  - Writing safe migrations (e.g., adding new skill columns)
- **CONTOH KASUS**: "Readiness badge query: COUNT(skills WHERE status=GREEN) / COUNT(allSkills). Add index on (userId, status) for fast calculation. /supabase-postgres-best-practices"
- **Status**: ✅ Installed

---

### `/supabase-nextjs` — Supabase + Next.js Integration
- **GUNAKAN KETIKA**:
  - Setting up auth context in layout
  - Using Supabase real-time for live job notifications
  - Streaming CV analysis results to client
  - Managing user sessions across routes
- **CONTOH KASUS**: "CV upload completes → trigger real-time notification to dashboard. Use Supabase real-time subscription. /supabase-nextjs"
- **Status**: ✅ Installed

---

### `/ui-ux-pro-max` — Advanced UI/UX & Animations
- **GUNAKAN KETIKA**:
  - Adding micro-interactions (badge earn animation)
  - Designing skill gap visualization animations
  - Improving form UX (progress steps, inline validation)
  - Polishing dashboard animations on readiness score change
  - Creating smooth transitions between CV builder steps
- **CONTOH KASUS**: "When user earns FULLY_READY badge, animate badge slide in + confetti. /ui-ux-pro-max"
- **Status**: ✅ Installed

---

### `/interactive-portfolio` — Portfolio/Resume Builders
- **GUNAKAN KETIKA**:
  - Building LinkedIn profile generator feature
  - Creating portfolio builder (if adding to roadmap)
  - Designing resume/CV editor UX
- **CONTOH KASUS**: "LinkedIn About generator → preview → copy to clipboard. /interactive-portfolio"
- **Status**: ✅ Installed (optional for GradReady)

---

## Additional Installed Skills (Already Available Locally)

These skills are pre-installed and ready to use. Reference with `/[skill-name]` in prompts:

### Next.js & Frontend
- **`nextjs-developer`** — Next.js patterns, App Router, middleware, deployment.  
  Use: `/nextjs-developer` when building Next.js features.

- **`vercel-react-best-practices`** — React patterns, hooks, performance, SSR/CSR.  
  Use: `/vercel-react-best-practices` for React component guidance.

### Database & Backend
- **`supabase-postgres-best-practices`** — PostgreSQL + Supabase patterns, RLS, migrations, queries.  
  Use: `/supabase-postgres-best-practices` for DB design & optimization.

- **`supabase-nextjs`** — Supabase + Next.js integration, auth flows, real-time.  
  Use: `/supabase-nextjs` for Supabase setup in Next.js.

### UI/UX & Design
- **`ui-ux-pro-max`** — Advanced UI/UX design, interaction patterns, accessibility, animations.  
  Use: `/ui-ux-pro-max` for UI design guidance & user experience.

### Utility
- **`interactive-portfolio`** — Build interactive portfolio/resume websites.  
  Use: `/interactive-portfolio` for portfolio-related features.

- **`game-development`** — Game development patterns (not relevant for GradReady, but available).  
  Use: Skip for this project.

### Legacy (Remove Reference)
- **`insforge`**, **`insforge-cli`**, **`insforge-debug`**, **`insforge-integrations`** — InsForge backend skills.  
  ⚠️ **DO NOT USE** — Project uses Supabase + Prisma, not InsForge.

---

## How to Use Installed Skills

1. **In Prompts**: Reference as `/[skill-name]`  
   Example: "I need to optimize this query. /supabase-postgres-best-practices"

2. **In Configuration**: Skills are globally available via `~/.claude/skills/` symlinks.

3. **Discovery**: List all skills:  
   ```bash
   npx skills list
   ```

---

## Custom Skills & Agents (in `.agents/`)

_Location for project-specific agents & skills to be added as needed._

### Example Structure:
```
.agents/
├── skills/
│   ├── cv-scorer-tuning/
│   │   ├── SKILL.md
│   │   └── README.md
│   ├── prisma-migrations-safety/
│   │   ├── SKILL.md
│   │   └── README.md
│   └── ...
└── agents/
    ├── gradready-architect/
    │   ├── AGENT.md
    │   └── system-prompt.md
    └── ...
```

---

## Caveman & Ponytail (Always Active)

### Caveman — Terse Communication
- Drop articles (a/an/the), filler (just, really, basically), pleasantries (sure, of course).
- Fragment sentences OK. Short synonyms (big not extensive, fix not "implement a solution for").
- Pattern: `[thing] [action] [reason]. [next step].`
- **Exception**: Write NORMAL for code, commits, security warnings, multi-step sequences.

### Ponytail — Lazy Efficiency
Climb this ladder, stop at first rung that holds:
1. Does this need to exist? Speculative = skip (YAGNI).
2. Already in codebase? Reuse (search first).
3. Stdlib/native platform? Use it.
4. Dependency installed? Use it (don't add new).
5. Can be one line? Make it one line.
6. Only then: minimum code that works.

**Apply AFTER understanding problem**, not instead of it. **Bug fix = root cause**, not symptom. **No unrequested abstractions** (no 1-impl interfaces, no config for fixed values). **Delete > add. Boring > clever.**

Mark deliberate shortcuts: `// ponytail: [reason], upgrade path [when]`.

---

## Project-Specific Patterns

### Auth & Roles
- **Guard**: `isAdmin()` in `src/lib/auth.ts` + `src/lib/roles.ts`.
- **Proxy**: `src/proxy.ts` routes requests → layout middleware.
- **Better Auth**: Session management, user creation, role assignment.

### Database & Prisma
- **Schema**: `prisma/schema.prisma` — User, Skill, JobRole, SavedJob, CVRecord, ReadinessBadge, etc.
- **Migrations**: `prisma/migrations/` — apply with `npm run db:migrate`.
- **Seed**: `prisma/seed.ts` — init roles, skills, job profiles.
- **Client**: Generated at `src/generated/prisma/client`.

### AI & CV Scoring
- **Flow**: Upload → Parse → Score → Store history → Feedback.
- **Scorer**: `src/lib/cv-scorer.ts` — stringSimilarity, callAI (NVIDIA NIM), scoreCv logic.
- **Endpoint**: `src/app/api/cv/` — upload, latest, recheck, score routes.

### Document Generation
- **PDF Library**: `@react-pdf/renderer` (lazy-loaded in browser to avoid SSR issues).
- **Component**: `src/components/StandardPDF.tsx` — reusable PDF template.
- **Endpoint**: `src/app/api/doc/[id]/route.ts` — generate & download.
- **Builders**: LinkedIn About, Cover Letter, Motivation Letter, Self Intro, Portfolio.

### Admin Panel
- **Pages**: `src/app/admin/` — users, job-roles, resources.
- **Guard**: `requiresAdmin()` in proxy.
- **Stats**: `src/app/api/admin/stats` — user count, feature usage.

### Job Tracker & Market
- **Saved Jobs**: `src/app/(auth)/saved-jobs` — track application status (SAVED→APPLIED→INTERVIEW→OFFERED→ACCEPTED/REJECTED).
- **Market Overview**: `src/app/(auth)/market` — demand level, salary ranges per job role.
- **Job Fit**: `src/app/(auth)/job-fit` — analyze CV vs job description.

### Dashboard & Checklist
- **Dashboard**: Central hub — readiness score, badges, quick access to features.
- **Checklist**: Career prep task tracker.
- **History**: CV submission history, roadmap progress, quiz results.

### Components & Styling
- **Tailwind**: Utility-first CSS (no custom theme config—keep default).
- **UI Lib**: `src/components/ui/` — Button, Card, Input, Badge, Toggle, Tooltip, ProgressBar, StreakCounter.
- **Icons**: Lucide React (no custom SVGs unless necessary).
- **Forms**: `react-hook-form` + Zod validation.

---

## Quick Command Reference

| Task | Command |
|------|---------|
| **Start dev server** | `npm run dev` (http://localhost:3000) |
| **Build** | `npm run build` |
| **Run locally** | `npm start` |
| **Lint** | `npm run lint` |
| **Generate Prisma** | `npm run db:generate` |
| **Migrate DB** | `npm run db:migrate` |
| **Seed DB** | `npm run db:seed` |
| **Open Prisma Studio** | `npm run db:studio` |
| **Update graphify** | `graphify update .` |
| **Deploy to Vercel** | `vercel deploy` (requires Vercel CLI) |

---

## Environment Variables

**Required in `.env.local`:**

```env
# Database
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[dbname]
DIRECT_URL=postgresql://...  # Prisma Accelerate edge

# Auth
BETTER_AUTH_SECRET=<random-string>
BETTER_AUTH_TRUST_HOST=true

# AI
NVIDIA_NIM_API_KEY=<your-api-key>

# Optional
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## When to Use Each Tool

| Scenario | Use | Why |
|----------|-----|-----|
| Build fails (JSX/type/hydration) | `ecc:react-build-resolver` | Specific to React/Next build errors |
| Change React component | `ecc:react-reviewer` | Hooks, performance, a11y, server/client |
| Change TypeScript logic | `ecc:typescript-reviewer` | Type safety, async, security |
| SQL/migration/schema change | `ecc:database-reviewer` | Postgres expert, query optimization |
| Handling user input/auth/API | `ecc:security-reviewer` | OWASP compliance |
| Code quality general | `ecc:code-reviewer` | After writing any substantial change |
| Code looks repetitive | `ecc:refactor-cleaner` | Remove duplication, dead code |
| App feels slow | `ecc:performance-optimizer` | Profile, bundle size, memory |
| New UI component | Use 21st MCP or `ecc:a11y-architect` | Design + accessibility |
| Complex feature plan | `ecc:code-architect` + `ecc:planner` | Design before build |
| Understand code before editing | `ecc:code-explorer` | Trace execution paths |
| Need library docs/API | `context7` MCP (auto via docs-lookup skill) | Current, accurate docs |
| Need Postgres schema info | `supabase` MCP | Introspect, validate RLS |

---

## Helpful Resources

- **PRD**: `PRD_GradReady_v3.md` — feature spec, roadmap, ERD.
- **Graph**: `graphify-out/GRAPH_REPORT.md` — architecture map, communities.
- **Schema**: `prisma/schema.prisma` — entity relationships, enums.
- **README**: `README.md` (if exists) — project overview.

---

## Notes

- **InsForge Removed**: Project uses Supabase (PostgreSQL) + Prisma ORM, not InsForge backend.
- **Supabase MCP**: Used for database inspection, not SDK (Prisma is ORM).
- **Deployment**: Vercel (via Vercel CLI). Ignore Netlify/Docker unless user requests.
- **Git**: Always create new commits; never amend published commits.
- **Testing**: No test suite yet—use `ecc:tdd-guide` when implementing new features.

---

**Last Updated**: 2026-06-26  
**GradReady Version**: 0.1.0 (MVP)
