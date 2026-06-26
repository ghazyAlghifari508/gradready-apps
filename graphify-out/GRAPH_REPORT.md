# Graph Report - gradready  (2026-06-26)

## Corpus Check
- 156 files · ~348,069 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1721 nodes · 4638 edges · 75 communities detected
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 294 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 89|Community 89]]
- [[_COMMUNITY_Community 90|Community 90]]
- [[_COMMUNITY_Community 142|Community 142]]
- [[_COMMUNITY_Community 143|Community 143]]
- [[_COMMUNITY_Community 144|Community 144]]
- [[_COMMUNITY_Community 145|Community 145]]
- [[_COMMUNITY_Community 146|Community 146]]
- [[_COMMUNITY_Community 147|Community 147]]
- [[_COMMUNITY_Community 148|Community 148]]
- [[_COMMUNITY_Community 149|Community 149]]
- [[_COMMUNITY_Community 150|Community 150]]
- [[_COMMUNITY_Community 151|Community 151]]
- [[_COMMUNITY_Community 152|Community 152]]

## God Nodes (most connected - your core abstractions)
1. `L()` - 39 edges
2. `handleApiError()` - 38 edges
3. `auth library (server-side)` - 34 edges
4. `Prisma ORM Client` - 34 edges
5. `interpretNode()` - 27 edges
6. `interpretNode()` - 26 edges
7. `t()` - 25 edges
8. `slice()` - 24 edges
9. `ro()` - 21 edges
10. `from()` - 21 edges

## Surprising Connections (you probably didn't know these)
- `Badge Variant Type` --semantically_similar_to--> `SkillStatus Enum (GREEN/YELLOW/RED)`  [INFERRED] [semantically similar]
  src/components/ui/Badge.tsx → prisma/schema.prisma
- `isAdmin Function` --semantically_similar_to--> `isAdmin (roles)`  [AMBIGUOUS] [semantically similar]
  src/lib/auth.ts → src/lib/roles.ts
- `auth (Better Auth Server Instance)` --implements--> `Better Auth`  [INFERRED]
  src/lib/auth.ts → README.md
- `prisma (Global PrismaClient Instance)` --implements--> `Prisma ORM`  [INFERRED]
  src/lib/prisma.ts → README.md
- `Career Preparation Checklist Page` --semantically_similar_to--> `RED/YELLOW/GREEN Skill Status Traffic-Light Paradigm`  [INFERRED] [semantically similar]
  src/app/(auth)/checklist/page.tsx → prisma/migrations/20260415002727_role_string_ban_fields/migration.sql

## Hyperedges (group relationships)
- **Career Readiness Tracking (Skill Gap â†’ Roadmap Progress â†’ Readiness Badges)** — schema_skill_gaps, schema_roadmap_progress, schema_readiness_badges [EXTRACTED 1.00]
- **Proxy â†’ Auth Layout â†’ Dashboard authentication flow** — proxy_middleware, auth_layout, dashboard_page [INFERRED 0.85]
- **CV Upload â†’ Score History â†’ Re-check Comparison Lifecycle** — schema_cv_records, schema_cv_score_history, cv_recheck_page [EXTRACTED 1.00]
- **he_doc_builder_pattern** —  [INFERRED 0.90]
- **he_auth_flow** —  [INFERRED 0.90]
- **he_skill_gap_to_roadmap_pipeline** —  [INFERRED 0.85]
- **he_admin_guard** —  [INFERRED 0.85]

## Communities

### Community 0 - "Community 0"
Cohesion: 0.03
Nodes (183): aa(), Ad(), ai(), as(), batchCacheSize(), bn(), bo(), Bp() (+175 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (68): $(), a(), F, fe(), G(), ge(), I(), J() (+60 more)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (94): Profile Client Form Component, handleSubmit (Profile Update), Admin Job Roles Management Page, handleSave (Admin Job Roles CRUD), AdminResourcesPage, Resource Interface, Skill Interface, AdminUsersPage (+86 more)

### Community 3 - "Community 3"
Cohesion: 0.05
Nodes (55): POST(), stringSimilarity(), POST(), POST(), POST(), POST(), capPrompt(), fenced() (+47 more)

### Community 4 - "Community 4"
Cohesion: 0.04
Nodes (81): addItem(), ai(), ap(), apiKey(), batchCacheSize(), Bm(), bu(), Ca() (+73 more)

### Community 5 - "Community 5"
Cohesion: 0.04
Nodes (78): as(), Bn(), cancelAllTransactions(), Cl(), clear(), cs(), da(), disconnect() (+70 more)

### Community 6 - "Community 6"
Cohesion: 0.04
Nodes (32): AdminLayout(), AdminDashboardPage(), AdminArticlesPage(), GET(), POST(), slugify(), DELETE(), PATCH() (+24 more)

### Community 7 - "Community 7"
Cohesion: 0.11
Nodes (59): ac(), addErrorMessage(), addField(), addSuggestion(), ar(), asObject(), Be(), cc() (+51 more)

### Community 8 - "Community 8"
Cohesion: 0.07
Nodes (58): #a(), ap(), apiKey(), Ba(), cl(), commitTransaction(), connect(), Da() (+50 more)

### Community 9 - "Community 9"
Cohesion: 0.05
Nodes (50): Admin Layout (Sidebar + Auth Guard), isAdmin Guard (Admin Layout), API Endpoint: /api/jobfit/analyze, API Endpoint: /api/quiz, API Endpoint: /api/quiz/submit, API Endpoint: /api/roadmap/progress, API Endpoint: /api/roadmap/[userId], API Endpoint: /api/skillgap/analyze (+42 more)

### Community 10 - "Community 10"
Cohesion: 0.05
Nodes (49): Better Auth, CV Analyzer Feature, Dashboard & Market Insights Feature, Document Builder Feature, GradReady Platform, Lucide React Icons, Mock Interview Feature, Next.js 15 Framework (+41 more)

### Community 11 - "Community 11"
Cohesion: 0.08
Nodes (46): _a(), Ce(), connect(), di(), Dp(), ea(), enumValues(), fe() (+38 more)

### Community 12 - "Community 12"
Cohesion: 0.06
Nodes (46): Input Component, InputProps Interface, TextArea Component, TextAreaProps Interface, inputBaseStyles Constant, PrismaClient (Data Access Layer), Prisma Account Model, BadgeType Enum (READY_75/READY_90/FULLY_READY) (+38 more)

### Community 13 - "Community 13"
Cohesion: 0.08
Nodes (37): ad(), bc(), bs(), execute(), Fs(), get(), getAllBatchQueryCallbacks(), getAllModelExtensions() (+29 more)

### Community 14 - "Community 14"
Cohesion: 0.09
Nodes (35): P(), an(), Bd(), _d(), Dd(), ds(), Ei(), Ep() (+27 more)

### Community 15 - "Community 15"
Cohesion: 0.09
Nodes (12): StandardPDF(), handleGenerate(), handleAnalyze(), getApiErrorMessage(), useQuotaExceededHandler(), handleGenerate(), handleEvaluate(), handleGenerate() (+4 more)

### Community 16 - "Community 16"
Cohesion: 0.1
Nodes (33): _(), ao(), Bt(), byteLength(), concat(), cp(), dt(), Fa() (+25 more)

### Community 17 - "Community 17"
Cohesion: 0.08
Nodes (32): bl(), Bu(), en(), fm(), fromContent(), Ge(), highlight(), hl() (+24 more)

### Community 18 - "Community 18"
Cohesion: 0.08
Nodes (29): alloc(), allocUnsafe(), au(), _d(), destroy(), digest(), digestInto(), dm() (+21 more)

### Community 19 - "Community 19"
Cohesion: 0.09
Nodes (29): allocUnsafeSlow(), am(), Bd(), construct(), cr(), cu(), em(), from() (+21 more)

### Community 20 - "Community 20"
Cohesion: 0.13
Nodes (27): addMarginSymbol(), afterNextNewline(), compare(), copy(), getCurrentLineLength(), H(), indent(), newLine() (+19 more)

### Community 21 - "Community 21"
Cohesion: 0.17
Nodes (23): Br(), de(), ep(), findField(), Gc(), getArgumentName(), getArgumentPath(), getOutputTypeDescription() (+15 more)

### Community 22 - "Community 22"
Cohesion: 0.12
Nodes (23): _e(), build(), commitTransaction(), dispatchEngineSpans(), #f(), fl(), getActiveContext(), getGlobalOmit() (+15 more)

### Community 23 - "Community 23"
Cohesion: 0.13
Nodes (22): addMarginSymbol(), afterNextNewline(), br(), bs(), getCurrentLineLength(), Ia(), indent(), J() (+14 more)

### Community 24 - "Community 24"
Cohesion: 0.13
Nodes (20): aa(), bp(), ei(), fp(), getAllClientExtensions(), getAllComputedFields(), getComputedFields(), Hp() (+12 more)

### Community 25 - "Community 25"
Cohesion: 0.12
Nodes (17): addItem(), append(), At(), bc(), getGlobalOmit(), ho(), Jm(), Kt() (+9 more)

### Community 26 - "Community 26"
Cohesion: 0.12
Nodes (17): Am(), build(), De(), dispatchEngineSpans(), Fl(), getActiveContext(), getTraceParent(), getTracingHelper() (+9 more)

### Community 27 - "Community 27"
Cohesion: 0.13
Nodes (17): $c(), Di(), el(), Fo(), getLocation(), getPlaceholderValues(), ii(), ka() (+9 more)

### Community 28 - "Community 28"
Cohesion: 0.18
Nodes (16): $(), Ee(), Fd(), getAllClientExtensions(), getAllComputedFields(), getAllModelExtensions(), getOrCreate(), Go() (+8 more)

### Community 29 - "Community 29"
Cohesion: 0.16
Nodes (16): AI CV Analysis Pipeline (uploadâ†’parseâ†’scoreâ†’feedback), ATS-Compliant CV Design Principle, Career Preparation Checklist Page, Cover Letter Builder & AI Generation, CV Analyzer Upload & Result Page, CV Re-check Side-by-Side Comparison, CV Versioning Strategy (track revisions over time), Dashboard with Readiness & Feature Grid (+8 more)

### Community 30 - "Community 30"
Cohesion: 0.21
Nodes (14): API Endpoint: /api/doc/generate, API Endpoint: /api/mock-interview/evaluate, StandardPDF Component, LinkedIn About Generator Page, handleGenerate (LinkedIn), Mock Interview Page, handleEvaluate (Mock Interview), Motivation Letter Builder Page (+6 more)

### Community 31 - "Community 31"
Cohesion: 0.2
Nodes (10): Migration: Enforce lowercase user/amdin roles, Account Entity (Better Auth credentials), JobRole-Skill Many-to-Many junction, Job Role Entity (target careers), Learning Resources (per skill), Skill Entity (named competences), User Entity with auth & ban fields, GradReady Database Seed Script (+2 more)

### Community 32 - "Community 32"
Cohesion: 0.25
Nodes (9): append(), cd(), e(), Ht(), ld(), Ms(), nd(), pd() (+1 more)

### Community 33 - "Community 33"
Cohesion: 0.48
Nodes (5): DataLoader, MergedExtensionsList, RequestHandler, Skip, TypedSql

### Community 35 - "Community 35"
Cohesion: 0.4
Nodes (2): handleSave(), loadArticles()

### Community 36 - "Community 36"
Cohesion: 0.4
Nodes (2): handleSave(), loadRoles()

### Community 37 - "Community 37"
Cohesion: 0.4
Nodes (2): handleSave(), loadResources()

### Community 39 - "Community 39"
Cohesion: 0.6
Nodes (4): c(), d(), k(), u()

### Community 40 - "Community 40"
Cohesion: 0.6
Nodes (6): Hero Section Photo 1, Hero Section Photo 2, Hero Section Photo 3, Hero Section Photo 4, Vercel Logo, Window Browser Icon

### Community 41 - "Community 41"
Cohesion: 0.7
Nodes (4): isPublicPath(), proxy(), requiresAdmin(), requiresAuth()

### Community 42 - "Community 42"
Cohesion: 0.7
Nodes (4): fetchJobs(), handleAddJob(), handleDelete(), handleUpdateStatus()

### Community 43 - "Community 43"
Cohesion: 0.6
Nodes (3): goBack(), goNext(), handleFinish()

### Community 44 - "Community 44"
Cohesion: 0.4
Nodes (4): AnyNull, DbNull, JsonNull, PrismaClient

### Community 45 - "Community 45"
Cohesion: 0.4
Nodes (5): DATABASE_URL + DIRECT_URL dual connection pattern, Project ESLint Configuration, Ignore TypeScript build errors on Vercel (Prisma type diffs), Next.js Configuration with Turbopack, Prisma v7 CLI/Runtime Configuration

### Community 46 - "Community 46"
Cohesion: 0.5
Nodes (5): CV Download Button, CV PDF Document, CVData Interface, Standard PDF Document, PDFDownloadLink (@react-pdf/renderer)

### Community 47 - "Community 47"
Cohesion: 0.6
Nodes (5): 404 Page Illustration, Error Page Illustration, Document Icon, Globe Icon, Next.js Logo

### Community 48 - "Community 48"
Cohesion: 0.67
Nodes (2): handleChange(), handleSubmit()

### Community 50 - "Community 50"
Cohesion: 0.67
Nodes (2): fetchRoadmap(), toggleResource()

### Community 51 - "Community 51"
Cohesion: 0.67
Nodes (2): renderBullets(), Section()

### Community 52 - "Community 52"
Cohesion: 0.67
Nodes (2): handleAddCustom(), handleToggle()

### Community 53 - "Community 53"
Cohesion: 0.67
Nodes (2): fetchSkills(), getStatusColor()

### Community 54 - "Community 54"
Cohesion: 0.67
Nodes (1): NotFound()

### Community 56 - "Community 56"
Cohesion: 0.67
Nodes (1): GET()

### Community 59 - "Community 59"
Cohesion: 0.67
Nodes (1): ForbiddenPage()

### Community 61 - "Community 61"
Cohesion: 0.67
Nodes (1): Footer()

### Community 62 - "Community 62"
Cohesion: 0.67
Nodes (1): GuestFooter()

### Community 63 - "Community 63"
Cohesion: 0.67
Nodes (1): GuestNavbar()

### Community 64 - "Community 64"
Cohesion: 0.67
Nodes (1): PrismaClient

### Community 65 - "Community 65"
Cohesion: 0.67
Nodes (1): createPrismaClient()

### Community 66 - "Community 66"
Cohesion: 0.67
Nodes (3): Authenticated Layout with Navbar & Sidebar, Next.js Proxy Middleware for Auth Routing, Root Layout with Nunito Font & Metadata

### Community 67 - "Community 67"
Cohesion: 1.0
Nodes (3): API Endpoint: /api/jobs/saved, Application Tracker Page, fetchJobs (Saved Jobs)

### Community 88 - "Community 88"
Cohesion: 1.0
Nodes (2): Global 500 Error Page (Client), 404 Not Found Page

### Community 89 - "Community 89"
Cohesion: 1.0
Nodes (2): CV Builder Wizard with PDF Export, Lazy-load @react-pdf/renderer to avoid SSR reconciliation issues

### Community 90 - "Community 90"
Cohesion: 1.0
Nodes (2): Admin Dashboard Page, API Endpoint: /api/admin/stats

### Community 142 - "Community 142"
Cohesion: 1.0
Nodes (1): Session Entity (Better Auth)

### Community 143 - "Community 143"
Cohesion: 1.0
Nodes (1): User Profile Entity (career target)

### Community 144 - "Community 144"
Cohesion: 1.0
Nodes (1): CV Score History (track changes)

### Community 145 - "Community 145"
Cohesion: 1.0
Nodes (1): Saved Jobs Tracker

### Community 146 - "Community 146"
Cohesion: 1.0
Nodes (1): Readiness Badges Entity

### Community 147 - "Community 147"
Cohesion: 1.0
Nodes (1): Quiz Questions Entity

### Community 148 - "Community 148"
Cohesion: 1.0
Nodes (1): Button Variant Type

### Community 149 - "Community 149"
Cohesion: 1.0
Nodes (1): Card Props Interface

### Community 150 - "Community 150"
Cohesion: 1.0
Nodes (1): Session Type

### Community 151 - "Community 151"
Cohesion: 1.0
Nodes (1): User Type

### Community 152 - "Community 152"
Cohesion: 1.0
Nodes (1): emptyModule

## Ambiguous Edges - Review These
- `Admin Resources GET` → `Market Overview GET`  [AMBIGUOUS]
  src/app/api/market/overview/route.ts · relation: conceptually_related_to
- `CV Latest GET` → `CV Upload POST`  [AMBIGUOUS]
  src/app/api/cv/upload/route.ts · relation: calls
- `isAdmin Function` → `isAdmin (roles)`  [AMBIGUOUS]
  src/lib/auth.ts · relation: semantically_similar_to
- `ToastType Union` → `SkillStatus Enum (RED/YELLOW/GREEN)`  [AMBIGUOUS]
  src/components/ui/Toast.tsx · relation: semantically_similar_to
- `callAI` → `ATS_KEYWORDS List`  [AMBIGUOUS]
  src/lib/cv-scorer.ts · relation: semantically_similar_to

## Knowledge Gaps
- **97 isolated node(s):** `PrismaClient`, `DbNull`, `JsonNull`, `AnyNull`, `Project ESLint Configuration` (+92 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 35`** (6 nodes): `handleDelete()`, `handleSave()`, `loadArticles()`, `openCreate()`, `openEdit()`, `AdminArticlesClientPage.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 36`** (6 nodes): `handleDelete()`, `handleSave()`, `loadRoles()`, `openCreate()`, `openEdit()`, `AdminJobRolesClientPage.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (6 nodes): `handleDelete()`, `handleSave()`, `loadResources()`, `openCreate()`, `openEdit()`, `AdminResourcesClientPage.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 48`** (4 nodes): `ProfileClientForm.tsx`, `handleChange()`, `handleSubmit()`, `ProfileClientForm.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 50`** (4 nodes): `fetchRoadmap()`, `renderSkillGroup()`, `toggleResource()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 51`** (4 nodes): `CVPDF.tsx`, `renderBullets()`, `Section()`, `CVPDF.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 52`** (4 nodes): `page.tsx`, `handleAddCustom()`, `handleToggle()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 53`** (4 nodes): `page.tsx`, `fetchSkills()`, `getStatusColor()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 54`** (3 nodes): `NotFound()`, `not-found.tsx`, `not-found.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 56`** (3 nodes): `route.ts`, `GET()`, `route.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 59`** (3 nodes): `page.tsx`, `ForbiddenPage()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 61`** (3 nodes): `Footer.tsx`, `Footer()`, `Footer.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 62`** (3 nodes): `GuestFooter.tsx`, `GuestFooter()`, `GuestFooter.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 63`** (3 nodes): `GuestNavbar.tsx`, `GuestNavbar()`, `GuestNavbar.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 64`** (3 nodes): `PrismaClient`, `.constructor()`, `index-browser.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 65`** (3 nodes): `prisma.ts`, `createPrismaClient()`, `prisma.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 88`** (2 nodes): `Global 500 Error Page (Client)`, `404 Not Found Page`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 89`** (2 nodes): `CV Builder Wizard with PDF Export`, `Lazy-load @react-pdf/renderer to avoid SSR reconciliation issues`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 90`** (2 nodes): `Admin Dashboard Page`, `API Endpoint: /api/admin/stats`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 142`** (1 nodes): `Session Entity (Better Auth)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 143`** (1 nodes): `User Profile Entity (career target)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 144`** (1 nodes): `CV Score History (track changes)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 145`** (1 nodes): `Saved Jobs Tracker`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 146`** (1 nodes): `Readiness Badges Entity`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 147`** (1 nodes): `Quiz Questions Entity`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 148`** (1 nodes): `Button Variant Type`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 149`** (1 nodes): `Card Props Interface`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 150`** (1 nodes): `Session Type`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 151`** (1 nodes): `User Type`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 152`** (1 nodes): `emptyModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Admin Resources GET` and `Market Overview GET`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `CV Latest GET` and `CV Upload POST`?**
  _Edge tagged AMBIGUOUS (relation: calls) - confidence is low._
- **What is the exact relationship between `isAdmin Function` and `isAdmin (roles)`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **What is the exact relationship between `ToastType Union` and `SkillStatus Enum (RED/YELLOW/GREEN)`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **What is the exact relationship between `callAI` and `ATS_KEYWORDS List`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **Why does `t()` connect `Community 5` to `Community 0`, `Community 1`, `Community 4`, `Community 8`, `Community 14`, `Community 16`, `Community 17`, `Community 20`, `Community 22`, `Community 23`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `isAdmin Function` connect `Community 6` to `Community 9`, `Community 2`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._