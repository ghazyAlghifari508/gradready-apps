# Product Requirements Document (PRD)
# GradReady — Job Skill Readiness Platform for Fresh Graduates

**Version:** 3.0.0  
**Tanggal:** April 2026  
**Event:** I/O Festival 2026 — Web Development Competition  
**Subtema:** Human Capital & Future Skills Inclusivity  
**Tim:** [Nama Tim]  
**Institusi:** [Nama Institusi]

---

## Daftar Isi

1. [Overview & Impact Projection](#1-overview--impact-projection)
2. [Target Pengguna & Roles](#2-target-pengguna--roles)
3. [Daftar Halaman](#3-daftar-halaman)
4. [Core Features](#4-core-features)
5. [User Flow](#5-user-flow)
6. [Use Case Diagram](#6-use-case-diagram)
7. [Skenario Use Case](#7-skenario-use-case)
8. [Sequence Diagram](#8-sequence-diagram)
9. [Architecture](#9-architecture)
10. [ERD (Entity Relationship Diagram)](#10-erd-entity-relationship-diagram)
11. [Desain & Technical Constraints](#11-desain--technical-constraints)
12. [Tech Stack & Instalasi](#12-tech-stack--instalasi)
13. [Development Phases](#13-development-phases)
14. [Out of Scope / Future Development](#14-out-of-scope--future-development)

---

## 1. Overview & Impact Projection

### 1.1 Latar Belakang

Fresh graduate di Indonesia menghadapi tantangan besar dalam memasuki dunia kerja. Berdasarkan data BPS 2024, tingkat pengangguran terbuka lulusan perguruan tinggi mencapai sekitar **13%** — angka yang terus meningkat setiap tahunnya. Penyebab utamanya:

1. **Skill mismatch** — Gap antara skill yang dimiliki fresh grad dengan yang dibutuhkan industri
2. **Ketidakmampuan self-presentation** — Banyak fresh grad tidak tahu cara membuat CV, motivation letter, dan dokumen karir yang baik
3. **Minimnya panduan karir** — Tidak ada alat bantu terintegrasi untuk mempersiapkan diri secara menyeluruh sebelum melamar kerja

**GradReady** hadir sebagai platform web berbasis AI yang membantu fresh graduate untuk:
- Menganalisis CV dan mengidentifikasi skill gap terhadap job role target
- Mendapatkan roadmap belajar yang dipersonalisasi dan terukur
- Membuat semua dokumen karir profesional (CV, motivation letter, cover letter, dll.) dengan bantuan AI
- Memantau perkembangan kesiapan kerja dari waktu ke waktu

### 1.2 Koneksi ke Subtema

GradReady berkontribusi langsung pada **Human Capital & Future Skills Inclusivity** dengan:
- Memastikan kemajuan teknologi (AI) bisa diakses oleh **semua** fresh graduate, termasuk yang tidak punya mentor karir
- Pemerataan akses panduan karir berkualitas yang sebelumnya hanya dimiliki kandidat dari universitas ternama
- Dampak yang terukur: peningkatan CV Score, skill readiness, dan kesiapan melamar

### 1.3 Impact Projection

| Metrik | Target 3 Bulan | Target 12 Bulan |
|--------|---------------|----------------|
| Pengguna terdaftar | 500+ | 5.000+ |
| CV yang dianalisis | 600+ | 6.000+ |
| Dokumen karir di-generate | 1.000+ | 10.000+ |
| Rata-rata peningkatan CV Score | +30 poin | +35 poin |
| Pengguna yang dapat interview setelah pakai platform | 15% | 25% |
| Job role tersedia | 20+ | 50+ |
| Resource belajar terindeks | 200+ | 500+ |

> **Basis kalkulasi:** Dari 500 pengguna bulan pertama, diasumsikan 60% aktif melakukan CV analysis dan skill quiz. Peningkatan CV Score diukur dari delta antara upload pertama vs upload sesudah mengikuti roadmap. Angka "dapat interview" diukur melalui feedback opsional di fitur Saved Jobs / Application Status.

### 1.4 Tagline
> "From Graduate to Ready — One Platform, Every Step."

---

## 2. Target Pengguna & Roles

### 2.1 Roles

| Role | Deskripsi | Akses |
|------|-----------|-------|
| **Guest** | Pengguna yang belum login | Landing page, Job Market Dashboard (read-only), login/register |
| **User** | Fresh graduate yang sudah mendaftar | Semua fitur analisis, builder, roadmap, progress tracker |
| **Admin** | Pengelola platform | Kelola job roles, resources, users, statistik platform |

### 2.2 Karakteristik Pengguna Utama

- Mahasiswa tingkat akhir atau fresh graduate (0–2 tahun pengalaman)
- Aktif mencari pekerjaan di bidang teknologi atau umum
- Dua kemungkinan kondisi: **sudah punya CV** (tapi belum tahu kualitasnya) atau **belum punya CV sama sekali**

---

## 3. Daftar Halaman

### 3.1 Public Pages (Guest)

| No | Halaman | Path | Deskripsi |
|----|---------|------|-----------|
| 1 | Landing Page | `/` | Hero, fitur overview, testimonial, CTA daftar |
| 2 | Job Market Dashboard | `/market` | Tren skill, demand, gaji — read-only |
| 3 | Login | `/login` | Form login email + password |
| 4 | Register | `/register` | Form pendaftaran akun baru |
| 5 | Forgot Password | `/forgot-password` | Reset password via email |

### 3.2 Authenticated Pages (User)

| No | Halaman | Path | Deskripsi |
|----|---------|------|-----------|
| 6 | Dashboard | `/dashboard` | Ringkasan CV Score, readiness %, shortcut fitur, progress |
| 7 | CV Analyzer | `/cv-analyzer` | Upload CV PDF → analisis + skor + feedback |
| 8 | CV Re-check | `/cv-analyzer/recheck` | Upload CV terbaru → bandingkan delta score side-by-side |
| 9 | CV Builder | `/cv-builder` | Buat CV dari nol dengan guided AI (untuk yang belum punya CV) |
| 10 | Skill Gap Detail | `/skill-gap` | Visualisasi skill: hijau (ada) / kuning (perlu ditingkatkan) / merah (belum ada) |
| 11 | Learning Roadmap | `/roadmap` | Timeline belajar per skill, resource, estimasi waktu, progress |
| 12 | AI Career Doc Builder | `/doc-builder` | Hub semua dokumen karir berbasis AI |
| 13 | — Motivation Letter | `/doc-builder/motivation-letter` | Generate motivation letter formal |
| 14 | — Cover Letter | `/doc-builder/cover-letter` | Generate cover letter per perusahaan/posisi |
| 15 | — LinkedIn Summary | `/doc-builder/linkedin` | Generate LinkedIn About section |
| 16 | — Portfolio Description | `/doc-builder/portfolio` | Tulis deskripsi project secara impactful |
| 17 | — Self-Introduction Script | `/doc-builder/self-intro` | Skrip perkenalan diri untuk interview |
| 18 | Mock Interview | `/mock-interview` | Latihan Q&A interview per job role |
| 19 | Job Fit Estimator | `/job-fit` | Paste JD → cek % kesesuaian skill + rekomendasi aksi |
| 20 | Portfolio Checklist | `/checklist` | Checklist kesiapan melamar per job role |
| 21 | Skill Quiz | `/quiz` | Mini kuis validasi skill mandiri per topik |
| 22 | Saved Jobs & Status | `/saved-jobs` | Simpan lowongan + tracking status lamaran |
| 23 | Progress & History | `/history` | Grafik CV Score dari waktu ke waktu, riwayat dokumen |
| 24 | Profile & Settings | `/profile` | Edit data pribadi, target job role, preferensi |

### 3.3 Admin Pages

| No | Halaman | Path | Deskripsi |
|----|---------|------|-----------|
| 25 | Admin Dashboard | `/admin` | Statistik: total user, CV dianalisis, dokumen dibuat |
| 26 | Kelola Job Roles | `/admin/job-roles` | CRUD job role + skill requirements |
| 27 | Kelola Resources | `/admin/resources` | CRUD resource belajar |
| 28 | Kelola Users | `/admin/users` | Lihat dan kelola akun pengguna |

---

## 4. Core Features

### 4.1 CV Analyzer

**Deskripsi:** Pengguna upload CV PDF. AI ekstrak informasi lalu nilai CV berdasarkan format, kelengkapan, dan kesesuaian ATS.

> Fitur ini untuk pengguna yang **sudah memiliki CV**. Yang belum punya diarahkan ke CV Builder (4.3).

**Sub-fitur:**
- Upload CV (PDF only, maks 5MB) via drag-and-drop atau klik
- Ekstraksi: nama, email, skill, pengalaman kerja, pendidikan, sertifikasi
- CV Score (0–100): format & struktur (20%), kata kunci ATS (25%), kelengkapan section (30%), kejelasan bahasa (25%)
- Feedback per section: kekuatan dan kelemahan
- Daftar skill yang terdeteksi
- Tombol "Pilih Job Role Target" untuk lanjut ke Skill Gap

---

### 4.2 CV Re-check

**Deskripsi:** Upload CV versi terbaru setelah perbaikan — lihat peningkatan score secara visual dan terukur (side-by-side comparison).

**Sub-fitur:**
- Upload CV terbaru (PDF)
- Analisis ulang dengan rubrik yang sama
- Tampilan **side-by-side**: Score lama vs Score baru + delta (+/- poin)
- Highlight: section yang membaik, skill baru yang terdeteksi
- Delta score disimpan di riwayat (`/history`)

---

### 4.3 CV Builder dari Nol

**Deskripsi:** Untuk pengguna yang **belum memiliki CV sama sekali**. AI membimbing step-by-step.

> CV Analyzer = evaluasi CV yang sudah ada. CV Builder = buat CV dari kosong.

**Sub-fitur:**
- Wizard 7 step: Data Pribadi → Pendidikan → Pengalaman → Skill → Project → Sertifikasi → Summary
- AI membantu menyempurnakan kalimat di tiap section
- Preview real-time saat mengisi
- 2 pilihan template layout
- Export ke PDF
- Setelah selesai, CV otomatis dianalisis dan mendapat score awal

---

### 4.4 Skill Gap Engine

**Deskripsi:** Bandingkan skill dari CV dengan standar job role yang dipilih.

**Tiga kategori warna:**
- **Hijau** — Skill sudah dimiliki dan memenuhi standar minimum
- **Kuning** — Skill ada tapi perlu ditingkatkan (level belum cukup berdasarkan quiz)
- **Merah** — Skill belum ada di CV sama sekali

**Sub-fitur:**
- Pilihan 20+ job role
- Visualisasi skill map 3 warna
- Prioritasi skill: HIGH / MED / LOW berdasarkan requirement job role
- Persentase kesiapan keseluruhan
- Tombol "Lihat Roadmap" untuk lanjut

---

### 4.5 Learning Roadmap

**Sub-fitur:**
- Timeline per skill (urutan logis: dasar sebelum lanjutan)
- Resource per skill: YouTube, Dicoding, Coursera, freeCodeCamp, dll. (gratis & berbayar)
- Estimasi waktu per skill (misal: "Flutter — ±4 minggu, ~2 jam/hari")
- Tandai resource sebagai selesai → update persentase readiness otomatis
- Filter resource: gratis/berbayar, platform, durasi
- Progress bar per skill dan keseluruhan
- Setelah tandai selesai → sistem sarankan Skill Quiz untuk validasi

---

### 4.6 AI Career Doc Builder

**Deskripsi:** Hub terpusat pembuatan dokumen karir. Semua dokumen menggunakan data profil yang sudah ada di sistem — tidak perlu input ulang data yang sama.

> **Design Decision:** AI Doc Builder selalu auto-fill dari data profil pengguna (skill dari CV Analyzer, pengalaman dari CV Builder, target job role). Pengguna hanya mengisi data tambahan yang belum tersimpan (nama perusahaan, dll.).

#### 4.6.1 Motivation Letter Generator
- Input: nama perusahaan (wajib), posisi (wajib) — data profil auto-fill
- AI generate surat motivasi formal 3–4 paragraf
- Bisa regenerate atau edit manual
- Export PDF / copy teks

#### 4.6.2 Cover Letter Generator
- Input: nama perusahaan, posisi, job description (paste teks)
- AI generate cover letter 1 halaman yang disesuaikan dengan JD dan skill profil
- Export PDF / copy teks

#### 4.6.3 LinkedIn Summary Generator
- Input: target industri, tone (profesional/casual), highlight tambahan (opsional)
- Data skill dan pengalaman auto-fill
- Karakter counter real-time (maks 2.000 karakter)
- Copy langsung ke clipboard

#### 4.6.4 Portfolio Description Writer
- Input: nama project, tech stack, tujuan, dampak
- Dua versi output: teknikal (GitHub/portfolio) dan non-teknikal (LinkedIn/CV)
- Copy langsung

#### 4.6.5 Self-Introduction Script
- Input: target posisi, highlight utama (pre-filled dari profil)
- Dua versi: formal (interview) dan casual (networking/career fair)
- Script 60–90 detik
- Copy langsung

**Riwayat:** Semua dokumen yang pernah di-generate tersimpan di `/history`, bisa dibuka, diedit, dan di-download ulang.

---

### 4.7 Job Market Dashboard

- Top skill yang paling dicari per kategori
- Tren demand job role (naik/turun)
- Range gaji rata-rata per role: Junior / Mid / Senior (IDR)
- Grafik visualisasi (Recharts)
- Bisa diakses tanpa login (Guest)

---

### 4.8 Mock Interview Q&A

- 20–30 pertanyaan per job role (teknikal + behavioral + situasional)
- Contoh jawaban ideal (tersembunyi dulu)
- Mode latihan: soal satu per satu, ketik jawaban → reveal contoh

---

### 4.9 Job Fit Estimator

- Input: teks job description (paste dari LinkedIn, Jobstreet, dll.)
- Output: % kesesuaian, skill match, skill kurang
- Rekomendasi: "Siap melamar" / "Perlu ±X minggu persiapan"
- Tombol "Pelajari skill yang kurang" → Roadmap dengan skill di-highlight
- Tombol "Simpan Lowongan" → masuk ke Saved Jobs dengan status SAVED

---

### 4.10 Skill Verification Quiz

- 5–10 soal multiple choice per skill
- Hasil: persentase benar + level (Beginner / Intermediate / Advanced)
- Otomatis update status skill di Skill Gap:
  - Skor ≥ 80% → Merah/Kuning → **Hijau**
  - Skor 50–79% → tetap **Kuning**
  - Skor < 50% → tetap **Merah**
- Tersimpan di profil, bisa diulang (simpan hasil terbaik)

---

### 4.11 Portfolio Checklist

- Checklist interaktif per job role target
- Contoh item Mobile Developer: GitHub rapi, 2+ project dengan README, CV Score ≥ 70, LinkedIn lengkap, dst.
- Status centang tersimpan per pengguna
- Progress bar keseluruhan
- Setiap item bisa diklik → langsung ke fitur yang relevan

---

### 4.12 Saved Jobs & Application Status Tracker

**Status lamaran (alur):**
```
SAVED → APPLIED → INTERVIEW → OFFERED → ACCEPTED
                     ↓
                  REJECTED
```

**Sub-fitur:**
- Simpan dari Job Fit Estimator atau tambah manual
- Update status per lowongan
- Catatan pribadi per lowongan
- Tampilkan fit score jika berasal dari Job Fit Estimator
- Filter berdasarkan status

---

### 4.13 Progress Tracker & History

- Grafik CV Score dari waktu ke waktu (line chart)
- Persentase Skill Readiness (update otomatis)
- Riwayat semua versi CV (dengan delta score)
- Riwayat semua dokumen yang pernah di-generate
- Readiness Badge (≥ 75%: READY_75, ≥ 90%: READY_90) — bisa di-download/share

---

## 5. User Flow

### 5.1 Flow Utama: Sudah Punya CV

```
Landing Page → Register/Login
    ↓
Dashboard → Onboarding Wizard
    ↓ Step 1: Pilih target job role
    ↓ Step 2: "Sudah punya CV" → Upload ke CV Analyzer
    ↓
Lihat CV Score + Feedback
    ↓
Lihat Skill Gap (hijau/kuning/merah)
    ↓
Lihat Learning Roadmap → mulai belajar
    ↓
Tandai resource selesai → progress update otomatis
    ↓
Ikut Skill Quiz untuk validasi → status skill berubah
    ↓
Perbaiki CV → Upload ulang di CV Re-check → lihat delta score
    ↓
Buat dokumen karir via AI Doc Builder
    ↓
Cek Job Fit Estimator saat ada lowongan menarik
    ↓
Simpan lowongan → update status lamaran di Saved Jobs
    ↓
Dapat Readiness Badge (≥ 75%) → siap melamar
```

### 5.2 Flow Utama: Belum Punya CV

```
Landing Page → Register/Login
    ↓
Dashboard → Onboarding Wizard
    ↓ Step 1: Pilih target job role
    ↓ Step 2: "Belum punya CV" → CV Builder dari Nol
    ↓
Isi wizard 7 step (AI assist per section)
    ↓
Preview & export CV ke PDF
    ↓
CV otomatis dianalisis → dapat score awal
    ↓
(Lanjut sama seperti flow atas dari "Lihat Skill Gap")
```

### 5.3 Flow: CV Re-check

```
Pengguna sudah revisi CV berdasarkan feedback
    ↓
CV Analyzer → klik "Re-check CV Terbaru"
    ↓
Upload CV versi terbaru
    ↓
Sistem analisis ulang
    ↓
Tampil side-by-side: score lama vs baru + delta
    ↓
Highlight: section yang membaik, skill baru terdeteksi
    ↓
Tersimpan di Progress History
```

### 5.4 Flow: AI Career Doc Builder

```
Doc Builder Hub → Pilih jenis dokumen
    ↓
Form input (data profil auto-fill, isi data tambahan saja)
    ↓
Klik "Generate" → AI proses (loading state)
    ↓
Preview hasil di panel kanan
    ↓
Edit manual (opsional) → Export PDF / Copy Teks
    ↓
Dokumen tersimpan otomatis di riwayat
```

### 5.5 Flow: Job Fit Estimator

```
Halaman Job Fit → Paste teks job description
    ↓
Klik "Analisis Kesesuaian" → AI proses
    ↓
Tampil: % kesesuaian, skill match, skill kurang, rekomendasi
    ↓
Opsi A: "Pelajari skill kurang" → Roadmap (skill di-highlight)
Opsi B: "Simpan Lowongan" → Saved Jobs (status: SAVED)
```

---

## 6. Use Case Diagram

```
╔══════════════════════════════════════════════════════════════════╗
║                          GRADREADY                               ║
║                                                                  ║
║  ┌─────────┐                                                     ║
║  │  GUEST  │── UC01: Lihat Landing Page                         ║
║  └─────────┘── UC02: Lihat Job Market Dashboard                 ║
║               ── UC03: Register                                  ║
║               ── UC04: Login                                     ║
║                                                                  ║
║  ┌──────┐                                                        ║
║  │ USER │── UC05: Upload & Analisis CV                           ║
║  └──────┘── UC06: Re-check CV (delta score side-by-side)        ║
║            ── UC07: Buat CV dari Nol (CV Builder)               ║
║            ── UC08: Lihat Skill Gap Analysis                     ║
║            ── UC09: Lihat Learning Roadmap                       ║
║            ── UC10: Tandai Resource Selesai                      ║
║            ── UC11: Generate Motivation Letter                   ║
║            ── UC12: Generate Cover Letter                        ║
║            ── UC13: Generate LinkedIn Summary                    ║
║            ── UC14: Generate Portfolio Description               ║
║            ── UC15: Generate Self-Introduction Script            ║
║            ── UC16: Latihan Mock Interview                       ║
║            ── UC17: Cek Job Fit Estimator                        ║
║            ── UC18: Kerjakan Skill Quiz                          ║
║            ── UC19: Lihat & Update Portfolio Checklist           ║
║            ── UC20: Simpan Lowongan & Update Status Lamaran      ║
║            ── UC21: Lihat Progress History & Badge               ║
║            ── UC22: Edit Profil & Target Job Role                ║
║                                                                  ║
║  ┌───────┐                                                       ║
║  │ ADMIN │── UC23: Kelola Job Roles & Skill Requirements         ║
║  └───────┘── UC24: Kelola Resource Belajar                      ║
║            ── UC25: Lihat Statistik Platform                     ║
║            ── UC26: Kelola Akun Pengguna                         ║
╚══════════════════════════════════════════════════════════════════╝

Relasi include/extend:
- UC08 <<include>> UC05 atau UC07
- UC09 <<include>> UC08
- UC06 <<extend>> UC05
- UC11–UC15 <<extend>> UC05 (Doc Builder pakai data dari CV)
- UC17 <<extend>> UC09 (Job Fit langsung ke Roadmap)
- UC18 <<extend>> UC08 (Quiz update status skill di Skill Gap)
- UC20 <<extend>> UC17 (Simpan lowongan dari Job Fit)
```

---

## 7. Skenario Use Case

### UC05 — Upload & Analisis CV

| Atribut | Detail |
|---------|--------|
| **Aktor** | User |
| **Prekondisi** | User sudah login; sudah memilih target job role di onboarding |
| **Trigger** | User navigasi ke `/cv-analyzer` |

**Alur Normal:**
1. User buka halaman CV Analyzer
2. User drag-and-drop atau klik upload file PDF
3. Sistem validasi format (PDF) dan ukuran (≤ 5MB)
4. Loading state: "AI sedang membaca CV Anda..."
5. AI ekstrak: nama, email, skill, pengalaman, pendidikan, sertifikasi
6. Sistem hitung CV Score (4 aspek)
7. Tampil: Score gauge, breakdown aspek, daftar skill, feedback per section
8. User konfirmasi / pilih job role target
9. Data tersimpan ke `cv_records` dan `cv_score_history`

**Alur Alternatif:**
- 3a. File bukan PDF → error "Format harus PDF"
- 3b. File > 5MB → error "Ukuran maks 5MB"
- 5a. AI gagal parsing → error "Gagal membaca CV. Pastikan PDF bisa dibaca teks, bukan hasil scan foto"
- 8a. User skip job role → data CV tersimpan, reminder muncul di dashboard

---

### UC06 — Re-check CV

| Atribut | Detail |
|---------|--------|
| **Aktor** | User |
| **Prekondisi** | User sudah login; sudah pernah analisis CV minimal 1x |
| **Trigger** | User klik "Re-check CV Terbaru" |

**Alur Normal:**
1. Sistem tampilkan score CV sebelumnya sebagai referensi
2. User upload CV terbaru
3. Validasi file
4. AI analisis CV baru
5. Hitung score baru
6. Tampil side-by-side: score lama vs baru, delta, section yang membaik, skill baru
7. Tersimpan di riwayat

**Alur Alternatif:**
- Belum pernah analisis sebelumnya → redirect ke CV Analyzer biasa

---

### UC07 — Buat CV dari Nol

| Atribut | Detail |
|---------|--------|
| **Aktor** | User (belum punya CV) |
| **Prekondisi** | User sudah login |
| **Trigger** | User pilih "Buat CV dari Nol" di onboarding atau `/cv-builder` |

**Alur Normal:**
1. Wizard 7 step ditampilkan
2. User isi tiap step; AI bantu sempurnakan kalimat saat diminta
3. Preview real-time terupdate
4. User klik "Selesai & Buat CV"
5. CV di-generate + otomatis dianalisis → dapat score awal
6. User export PDF
7. Redirect ke Skill Gap

**Alur Alternatif:**
- User skip step → warning tapi bisa dilanjutkan
- User simpan draft → data tersimpan, bisa dilanjutkan nanti

---

### UC11 — Generate Motivation Letter

| Atribut | Detail |
|---------|--------|
| **Aktor** | User |
| **Prekondisi** | User sudah login |

**Alur Normal:**
1. User buka `/doc-builder/motivation-letter`
2. Form: Nama Perusahaan (wajib), Posisi (wajib) — data profil auto-fill
3. Klik "Generate"
4. AI generate motivation letter (3–4 paragraf, formal, bahasa Indonesia)
5. Preview di panel kanan
6. User bisa regenerate atau edit manual
7. Export PDF / Copy Teks
8. Tersimpan otomatis di riwayat

**Alur Alternatif:**
- Nama Perusahaan kosong → validasi error merah
- AI timeout → error + tombol retry

---

### UC17 — Cek Job Fit Estimator

| Atribut | Detail |
|---------|--------|
| **Aktor** | User |
| **Prekondisi** | User sudah login; memiliki CV yang sudah dianalisis |

**Alur Normal:**
1. User buka `/job-fit`
2. Paste teks job description
3. Klik "Analisis Kesesuaian"
4. AI ekstrak requirement JD vs skill pengguna
5. Tampil: % kesesuaian, skill match (hijau), skill kurang (merah), rekomendasi
6. User bisa klik "Pelajari skill kurang" → Roadmap
7. User bisa klik "Simpan Lowongan" → Saved Jobs (SAVED + fit score)

**Alur Alternatif:**
- Textarea kosong → validasi error
- JD < 50 kata → peringatan kurang akurat
- Belum ada data CV → banner info + bisa tetap lanjut

---

### UC18 — Kerjakan Skill Quiz

| Atribut | Detail |
|---------|--------|
| **Aktor** | User |
| **Prekondisi** | User sudah login; sudah punya target job role |

**Alur Normal:**
1. User pilih skill
2. 5–10 soal multiple choice satu per satu
3. Sistem hitung skor setelah selesai
4. Tampil: persentase, level, update status skill di Skill Gap
5. Tersimpan di `user_skill_progress` (simpan hasil terbaik)

**Alur Alternatif:**
- Keluar di tengah quiz → progress hilang, mulai ulang

---

## 8. Sequence Diagram

### 8.1 CV Analyzer

```
User     Frontend    API Route    AI (NVIDIA NIM)   Database
 │           │            │              │               │
 │─upload──►│            │              │               │
 │           │─POST /cv/upload──────────►               │
 │           │            │─parse PDF───►               │
 │           │            │◄─extracted text─────────────│
 │           │            │─hitung score                │
 │           │            │─POST /cv/save───────────────►
 │           │◄─{score, skills, feedback}────────────────│
 │◄─render──│            │              │               │
```

### 8.2 CV Re-check

```
User     Frontend    API Route    AI (NVIDIA NIM)   Database
 │           │            │              │               │
 │─upload baru──►         │              │               │
 │           │─GET /cv/latest──────────────────────────►│
 │           │            │◄─{old_score}────────────────│
 │           │─POST /cv/recheck──────────►              │
 │           │            │─parse + score CV baru        │
 │           │            │─compare dengan score lama    │
 │           │            │─save versi baru─────────────►│
 │           │◄─{new, old, delta, changes}───────────────│
 │◄─side-by-side──│       │              │               │
```

### 8.3 AI Doc Builder

```
User     Frontend    API Route    AI (NVIDIA NIM)   Database
 │           │            │              │               │
 │─isi form─►│            │              │               │
 │─Generate─►│            │              │               │
 │           │─GET /profile────────────────────────────►│
 │           │◄─{name, skill, exp, role}─────────────────│
 │           │─POST /doc/generate────────►              │
 │           │            │─compose prompt               │
 │           │            │─call NVIDIA NIM API──────────►
 │           │            │◄─generated text──────────────│
 │           │◄─{document_text}──────────│               │
 │◄─preview─│            │              │               │
 │─Export──►│            │              │               │
 │           │─POST /doc/save──────────────────────────►│
 │◄─PDF─────│            │              │               │
```

### 8.4 Job Fit Estimator

```
User     Frontend    API Route    AI (NVIDIA NIM)   Database
 │           │            │              │               │
 │─paste JD─►│            │              │               │
 │─Analisis─►│            │              │               │
 │           │─GET /user/skills────────────────────────►│
 │           │◄─{user_skills}──────────────────────────│
 │           │─POST /jobfit/analyze──────►              │
 │           │            │─ekstrak + compare            │
 │           │            │─call NVIDIA NIM API──────────►
 │           │            │◄─{match, gaps}───────────────│
 │           │◄─{result}──│              │               │
 │◄─render──│            │              │               │
 │─Simpan──►│            │              │               │
 │           │─POST /saved-jobs────────────────────────►│
 │◄─konfirmasi──│         │              │               │
```

### 8.5 Skill Quiz → Update Skill Gap

```
User     Frontend    API Route              Database
 │           │            │                     │
 │─submit──►│            │                     │
 │           │─POST /quiz/submit──────────────►│
 │           │            │─hitung score        │
 │           │            │─update user_skill_progress──►│
 │           │            │─recalculate readiness_pct───►│
 │           │◄─{score, level, new_status}──────│
 │◄─render──│            │                     │
```

---

## 9. Architecture

### 9.1 High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│                 Next.js 15 (App Router, SSR + RSC)               │
│   Landing │ Dashboard │ CV Analyzer │ Skill Gap │ Doc Builder     │
└──────────────────────────┬───────────────────────────────────────┘
                           │ HTTP / REST
┌──────────────────────────▼───────────────────────────────────────┐
│                  API LAYER (Next.js Route Handlers)              │
│   /api/auth │ /api/cv │ /api/skills │ /api/doc │ /api/quiz        │
│   /api/jobfit │ /api/market │ /api/roadmap │ /api/admin           │
└───────────┬─────────────────────┬────────────────────────────────┘
            │                     │
┌───────────▼─────────┐  ┌────────▼──────────────────────────────┐
│     DATABASE         │  │        EXTERNAL SERVICES              │
│   PostgreSQL 16+     │  │  AI: NVIDIA NIM (OpenAI-compatible)    │
│   (via Prisma 7.6)   │  │  PDF Parser: pdfjs-dist               │
└─────────────────────┘  │  PDF Export: @react-pdf/renderer       │
                          │  File Upload: Next.js built-in        │
                          └───────────────────────────────────────┘
```

### 9.2 Alasan Full Next.js (Tanpa Backend Terpisah)

Untuk kompetisi ini, semua API menggunakan **Next.js Route Handlers** agar:
- Satu repo, satu deploy ke Vercel
- Tidak perlu setup CORS
- Prisma langsung dipakai di route handlers
- Lebih efisien waktu pengerjaan

### 9.3 Struktur Folder

```
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                    # Landing
│   │   ├── market/page.tsx             # Job Market Dashboard
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (auth)/
│   │   ├── layout.tsx                  # Auth layout (sidebar + navbar)
│   │   ├── dashboard/page.tsx
│   │   ├── cv-analyzer/
│   │   │   ├── page.tsx                # Upload + analisis
│   │   │   └── recheck/page.tsx        # Re-check + delta
│   │   ├── cv-builder/page.tsx
│   │   ├── skill-gap/page.tsx
│   │   ├── roadmap/page.tsx
│   │   ├── doc-builder/
│   │   │   ├── page.tsx                # Hub
│   │   │   ├── motivation-letter/page.tsx
│   │   │   ├── cover-letter/page.tsx
│   │   │   ├── linkedin/page.tsx
│   │   │   ├── portfolio/page.tsx
│   │   │   └── self-intro/page.tsx
│   │   ├── mock-interview/page.tsx
│   │   ├── job-fit/page.tsx
│   │   ├── checklist/page.tsx
│   │   ├── quiz/page.tsx
│   │   ├── saved-jobs/page.tsx
│   │   ├── history/page.tsx
│   │   └── profile/page.tsx
│   ├── admin/
│   │   ├── page.tsx
│   │   ├── job-roles/page.tsx
│   │   ├── resources/page.tsx
│   │   └── users/page.tsx
│   └── api/
│       ├── auth/[...all]/route.ts      # Better Auth handler
│       ├── cv/
│       │   ├── upload/route.ts
│       │   ├── recheck/route.ts
│       │   └── [id]/route.ts
│       ├── skills/route.ts
│       ├── skillgap/route.ts
│       ├── roadmap/route.ts
│       ├── doc/
│       │   ├── generate/route.ts
│       │   └── history/route.ts
│       ├── jobfit/route.ts
│       ├── quiz/route.ts
│       ├── market/route.ts
│       └── admin/
├── components/
│   ├── ui/                             # Design system (lihat Section 11)
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── Toggle.tsx
│   │   ├── Input.tsx
│   │   └── Tooltip.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   └── features/
│       ├── cv/
│       ├── skill-gap/
│       ├── doc-builder/
│       └── roadmap/
├── lib/
│   ├── auth.ts                         # Better Auth config
│   ├── prisma.ts                       # Prisma client singleton
│   ├── ai.ts                           # NVIDIA NIM wrapper
│   └── pdf.ts                          # PDF utils
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
└── styles/
    └── globals.css                     # Design tokens CSS variables
```

---

## 10. ERD (Entity Relationship Diagram)

```
┌──────────────────┐        ┌───────────────────────┐
│      users       │        │      job_roles         │
├──────────────────┤        ├───────────────────────┤
│ id           PK  │        │ id               PK    │
│ name             │        │ name                   │
│ email       UNIQ │        │ category               │
│ password_hash    │        │ description            │
│ role (USER/ADMIN)│        │ avg_salary_min         │
│ created_at       │        │ avg_salary_max         │
│ updated_at       │        │ demand_level           │
└───────┬──────────┘        │ (HIGH/MEDIUM/LOW)      │
        │                   └──────────┬─────────────┘
        │                              │
┌───────▼──────────┐        ┌──────────▼─────────────┐
│  user_profiles   │        │   job_role_skills       │
├──────────────────┤        ├───────────────────────┤
│ id           PK  │        │ id               PK    │
│ user_id   FK UNIQ│        │ job_role_id      FK    │
│ target_job_id FK │        │ skill_id         FK    │
│ university       │        │ priority_level         │
│ graduation_year  │        │ (HIGH/MED/LOW)         │
│ bio              │        └───────────────────────┘
│ linkedin_url     │
│ github_url       │        ┌───────────────────────┐
│ phone            │        │        skills         │
└───────┬──────────┘        ├───────────────────────┤
        │                   │ id               PK    │
        │                   │ name                   │
        │                   │ category               │
        │                   │ description            │
        │                   └──────────┬─────────────┘
        │                              │
┌───────▼──────────┐        ┌──────────▼─────────────┐
│   cv_records     │        │  learning_resources     │
├──────────────────┤        ├───────────────────────┤
│ id           PK  │        │ id               PK    │
│ user_id      FK  │        │ skill_id         FK    │
│ file_url         │        │ title                  │
│ version_number   │        │ url                    │
│ score            │        │ platform               │
│ parsed_skills    │        │ duration_weeks         │
│ (JSON array)     │        │ is_free                │
│ feedback_json    │        │ created_at             │
│ is_latest (bool) │        └───────────────────────┘
│ created_at       │
└───────┬──────────┘
        │
┌───────▼──────────┐        ┌───────────────────────┐
│ cv_score_history │        │  user_skill_progress   │
├──────────────────┤        ├───────────────────────┤
│ id           PK  │        │ id               PK    │
│ user_id      FK  │        │ user_id          FK    │
│ cv_record_id FK  │        │ skill_id         FK    │
│ score            │        │ status                 │
│ recorded_at      │        │ (RED/YELLOW/GREEN)     │
└──────────────────┘        │ quiz_score             │
                            │ quiz_level             │
┌──────────────────┐        │ (BEGINNER/MID/ADV)     │
│   skill_gaps     │        │ updated_at             │
├──────────────────┤        └───────────────────────┘
│ id           PK  │
│ user_id      FK  │        ┌───────────────────────┐
│ cv_record_id FK  │        │  roadmap_progress      │
│ job_role_id  FK  │        ├───────────────────────┤
│ gap_detail_json  │        │ id               PK    │
│ readiness_pct    │        │ user_id          FK    │
│ created_at       │        │ resource_id      FK    │
└──────────────────┘        │ is_completed           │
                            │ completed_at           │
                            └───────────────────────┘

┌──────────────────┐        ┌───────────────────────┐
│  generated_docs  │        │    saved_jobs          │
├──────────────────┤        ├───────────────────────┤
│ id           PK  │        │ id               PK    │
│ user_id      FK  │        │ user_id          FK    │
│ doc_type         │        │ company_name           │
│ (MOTIVATION/     │        │ position               │
│  COVER/LINKEDIN/ │        │ job_desc_text          │
│  PORTFOLIO/      │        │ fit_score (nullable)   │
│  SELF_INTRO/CV)  │        │ status                 │
│ content_text     │        │ (SAVED/APPLIED/        │
│ input_json       │        │  INTERVIEW/OFFERED/    │
│ created_at       │        │  ACCEPTED/REJECTED)    │
│ updated_at       │        │ notes                  │
└──────────────────┘        │ saved_at               │
                            └───────────────────────┘

┌──────────────────┐        ┌───────────────────────┐
│ readiness_badges │        │   quiz_questions       │
├──────────────────┤        ├───────────────────────┤
│ id           PK  │        │ id               PK    │
│ user_id      FK  │        │ skill_id         FK    │
│ job_role_id  FK  │        │ question_text          │
│ badge_type       │        │ options_json           │
│ (READY_75/       │        │ correct_answer         │
│  READY_90/       │        │ explanation            │
│  FULLY_READY)    │        └───────────────────────┘
│ earned_at        │
└──────────────────┘
```

---

## 11. Desain & Technical Constraints

### 11.1 Design System — Duolingo-Inspired Style (Original)

Platform menggunakan visual style yang **terinspirasi dari Duolingo** — energik, gamifikasi ringan, font bulat, tombol 3D dengan shadow. **Tidak menggunakan aset, maskot, ikon, atau merek milik Duolingo.** Semua elemen visual dibuat original.

---

#### 11.1.1 Navbar (Fixed, 64px)

```
Layout:    [Logo GradReady] | [divider 1px 24px] | [STYLE GUIDE 11px uppercase]
                                        [Colors] [Type] [Buttons] [Cards] [Components]
Spec:
  - height: 64px, background: #FFFFFF, border-bottom: 1px solid var(--border-color)
  - max-width: 1440px, centered
  - Logo: teks "GradReady" dengan font Fredoka One, warna --color-primary
  - Nav links: 13px, bold, uppercase, letter-spacing 0.5px, warna --nav-text
  - Nav link hover: warna hijau, background hijau 8%
  - Nav link active: warna hijau
  - Mobile (≤900px): nav links tersembunyi, hamburger menu
```

---

#### 11.1.2 Color Palette

```css
:root {
  /* Primary */
  --green:         rgb(88, 204, 2);      /* #58CC02 */
  --green-hover:   rgb(75, 178, 0);      /* #4BB200 */
  --green-shadow:  #61B800;

  /* Accent */
  --blue:          rgb(28, 176, 246);    /* #1CB0F6 */
  --dark-blue:     rgb(16, 15, 62);      /* #100F3E */

  /* Semantic */
  --red:           #FF4B4B;
  --orange:        #FF9600;
  --golden:        #FFC800;
  --footer-green:  #4EC604;

  /* Neutral */
  --gray-text:     rgb(75, 75, 75);      /* #4B4B4B */
  --gray-light:    rgb(119, 119, 119);   /* #777777 */
  --nav-text:      rgb(175, 175, 175);   /* #AFAFAF */
  --border-color:  rgb(229, 229, 229);   /* #E5E5E5 */
  --bg-white:      #FFFFFF;
  --bg-secondary:  #F7F7F7;
}
```

Color swatches (12 warna, grid `repeat(auto-fill, minmax(100px, 1fr))`, gap 12px):
1. Green — #58CC02
2. Green Hover — #4BB200
3. Blue — #1CB0F6
4. Dark Blue — #100F3E
5. Red — #FF4B4B
6. Orange — #FF9600
7. Golden — #FFC800
8. Footer Green — #4EC604
9. Gray Text — #4B4B4B
10. Gray Light — #777777
11. Nav Text — #AFAFAF
12. Border — #E5E5E5

---

#### 11.1.3 Typography

```
Primary font  : Nunito (Google Fonts) — weights 400, 500, 600, 700, 800, 900
Display font  : Fredoka One (Google Fonts) — karakter bulat & playful, BUKAN Feather Bold
Font stack    : 'Fredoka One', 'Nunito', -apple-system, BlinkMacSystemFont, sans-serif

Scale:
  Display     : 52px / Fredoka One, warna --green, lowercase
  Heading 1   : 32px / Bold 700, warna --gray-text
  Heading 2   : 28px / Fredoka One, warna --green, lowercase
  Body        : 18px / Medium 500, warna --gray-light, line-height 1.6
  Caption     : 14px / Bold 700, uppercase, --nav-text, letter-spacing 0.5px
  Small       : 12px / Semi 600, warna --gray-light

Section label: 11px, weight 800, uppercase, letter-spacing 2px, warna --nav-text
               dengan garis ::after pseudo-element memanjang ke kanan
```

---

#### 11.1.4 Button Variants

```
Semua button: height 48px (normal) / 36px (small), uppercase, font-weight 700
Active state: box-shadow dihilangkan + translateY(4px)

PRIMARY (green):
  background: var(--green)
  color: #FFFFFF
  border-radius: 12px (normal) / 10px (small)
  box-shadow: 0 4px 0 var(--green-shadow)
  hover: background var(--green-hover)
  font-size: 15px (normal) / 13px (small)
  padding: 0 24px (normal) / 0 16px (small)
  disabled: opacity 0.45, pointer-events none

SECONDARY:
  background: transparent
  border: 2px solid #CFCFCF
  color: var(--blue)
  border-radius: 12px
  box-shadow: 0 4px 0 #CFCFCF
  hover: border-color darken

DANGER:
  background: var(--red)
  color: #FFFFFF
  border-radius: 12px
  box-shadow: 0 4px 0 #CC3C3C

GHOST:
  background: none, border: none, shadow: none
  color: var(--green)
  hover: background rgba(88,204,2,0.08)

DARK THEME PRIMARY (pada dark-blue background):
  background: #FFFFFF
  color: var(--dark-blue)
  box-shadow: 0 4px 0 #88879F
  hover: background #c8f040
```

---

#### 11.1.5 Card Component

```
Light card:
  background: #FFFFFF
  border: 2px solid var(--border-color)
  border-radius: 16px
  hover: transform translateY(-4px), box-shadow 0 12px 32px rgba(0,0,0,0.08)

Dark card (pada dark-blue background):
  background: rgba(255,255,255,0.06)
  border: rgba(255,255,255,0.08)
  title: #FFFFFF
  description: rgba(255,255,255,0.5)
  footer border: rgba(255,255,255,0.08)
  footer text: rgba(255,255,255,0.3)

Card dengan image:
  Image: 120px height, object-fit cover, border-radius top 14px
  Tag badge: diletakkan di atas title
  Title: 16px, bold, --gray-text
  Description: 13px, --gray-light, line-height 1.5
  Footer: border-top 1px --border-color, padding 12px 16px
          left: label kecil uppercase --nav-text, right: action uppercase --blue
```

---

#### 11.1.6 Badge Component

```
Shape: pill (border-radius 20px)
Padding: 4px 10px
Font: 12px, weight 800, uppercase

Variants:
  COMPLETED  : color --green,   background rgba(88,204,2,0.12)
  IN PROGRESS: color --blue,    background rgba(28,176,246,0.12)
  FAILED     : color --red,     background rgba(255,75,75,0.12)
  STREAK     : color --orange,  background rgba(255,150,0,0.12)
  PREMIUM    : color #b8920f,   background rgba(255,200,0,0.15)

  [Dark theme]
  MASTERED   : color #7ADB2E,  background rgba(88,204,2,0.15)
  REVIEW     : color #4DC4F8,  background rgba(28,176,246,0.15)
  CROWN      : color #FFC800,  background rgba(255,200,0,0.15)

Skill gap colors:
  Hijau (skill dimiliki) : var(--green) + background 12% opacity
  Kuning (perlu ditingkatkan): var(--golden) + background 15% opacity
  Merah (belum ada)      : var(--red) + background 12% opacity
```

---

#### 11.1.7 Input Component

```
height: 48px
border: 2px solid var(--border-color)
border-radius: 12px
padding: 0 16px
font-size: 15px, weight 600
placeholder: warna --nav-text, weight 500
focus: border-color var(--blue), outline none
error state: border-color var(--red)
```

---

#### 11.1.8 Toggle Component

```
Track: 48×28px, border-radius 14px
  unchecked: background var(--border-color)
  checked: background var(--green)
  transition: 0.2s

Thumb: 22×22px, background #FFFFFF, border-radius 50%
  position: 3px from edges
  box-shadow: 0 1px 3px rgba(0,0,0,0.15)
  checked: translateX(20px)
```

---

#### 11.1.9 Progress Bar

```
Track: background var(--border-color), height 12px, border-radius 6px, overflow hidden
Fill:
  Default (roadmap): var(--green)
  In progress: var(--blue)
  Low: var(--orange)
  border-radius: 6px
  transition: width 0.6s ease

Label: 12px, bold, 32px wide, right-aligned
```

---

#### 11.1.10 Tooltip

```
Trigger: "Hover me" style — 13px, bold, warna --green, background rgba(88,204,2,0.08)
         padding 8px 16px, border-radius 8px

Bubble (muncul saat hover):
  background: var(--dark-blue)
  color: #FFFFFF, 12px, weight 600
  padding: 6px 12px, border-radius 8px
  arrow: ::after border-trick, 5px, mengarah ke bawah
  position: absolute, di atas trigger
```

---

#### 11.1.11 Streak Counter (Gamifikasi)

```
display: inline-flex, gap 6px
padding: 6px 14px
background: rgba(255,150,0,0.10)
border-radius: 20px
icon: fire symbol 18px
number: 16px, weight 800, color var(--orange)
```

---

#### 11.1.12 Language/Category Pills (Dark Theme)

```
display: inline-flex, gap 6px
padding: 6px 12px, border-radius 12px
border: 2px solid
font: 13px, bold, cursor pointer

Active: border var(--green), background rgba(88,204,2,0.08), color #FFFFFF
Inactive: border rgba(255,255,255,0.12), color rgba(255,255,255,0.7)
hover (inactive): border var(--green), background rgba(88,204,2,0.05)
```

---

#### 11.1.13 Avatar Group

```
Avatars: 36px, border-radius 50%, border 2px #FFFFFF
Overlap: margin-left -8px kecuali yang pertama
Count badge: 36px circle, background #f0f0f0, 11px weight 800, --gray-light
Label: 13px, weight 600, warna rgba(255,255,255,0.5) (dark theme)
```

---

#### 11.1.14 Main Grid Layout

```
2-column grid, no gap, max-width 1440px
Each panel: padding 36px vertical / 40px horizontal
            border-bottom: 1px var(--border-color)
            border-right: 1px var(--border-color)
Even panels: no border-right

Section label per panel: 11px, weight 800, uppercase, letter-spacing 2px, --nav-text
  ::after: flex 1, height 1px, background var(--border-color), margin-left 12px
```

---

#### 11.1.15 Hero Section

```
background: linear-gradient(180deg, rgba(88,204,2,0.08) 0%, #FFFFFF 100%)
padding: 56px 40px 40px, text-align center

Headline: "gradready" — Fredoka One 52px, var(--green), lowercase
Description: 17px, --gray-light, max-width 520px, line-height 1.5

Buttons (stacked atau side-by-side, max-width 280px di mobile):
  Primary "MULAI SEKARANG" — green button spec (lihat 11.1.4)
  Secondary "SUDAH PUNYA AKUN" — secondary button spec
  Spacing antar button: 12px
```

---

#### 11.1.16 Responsive Breakpoints

```
≤900px:
  Grid → single column, no right borders
  Hero h1 → 36px
  Nav links → hidden
  Cards grid → 1 column
  Hero buttons → stacked vertically, max-width 280px

≤600px:
  Hero padding → 40px 20px 32px
  Hero h1 → 28px
  Panel padding → 28px 20px
  Color grid → 3 columns
  Type meta column → hidden
  Display type → 32px
  Button label → hidden
  Input row → column direction
```

---

### 11.2 Technical Constraints

| Constraint | Detail |
|-----------|--------|
| Format upload CV | PDF only, maks 5MB |
| AI provider | NVIDIA NIM — primary `meta/llama-4-maverick-17b-128e-instruct`, fallback `openai/gpt-oss-120b` → `qwen/qwen3-next-80b-a3b-instruct` |
| AI response timeout | 30 detik; tampilkan loading state yang jelas |
| Editabilitas dokumen AI | Semua output AI bisa diedit manual |
| Retensi file CV | PDF tidak disimpan > 24 jam; hanya teks hasil parsing yang disimpan |
| Rate limit AI | Maks 10 AI request/menit per user |
| Koneksi antar fitur | Doc Builder selalu auto-fill dari data profil; tidak minta input ulang |
| Mobile responsive | Breakpoint: 900px (tablet), 600px (mobile) |
| Aksesibilitas | WCAG 2.1 Level AA minimal |
| Browser support | Chrome, Firefox, Safari, Edge (2 versi terbaru) |

---

## 12. Tech Stack & Instalasi

### 12.1 Stack Lengkap

| Layer | Teknologi | Versi |
|-------|-----------|-------|
| Framework | Next.js | 15.1.8 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.1 |
| Database | PostgreSQL | 16+ |
| ORM | Prisma | 7.6.0 |
| Auth | Better Auth | 1.3.x |
| Form | React Hook Form | 7.66.0 |
| Validation | Zod | 4.0.1 |
| Charts | Recharts | 3.3.0 |
| AI | NVIDIA NIM | via OpenAI-compatible REST (`fetch`) |
| PDF Parser | `pdfjs-dist` | latest |
| PDF Export | `@react-pdf/renderer` | latest |
| AI Vibe Coding | vercel-labs/skills | via `npx skills add` |
| Deployment | Vercel (FE + API) + Railway/Supabase (DB) | — |

---

### 12.2 Panduan Instalasi

#### Step 0 — Init Project

```bash
# Buat project Next.js 15
npx create-next-app@latest gradready
# Pilih: TypeScript ✓ | ESLint ✓ | Tailwind CSS ✓ | src/ ✓ | App Router ✓ | Turbopack ✓

cd gradready
```

#### Step 0b — Install Skills dari vercel-labs/skills

> **PENTING:** Install skills ini di awal sebelum mulai coding. AI (Antigravity) **WAJIB menggunakan skills yang relevan** saat mengerjakan fitur — bukan hanya diinstall lalu diabaikan.

```bash
# Install skill finder dulu
npx skills add https://github.com/vercel-labs/skills --skill find-skills

# Setelah itu, cari dan install skills yang dibutuhkan untuk project ini.
# Jalankan perintah berikut untuk menemukan skills yang relevan:
npx find-skills "Next.js authentication form validation"
npx find-skills "AI API integration TypeScript"
npx find-skills "PDF parsing upload file"
npx find-skills "PostgreSQL Prisma ORM"
npx find-skills "data visualization charts React"

# Install semua skills yang relevan dari hasil find-skills di atas.
# Contoh (sesuaikan dengan hasil find-skills):
# npx skills add https://github.com/vercel-labs/skills --skill nextjs-auth
# npx skills add https://github.com/vercel-labs/skills --skill prisma-postgres
# dst — ikuti output find-skills
```

> **Cara penggunaan skills saat coding:**
> - Saat mengerjakan fitur auth → gunakan skill nextjs-auth (atau yang relevan dari hasil find-skills)
> - Saat membuat form dengan validasi → gunakan skill form-validation
> - Saat integrasi AI API → gunakan skill ai-integration
> - Saat setup Prisma → gunakan skill prisma-postgres
> - Skills memberikan best practice dan boilerplate yang sudah teruji — **SELALU gunakan jika tersedia**

#### Step 1 — Tailwind CSS v4

```bash
# Tailwind v4 sudah otomatis via create-next-app, pastikan versinya:
npm install tailwindcss@latest @tailwindcss/postcss@latest

# postcss.config.js:
# export default { plugins: ["@tailwindcss/postcss"] }

# globals.css — TIDAK pakai tailwind.config.js lagi di v4:
# @import "tailwindcss";
# /* lalu tambahkan CSS custom properties dari Section 11.1.2 */
```

#### Step 2 — Database & ORM

```bash
npm install prisma@latest @prisma/client@latest
npx prisma init

# .env:
# DATABASE_URL="postgresql://user:password@localhost:5432/gradready"

# Setelah schema dibuat (lihat ERD Section 10):
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed      # untuk data awal
```

#### Step 3 — Authentication

```bash
npm install better-auth

# lib/auth.ts:
# import { betterAuth } from "better-auth"
# import { prismaAdapter } from "better-auth/adapters/prisma"
# import { PrismaClient } from "@/generated/prisma/client"
#
# const prisma = new PrismaClient()
# export const auth = betterAuth({
#   database: prismaAdapter(prisma, { provider: "postgresql" }),
#   emailAndPassword: { enabled: true },
# })

# Route handler — app/api/auth/[...all]/route.ts:
# import { auth } from "@/lib/auth"
# import { toNextJsHandler } from "better-auth/next-js"
# export const { POST, GET } = toNextJsHandler(auth)
```

#### Step 4 — Form & Validation

```bash
npm install react-hook-form @hookform/resolvers
npm install zod@latest

# Zod v4 — cara import BERUBAH dari v3:
# import * as z from "zod"   ← v4
# const schema = z.object({
#   email: z.string().email(),
#   password: z.string().min(8),
# })
```

#### Step 5 — AI dengan NVIDIA NIM

```bash
# NVIDIA NIM is OpenAI-compatible — no SDK needed, pakai fetch bawaan.

# lib/ai.ts (ringkas):
# const NIM_BASE = 'https://integrate.api.nvidia.com/v1'
#
# export async function callAI(prompt: string): Promise<string> {
#   const res = await fetch(`${NIM_BASE}/chat/completions`, {
#     method: 'POST',
#     headers: {
#       Authorization: `Bearer ${process.env.NVIDIA_NIM_API_KEY}`,
#       'Content-Type': 'application/json',
#     },
#     body: JSON.stringify({
#       model: 'meta/llama-4-maverick-17b-128e-instruct',
#       messages: [{ role: 'user', content: prompt }],
#       response_format: { type: 'json_object' },
#     }),
#   })
#   const data = await res.json()
#   return data.choices[0].message.content ?? ''
# }
#
# // Fallback chain bila primary gagal/rate-limited:
# // 'openai/gpt-oss-120b' → 'qwen/qwen3-next-80b-a3b-instruct'

# .env:
# NVIDIA_NIM_API_KEY="nvapi-..."
```

> **Catatan NVIDIA NIM:**
> - Endpoint OpenAI-compatible (`/v1/chat/completions`) — bisa pakai `fetch` atau OpenAI SDK
> - Mendukung `response_format: { type: 'json_object' }` untuk output JSON yang terjamin valid
> - Model terpilih (Llama-4 Maverick / GPT-OSS-120B / Qwen3-Next) stabil, cepat, output English murni tanpa karakter asing
> - Fallback chain otomatis menangani rate limit / model down
> - Daftar di build.nvidia.com dan dapatkan API key (`nvapi-...`)

#### Step 6 — PDF & Charts

```bash
# PDF Parser
npm install pdfjs-dist

# PDF Export
npm install @react-pdf/renderer

# Charts
npm install recharts@latest
```

#### Step 7 — Install Semua Sekaligus

```bash
npm install \
  better-auth \
  @prisma/client \
  react-hook-form \
  @hookform/resolvers \
  zod \
  recharts \
  pdfjs-dist \
  @react-pdf/renderer

npm install -D \
  prisma \
  @types/node \
  @types/react \
  @types/react-dom
```

#### Step 8 — Environment Variables

```bash
# .env.local
DATABASE_URL="postgresql://user:password@localhost:5432/gradready"
NVIDIA_NIM_API_KEY="nvapi-xxxxxxxxxxxxxxxx"
BETTER_AUTH_SECRET="random-secret-32-chars-minimum"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 13. Development Phases

> **Instruksi untuk AI (Antigravity):**
> - Kerjakan **satu fase pada satu waktu**
> - Jangan lanjut ke fase berikutnya sebelum semua deliverable fase sebelumnya terverifikasi
> - **WAJIB** jalankan `npx find-skills` untuk tiap fitur baru sebelum mulai coding
> - **WAJIB** gunakan skill yang ditemukan dari find-skills jika relevan
> - Gunakan versi library yang tertera di Section 12
> - Ikuti struktur folder di Section 9.3
> - Ikuti semua spec design system di Section 11.1 (warna, font, komponen) — jangan improvisasi style

---

### Phase 0 — Project Setup & Design System
**Estimasi:** 1–2 hari | **Prioritas:** Kritis

**Tasks:**
1. Init project Next.js 15 (ikuti Step 0 di Section 12.2)
2. **Jalankan `npx skills add` dan `npx find-skills` untuk setup** (ikuti Step 0b)
3. Install semua dependencies (ikuti Step 7)
4. Setup struktur folder sesuai Section 9.3
5. Buat `globals.css`:
   - `@import "tailwindcss";`
   - Semua CSS custom properties dari Section 11.1.2
   - Import font Nunito + Fredoka One dari Google Fonts di `layout.tsx`
6. Setup `postcss.config.js` untuk Tailwind v4
7. Buat file `prisma/schema.prisma` sesuai ERD Section 10 (belum migrate)
8. Implementasi seluruh design system components (Section 11.1):
   - `Button` — primary, secondary, danger, ghost + ukuran normal/small + disabled + dark theme variant
   - `Card` — light & dark variant (dengan dan tanpa image)
   - `Badge` — semua status + skill gap color coding
   - `ProgressBar` — transisi 0.6s, semua color variant
   - `Input` — text, textarea, error state
   - `Toggle` — checked state + animasi 0.2s
   - `Tooltip` — hover trigger + bubble dengan arrow
   - `StreakCounter` — gamifikasi element
9. Buat halaman `/_design` (tidak masuk production) untuk preview semua komponen
10. Setup `.env.local` dengan semua environment variables dari Step 8
11. Setup ESLint + Prettier

**Deliverable:**
- [ ] `npm run dev` berjalan tanpa error
- [ ] Halaman `/_design` menampilkan semua komponen sesuai spec Section 11.1
- [ ] Font Fredoka One tampil untuk heading/display
- [ ] Font Nunito tampil untuk body text
- [ ] Semua CSS variables terdefinisi dengan nilai yang benar
- [ ] Warna tombol primary sesuai (hijau #58CC02 dengan shadow #61B800)
- [ ] Tombol memiliki efek 3D (translateY + shadow) saat di-klik

---

### Phase 1 — Database, Auth & Onboarding
**Estimasi:** 2 hari | **Prioritas:** Kritis

**Tasks:**
1. Jalankan `npx find-skills "Next.js Better Auth PostgreSQL Prisma"` — gunakan skill yang ditemukan
2. Jalankan `npx prisma migrate dev --name init` untuk create semua tabel
3. Buat `prisma/seed.ts`:
   - 5 job roles: Mobile Developer, Frontend Developer, Backend Developer, Data Analyst, UI/UX Designer
   - Skill requirements per job role dengan prioritas HIGH/MED/LOW
   - 1 admin account
4. Jalankan `npx prisma db seed`
5. Setup Better Auth (ikuti Step 3 di Section 12.2)
6. Buat route handler `app/api/auth/[...all]/route.ts`
7. Buat halaman `/login` — form email + password, validasi Zod v4, styling sesuai Section 11.1
8. Buat halaman `/register` — form nama, email, password, konfirmasi password
9. Buat halaman `/forgot-password`
10. Buat `middleware.ts` untuk proteksi route group `(auth)/`
11. Buat layout `(auth)/layout.tsx` dengan Navbar + Sidebar
12. Buat halaman `/dashboard` — skeleton kosong dengan layout lengkap
13. Buat onboarding wizard 3 step:
    - Step 1: Pilih target job role (dari data seed)
    - Step 2: Isi universitas + tahun lulus
    - Step 3: Fork — "Sudah punya CV" → `/cv-analyzer` atau "Belum punya CV" → `/cv-builder`
14. Simpan pilihan ke `user_profiles`

**Deliverable:**
- [ ] Register, login, logout berjalan
- [ ] Route `/dashboard` redirect ke login jika belum auth
- [ ] Onboarding wizard tampil untuk user baru, pilihan tersimpan ke DB
- [ ] DB memiliki 5 job roles dari seed
- [ ] Styling login/register page sesuai design system (font Nunito, warna dari palette)

---

### Phase 2 — CV Analyzer & CV Re-check
**Estimasi:** 2–3 hari | **Prioritas:** Kritis

**Tasks:**
1. Jalankan `npx find-skills "PDF parsing file upload TypeScript"` — gunakan skill yang ditemukan
2. Jalankan `npx find-skills "AI API integration prompt engineering"` — gunakan skill yang ditemukan
3. Setup PDF parsing: buat `lib/pdf.ts` dengan `extractTextFromPDF(buffer: Buffer): Promise<string>`
4. Setup NVIDIA NIM: buat `lib/ai.ts` dengan wrapper `callAI(prompt: string): Promise<string>` (ikuti Step 5 di Section 12.2)
5. Buat prompt template untuk CV parsing (ekstrak: nama, skill, pengalaman, pendidikan, sertifikasi)
6. Buat algoritma CV Score (0–100):
   - Format & Struktur: 20 poin (heading jelas, section terorganisir)
   - Kata Kunci ATS: 25 poin (keyword sesuai job role)
   - Kelengkapan Section: 30 poin (summary, exp, edu, skill, contact semua ada)
   - Kejelasan Bahasa: 25 poin (kalimat aktif, jelas, tidak typo)
7. Buat API route `POST /api/cv/upload` — validasi, parse, score, simpan ke `cv_records` + `cv_score_history`
8. Buat API route `GET /api/cv/latest` — ambil CV terbaru user
9. Buat API route `POST /api/cv/recheck` — analisis ulang + bandingkan dengan score sebelumnya
10. Buat halaman `/cv-analyzer`:
    - Area drag-and-drop + klik (border dashed, warna hijau saat drag)
    - Loading state animatif: "AI sedang membaca CV Anda..."
    - Score gauge visual (0–100), breakdown 4 aspek (progress bar per aspek)
    - Daftar skill terdeteksi (badge hijau per skill)
    - Feedback per section (card dengan icon, warna sesuai status)
    - Tombol "Lanjut ke Skill Gap"
    - Styling sesuai Section 11.1 (card, badge, progress bar)
11. Buat halaman `/cv-analyzer/recheck`:
    - Tampilkan score CV sebelumnya di panel kiri
    - Area upload CV baru
    - Side-by-side: score lama vs baru + delta badge (warna hijau jika +, merah jika -)
    - Highlight: section yang membaik, skill baru yang muncul

**Deliverable:**
- [ ] Upload PDF berhasil, teks terekstrak
- [ ] CV Score muncul (0–100) dan terasa reasonable
- [ ] Feedback per section tampil
- [ ] Re-check menampilkan delta score side-by-side dengan benar
- [ ] Design sesuai: card, badge, progress bar menggunakan warna palette yang benar

---

### Phase 3 — Skill Gap & Learning Roadmap
**Estimasi:** 2 hari | **Prioritas:** Kritis

**Tasks:**
1. Jalankan `npx find-skills "data visualization React progress tracking"` — gunakan skill yang ditemukan
2. Seed tambahan: 20+ skill per kategori, 30+ resource belajar per skill
3. Buat API route `POST /api/skillgap/analyze`:
   - Bandingkan `parsed_skills` dari CV dengan `job_role_skills`
   - Status: GREEN (ada & cukup), YELLOW (ada tapi perlu ditingkatkan), RED (belum ada)
   - Hitung `readiness_pct`
   - Simpan ke `skill_gaps` + `user_skill_progress`
4. Buat API route `GET /api/roadmap/:userId` — return skill belum GREEN + resources, urut prioritas
5. Buat halaman `/skill-gap`:
   - Skill map dengan 3 warna: hijau/kuning/merah (sesuai spec badge Section 11.1.6)
   - Legenda warna yang jelas
   - Persentase kesiapan keseluruhan (progress bar besar)
   - Tombol "Lihat Roadmap Belajar"
6. Buat halaman `/roadmap`:
   - Card per skill (urut HIGH → MED → LOW)
   - Per card: nama skill (badge warna), estimasi waktu, daftar resource + link
   - Toggle per resource "Tandai Selesai" (gunakan Toggle component dari design system)
   - Progress bar keseluruhan roadmap
   - Filter resource (gratis/berbayar) menggunakan pill component dari Section 11.1.12

**Deliverable:**
- [ ] Skill gap menampilkan 3 kategori warna dengan benar
- [ ] Warna badge skill sesuai: hijau=#58CC02, kuning=#FFC800, merah=#FF4B4B
- [ ] Roadmap menampilkan resource sesuai skill yang kurang
- [ ] Toggle selesai berhasil update progress dan persentase berubah

---

### Phase 4 — AI Career Doc Builder
**Estimasi:** 3–4 hari | **Prioritas:** Tinggi

**Tasks:**
1. Jalankan `npx find-skills "AI text generation document builder"` — gunakan skill yang ditemukan
2. Jalankan `npx find-skills "PDF generation React export"` — gunakan skill yang ditemukan
3. Buat API route `POST /api/doc/generate`:
   - Fetch profil user dari DB (nama, skill, pengalaman, target role)
   - Compose prompt sesuai `doc_type` — **data profil SELALU disertakan otomatis**
   - Call NVIDIA NIM AI (`meta/llama-4-maverick-17b-128e-instruct`)
   - Simpan ke `generated_docs`
   - Return generated text
4. Buat API route `GET /api/doc/history` + `PUT /api/doc/:id`
5. Setup PDF export dengan `@react-pdf/renderer`
6. Buat halaman `/doc-builder` — hub dengan card 6 jenis dokumen:
   - Setiap card menampilkan: nama dokumen, deskripsi singkat, jumlah yang sudah dibuat
   - Menggunakan Card component dari design system
7. Buat halaman `/doc-builder/motivation-letter`:
   - Layout 2 kolom: form kiri, preview kanan
   - Auto-fill data profil (nama, skill, pengalaman, target role)
   - Field wajib: Nama Perusahaan, Posisi
   - Loading state saat AI generate
   - Preview editable (textarea atau rich text)
   - Tombol: Regenerate, Export PDF, Copy Teks
8. Buat halaman `/doc-builder/cover-letter` — sama + field Job Description (textarea)
9. Buat halaman `/doc-builder/linkedin` — form + karakter counter real-time + copy button
10. Buat halaman `/doc-builder/portfolio` — form + dua output (teknikal + non-teknikal)
11. Buat halaman `/doc-builder/self-intro` — form + dua output (formal + casual)
12. Buat halaman `/cv-builder` — wizard 7 step + AI assist + preview + export PDF

**Deliverable:**
- [ ] Semua 5 jenis dokumen di Doc Builder bisa di-generate
- [ ] Data profil auto-fill di semua form tanpa user input ulang
- [ ] Export PDF menghasilkan file yang bisa dibuka
- [ ] Dokumen tersimpan di riwayat
- [ ] Loading state muncul saat AI generate (tidak blank)
- [ ] CV Builder wizard 7 step berjalan dan menghasilkan export PDF

---

### Phase 5 — Supporting Features
**Estimasi:** 2–3 hari | **Prioritas:** Menengah

**Job Market Dashboard (`/market`):**
1. Jalankan `npx find-skills "Recharts data visualization Next.js"` — gunakan skill yang ditemukan
2. Seed data: top skills, demand level, range gaji per role
3. API route `GET /api/market/overview`
4. Halaman `/market` dengan Recharts (LineChart tren + BarChart gaji) — bisa diakses tanpa login
5. Pastikan menggunakan warna palette (--green, --blue, --orange) untuk chart colors

**Mock Interview (`/mock-interview`):**
6. Seed 20 pertanyaan per 5 job role
7. Halaman `/mock-interview`: pilih job role → soal satu per satu → reveal jawaban

**Job Fit Estimator (`/job-fit`):**
8. API route `POST /api/jobfit/analyze` (ikuti Sequence Diagram 8.4)
9. Halaman `/job-fit`: textarea JD, hasil analisis (gauge + skill badge), tombol ke roadmap + simpan

**Portfolio Checklist (`/checklist`):**
10. Seed checklist per job role (5–8 item)
11. API route `GET/PUT /api/checklist`
12. Halaman `/checklist`: checklist interaktif + progress bar + link ke fitur relevan per item
13. Gunakan Toggle component dari design system untuk setiap item checklist

**Skill Quiz (`/quiz`):**
14. Seed 5–10 soal per skill (5 skill paling umum)
15. API route `POST /api/quiz/submit` — hitung score, update `user_skill_progress`
16. Halaman `/quiz`: pilih skill → soal → hasil + update status skill di Skill Gap

**Saved Jobs (`/saved-jobs`):**
17. API route `POST/GET/PUT /api/saved-jobs`
18. Halaman `/saved-jobs`: tabel lowongan + status badge + tombol update + notes
19. Status badge menggunakan Badge component: SAVED (muted), APPLIED (blue), INTERVIEW (orange), ACCEPTED (green), REJECTED (red)

**Deliverable:**
- [ ] Job Market Dashboard tampil dengan grafik dan accessible tanpa login
- [ ] Mock Interview berjalan flow soal per soal
- [ ] Job Fit menghasilkan persentase kesesuaian
- [ ] Skill Quiz mengupdate status skill di Skill Gap setelah selesai
- [ ] Saved Jobs bisa tambah dan update status dengan badge warna yang benar
- [ ] Semua halaman menggunakan design system yang konsisten

---

### Phase 6 — Dashboard Lengkap, Progress & Gamifikasi
**Estimasi:** 1–2 hari | **Prioritas:** Menengah

**Tasks:**
1. Jalankan `npx find-skills "Recharts line chart history tracking"` — gunakan skill yang ditemukan
2. Update halaman `/dashboard`:
   - CV Score terbaru dengan gauge/progress bar besar (warna --green)
   - Skill Readiness % (progress bar dengan warna sesuai persentase)
   - Jumlah resource roadmap selesai / total
   - Dokumen karir terbaru (card list dengan doc_type badge)
   - Shortcut grid ke semua fitur utama (card dengan icon)
   - StreakCounter component jika ada streak belajar
3. Buat halaman `/history`:
   - Recharts LineChart CV Score dari waktu ke waktu (warna --green untuk line)
   - Tabel semua versi CV (dengan delta score badge)
   - Tabel semua dokumen yang pernah di-generate (dengan doc_type badge)
4. Readiness Badge logic:
   - Cek `readiness_pct` setiap kali quiz atau roadmap progress diupdate
   - ≥ 75% → create READY_75 badge
   - ≥ 90% → create READY_90 badge
   - Tampilkan badge di Dashboard dan Profile (badge golden/green sesuai level)
5. Buat halaman `/profile`:
   - Edit nama, bio, LinkedIn URL, GitHub URL
   - Ganti target job role (dengan warning: akan reset skill gap)
   - Tampilkan semua badge yang earned

**Deliverable:**
- [ ] Dashboard menampilkan semua data ringkasan
- [ ] Grafik CV Score di `/history` tampil dengan data riwayat
- [ ] Badge muncul di dashboard saat readiness ≥ 75%
- [ ] Semua badge menggunakan style golden/green sesuai Section 11.1.6

---

### Phase 7 — Admin Panel
**Estimasi:** 1–2 hari | **Prioritas:** Rendah

**Tasks:**
1. Middleware check role admin di semua API routes `/admin/*`
2. Halaman `/admin` — statistik: total user, CV dianalisis, dokumen dibuat, quiz dikerjakan
3. Halaman `/admin/job-roles` — CRUD job role + skill requirements (tabel + form)
4. Halaman `/admin/resources` — CRUD resource belajar
5. Halaman `/admin/users` — tabel user + info + tombol nonaktifkan

**Deliverable:**
- [ ] Halaman admin tidak bisa diakses role USER
- [ ] Admin bisa CRUD job role dan resource
- [ ] Statistik menampilkan angka yang akurat

---

### Phase 8 — Polish, Responsive & Deploy
**Estimasi:** 2–3 hari | **Prioritas:** Kritis untuk demo

**Tasks:**
1. Jalankan `npx find-skills "responsive design mobile Next.js"` — gunakan skill yang ditemukan
2. Audit responsiveness semua halaman (breakpoint 900px dan 600px sesuai Section 11.1.16)
3. Loading skeleton untuk semua fetch data
4. Toast notification untuk semua aksi (sukses = hijau, error = merah, sesuai palette)
5. Empty state informatif di semua halaman
6. Error boundary
7. Review konsistensi: semua halaman pakai font Nunito/Fredoka One, warna dari palette, komponen dari design system
8. Testing manual semua user flow (ikuti Section 5)
9. Seed data demo:
   - 1 akun demo dengan CV sudah dianalisis, skill gap sudah terhitung, beberapa dokumen sudah di-generate, beberapa resource sudah ditandai selesai, 1–2 lowongan di saved jobs
10. Deploy ke Vercel + DB di Railway/Supabase
11. Set semua environment variables di Vercel dashboard
12. Test semua fitur di production sebelum presentasi

**Deliverable:**
- [ ] Semua halaman tampil baik di mobile (600px) — tidak ada overflow, font readable
- [ ] Tidak ada halaman blank saat loading
- [ ] Demo account siap dengan data lengkap
- [ ] Deployed dan accessible via URL
- [ ] Flow CV Upload → Skill Gap → Roadmap → Doc Builder berjalan tanpa error di production

---

## 14. Out of Scope / Future Development

Fitur-fitur berikut tidak masuk scope kompetisi namun bisa disebutkan sebagai visi jangka panjang saat presentasi juri untuk memperkuat impact projection.

| Fitur | Potensi Impact |
|-------|---------------|
| **Community Forum** | Pengguna sharing pengalaman interview per perusahaan |
| **Success Stories** | Motivasi bagi pengguna yang baru mulai |
| **Company Culture Preview** | Membantu pilih perusahaan sesuai values |
| **Mentor Connect** | Akses ke mentorship profesional berpengalaman |
| **LinkedIn Profile Import** | Onboarding lebih cepat via OAuth |
| **AI Mock Interview (Voice)** | Simulasi interview dengan speech-to-text |
| **Job Scraper Integration** | Tidak perlu paste JD manual ke Job Fit Estimator |
| **Application Status Analytics** | Dashboard insight: berapa persen CV yang direspon, dll. |

---

*Dokumen ini merupakan PRD untuk kompetisi Web Development I/O Festival 2026.*  
*Platform GradReady — Subtema: Human Capital & Future Skills Inclusivity.*  
*"From Graduate to Ready — One Platform, Every Step."*
