# AI Agent Prompt: Portfolio Website Content Update
## Target: https://portfolio-bima-eosin.vercel.app/
---

## CONTEXT & OBJECTIVE

You are updating a personal portfolio website for **Bima Aryadinata**, a fresh Informatics Engineering graduate (GPA 3.93/4.00) currently working as an IT Support intern at PT ASABRI (Persero) in Jakarta. The site is already deployed on Vercel. The visual design, layout, animations, and navigation structure are **already complete and must not be changed**. Your only task is to **replace all dummy/placeholder content with the real data provided in this prompt**, and fix the broken profile image.

Do NOT touch: color schemes, fonts, layout CSS, animation logic, component structure, or navigation.
DO change: all text content, project data, skills data, and the profile image path.

---

## STEP 1 — UNDERSTAND THE CODEBASE

Before writing any code, you must:
1. Read the full file tree of the project
2. Identify the framework in use (likely vanilla HTML/CSS/JS or a static site)
3. Locate where content data is stored — it may be:
   - Hardcoded in HTML files
   - In a `data.js` / `content.js` / `config.js` file
   - In JSON files
   - As JavaScript objects inside component files
4. Identify which file controls the profile image
5. Map each section (About, Education, Projects, Experience, Skills, Contact) to its source file

---

## STEP 2 — PROFILE IMAGE FIX

The profile image is currently broken (returns empty). Fix it by:
- Checking what path is currently used for the image `src`
- The image filename should be a professional photo of Bima. If no image file exists in the repo, add a placeholder that loads from a URL or a local asset
- The `alt` text should be: `"Bima Aryadinata — Informatics Engineer"`
- If there is an existing image upload mechanism, document the correct path so the user can drop in their photo

---

## STEP 3 — HERO / INTRO SECTION

**Current (dummy):** Generic placeholder text

**Replace with:**
- **Name:** Bima Aryadinata
- **Tagline / Role:** `Full-Stack Developer & IT Communicator`
- **Subtitle / One-liner:** `Building AI-powered internal tools and enterprise digital systems for corporate-scale operations at PT ASABRI (Persero), Jakarta.`
- **Location badge:** `Jakarta, Indonesia`
- **Status badge:** `Available for hire`
- **CTA Buttons:**
  - Primary: `View Projects` → scrolls to #projects
  - Secondary: `Download CV` → links to a hosted PDF (user will provide URL after uploading)

---

## STEP 4 — ABOUT SECTION

Replace dummy text with this exact narrative (keep it as flowing prose, do not convert to bullet points):

> "I'm an Informatics Engineering graduate from Universitas Sriwijaya (GPA 3.93/4.00) with a strong interest in building systems that actually solve real organizational problems—not just demo apps. Currently, I'm working as an IT Support intern at PT ASABRI (Persero) in Jakarta, where I function as a full-stack developer building internal tools for the Corporate Communications and Corporate Secretary divisions.
>
> My work spans the full stack: from architecting NestJS backends and PostgreSQL schemas to building React frontends and integrating AI models. I've shipped 6 production-grade internal systems solo, including a media intelligence platform powered by a fine-tuned IndoBERT model, a corporate project and budget management system, and a digital document archiving system.
>
> Outside of engineering, I have a background in organizational leadership—leading a 29-member content team as Head of Information & Communication at BEM Universitas Sriwijaya—and in visual design, having worked as a remote Visual Designer for GaoTek Company on international marketing campaigns."

---

## STEP 5 — EDUCATION SECTION

Replace dummy education data with:

```
Institution:  Universitas Sriwijaya
Degree:       Bachelor of Informatics Engineering (S.Kom.)
Location:     Palembang, Indonesia
Period:       2021 – 2025
GPA:          3.93 / 4.00
Highlights:
  - Elected as Cohort Leader for the Informatics Engineering Class of 2021
  - Relevant courses: User Interface Design, Database Systems (SQL), Web Development, Cloud Computing
```

---

## STEP 6 — PROJECTS SECTION

The projects section must display all 6 projects. Each project card must include: title, short description, tech stack tags, and a role label. Use the data below exactly. Display order: MedMon first, then ROCKET, DRMS, COMMANDO, Budget Tracker, WhatsApp Assistant.

---

### Project 1
```
title:       MedMon & Sentiment Analyzer AI
role:        AI & Backend Developer (Solo)
description: An end-to-end AI-powered media intelligence platform that scrapes national Indonesian news and classifies sentiment using a fine-tuned IndoBERT model. Achieved 91.38% test accuracy and F1 Macro ~0.896 across 3 sentiment classes (POSITIVE / NEUTRAL / NEGATIVE). Fully automated the pipeline from scraping to dashboard display for PT ASABRI's Corporate Secretary division.
tags:        [Python, Streamlit, HuggingFace, IndoBERT, Node.js, Crawlee, Supabase, PostgreSQL]
highlight:   91.38% Test Accuracy · F1 Macro ~0.896
status:      Production (Internal)
```

### Project 2
```
title:       ROCKET — Corporate Project & Budget Management System
role:        Full-Stack Developer (Solo)
description: An integrated enterprise platform for PT ASABRI's Communications team to manage projects and track budget absorption in real-time. Features a multi-level approval workflow (Staff → Kabid → GM), role-based access control, and automated PDF report generation. Replaced manual spreadsheet-based tracking across the entire division.
tags:        [React, NestJS, Prisma, PostgreSQL, Redis, Puppeteer, Tailwind CSS, Ant Design]
status:      Production (Internal)
```

### Project 3
```
title:       DRMS — Document Records Management System
role:        Backend & Architecture (Solo)
description: A comprehensive digital archiving system featuring automated retention lifecycle management and a 2-stage approval workflow for official document disposal. Built in compliance with PT ASABRI's internal records regulation (PER/HK.01/35-AS/XII/2022). Architecture includes a 9-table PostgreSQL schema, MinIO object storage, Redis caching, and LDAP enterprise authentication.
tags:        [Next.js 14, NestJS, Prisma, PostgreSQL, MinIO, Redis, Docker, LDAP, Turborepo]
status:      Production (Internal)
```

### Project 4
```
title:       COMMANDO — Communication & Media Management for ASABRI National Digital Operations
role:        Full-Stack Developer (Solo)
description: A centralized CMS for managing corporate communications and media monitoring across PT ASABRI's headquarters and all national branches. Implements RBAC (Role-Based Access Control) to enforce strict multi-branch data isolation and tiered content approval workflows.
tags:        [React, Supabase, PostgreSQL, Tailwind CSS]
status:      Production (Internal)
```

### Project 5
```
title:       Budget Tracker — AI-Powered Personal Finance PWA
role:        Full-Stack Developer (Solo)
description: A Progressive Web App for personal finance management with AI-powered spending predictions, gamification features, and advanced reporting. Integrated Tesseract.js for OCR-based physical receipt scanning and ML algorithms for spending pattern prediction.
tags:        [React, Vite, Tailwind CSS, Zustand, Supabase, Tesseract.js]
status:      Personal Project
```

### Project 6
```
title:       Automated WhatsApp Assistant
role:        Node.js Developer (Solo)
description: A headless WhatsApp bot integrated with the Kemnaker API to automate intern daily report tracking and scheduling. Implements group reminder automation and gamification features to improve intern participation and attendance monitoring.
tags:        [Node.js, whatsapp-web.js, Supabase, Node-cron]
status:      Personal Project
```

---

## STEP 7 — EXPERIENCE SECTION

Replace dummy experience data with the following. Maintain the existing visual layout of each experience card.

---

### Experience 1
```
title:    IT Support – Corporate Communication (Internship)
company:  PT ASABRI (Persero)
location: Jakarta, Indonesia
period:   October 2025 – Present
bullets:
  - Led the end-to-end redesign of the corporate company profile website as a solo developer, delivering a fully finalized product after a 6-month development cycle.
  - Provided technical IT support for the Corporate Secretary department, maintaining operational stability across hardware and software systems.
  - Served as protocol officer for high-level executive events alongside the Board of Directors: Keterbukaan Informasi Publik Forum; PTIJK 2025 (Annual Financial Industry Meeting, Jakarta); Pertandingan Tenis Kemhan 2025 (Hari Bela Negara ke-77); and bilateral OJK meeting at Wisma Mulia.
achievement: Delivered a complete corporate company profile website redesign—from requirements gathering to final deployment—within 6 months, aligning ASABRI's digital presence with national BUMN visual identity standards.
tools:    [Microsoft 365, Figma, Adobe Creative Suite]
```

### Experience 2
```
title:    Visual Designer (Internship)
company:  GaoTek Company
location: Remote (International)
period:   July 2025 – October 2025
bullets:
  - Designed and delivered 3+ production-ready marketing assets per week—banners, flyers, and social media creatives—for global promotional campaigns.
  - Produced 45+ approved design assets over a 4-month engagement, consistently delivering at least one finalized creative per synchronization session with the international team.
achievement: Maintained a 3+ asset/week delivery cadence across international marketing campaigns with zero missed production deadlines throughout the entire engagement.
tools:    [Adobe Illustrator, Adobe Photoshop, Figma]
```

### Experience 3 (Organizational)
```
title:    Head of Information & Communication
company:  BEM Universitas Sriwijaya
location: Palembang, Indonesia
period:   May 2024 – March 2025
bullets:
  - Led a 29-member content team and managed a professional editorial calendar for the university's official Instagram.
  - Standardized brand guidelines and templates to ensure visual consistency across all organizational channels.
achievement: Boosted Instagram engagement by 15% within two weeks and reduced per-post production time by 60% through systematic template standardization.
tools:    [Adobe Creative Suite, CapCut, Figma]
```

---

## STEP 8 — SKILLS SECTION

Replace dummy skills with the following categorized data. Display as visual skill badges or grouped tag lists per category.

```
Frontend:          React, Next.js 14, Vite, Tailwind CSS, Ant Design, Zustand
Backend:           NestJS, Node.js, Prisma ORM, REST API
Database:          PostgreSQL, MySQL, Supabase, Redis
AI / ML:           Python, HuggingFace Transformers, IndoBERT, Streamlit, Tesseract.js
DevOps & Tools:    Docker, Git, Vercel, Turborepo, MinIO, LDAP
Design:            Figma, Adobe Illustrator, Adobe Photoshop, Adobe Premiere Pro
Cloud:             Microsoft Azure (AZ-900, DP-900)
Languages:         Indonesian (Native), English (Professional Working Proficiency)
```

---

## STEP 9 — CERTIFICATIONS (add if section exists, or add to About/Skills)

```
- Microsoft Certified: Azure Fundamentals (AZ-900) — Microsoft, 2024
- Microsoft Certified: Azure Data Fundamentals (DP-900) — Microsoft, 2024
- 3rd Place – Poster Design Competition, PEKSIMIDA South Sumatra, 2022
```

---

## STEP 10 — CONTACT SECTION

Replace dummy contact info with:

```
Email:     bimaaryadinata01@gmail.com  (mailto link)
LinkedIn:  linkedin.com/in/bima-aryadinata  (external link, open in new tab)
Portfolio: s.id/PortFolioBimaAryadinata
Location:  Jakarta, Indonesia
```

Note: Do NOT add a GitHub link unless the user provides the actual URL. Leave GitHub field empty or hidden for now.

---

## STEP 11 — META / SEO (update head tags)

Locate the `<head>` section of the HTML (or the Next.js `<Head>` component / `_document.js`) and update/add the following:

```html
<title>Bima Aryadinata — Full-Stack Developer & IT Communicator</title>
<meta name="description" content="Portfolio of Bima Aryadinata, Informatics Engineering graduate and Full-Stack Developer specializing in AI-integrated enterprise systems, built with React, NestJS, Python, and HuggingFace Transformers.">
<meta name="keywords" content="Bima Aryadinata, Full-Stack Developer, AI Developer, NLP, IndoBERT, React, NestJS, Jakarta, PT ASABRI, portfolio">
<meta property="og:title" content="Bima Aryadinata — Full-Stack Developer & IT Communicator">
<meta property="og:description" content="Building AI-powered internal tools and enterprise digital systems. IndoBERT fine-tuning, React, NestJS, PostgreSQL.">
<meta property="og:url" content="https://portfolio-bima-eosin.vercel.app/">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="Bima Aryadinata — Full-Stack Developer">
<meta name="twitter:description" content="AI-powered media intelligence, enterprise workflow systems, and full-stack development at PT ASABRI.">
```

---

## STEP 12 — BILINGUAL CONTENT (if EN/ID toggle exists)

The site has a language toggle (EN/ID). For every content item listed in Steps 3–10, also provide the Indonesian translation below. Only translate the **text content**, not the tech stack tags or tool names.

**Hero (ID):**
- Tagline: `Full-Stack Developer & IT Communicator`
- Subtitle: `Membangun sistem digital berbasis AI dan alat internal enterprise untuk operasional skala korporat di PT ASABRI (Persero), Jakarta.`

**About (ID):**
> "Saya adalah lulusan Teknik Informatika dari Universitas Sriwijaya (IPK 3,93/4,00) dengan ketertarikan kuat dalam membangun sistem yang benar-benar menyelesaikan masalah organisasi nyata. Saat ini bekerja sebagai intern IT Support di PT ASABRI (Persero), Jakarta, dengan peran sebagai full-stack developer yang membangun tools internal untuk divisi Komunikasi Korporat dan Sekretariat Perusahaan.
>
> Pekerjaan saya mencakup keseluruhan stack: dari perancangan backend NestJS dan skema PostgreSQL, hingga membangun frontend React dan mengintegrasikan model AI. Saya telah men-deliver 6 sistem internal tingkat produksi secara solo, termasuk platform media intelligence berbasis IndoBERT yang sudah di-fine-tune, sistem manajemen proyek dan anggaran korporat, serta sistem pengarsipan dokumen digital.
>
> Di luar engineering, saya memiliki latar belakang kepemimpinan organisasi—memimpin tim konten 29 orang sebagai Kepala Bidang Infokom di BEM Universitas Sriwijaya—dan desain visual, sebagai Visual Designer remote untuk GaoTek Company dalam kampanye pemasaran internasional."

**Project descriptions (ID):**
- MedMon: Platform intelijen media berbasis AI yang melakukan scraping berita nasional dan mengklasifikasikan sentimen menggunakan model IndoBERT yang di-fine-tune. Mencapai akurasi pengujian 91,38% dan F1 Macro ~0,896 pada 3 kelas sentimen.
- ROCKET: Platform enterprise terintegrasi untuk tim Komunikasi PT ASABRI guna mengelola proyek dan memantau serapan anggaran secara real-time, dengan alur persetujuan bertingkat (Staf → Kabid → GM) dan pembuatan laporan PDF otomatis.
- DRMS: Sistem pengarsipan digital komprehensif dengan manajemen siklus retensi otomatis dan alur persetujuan 2 tahap untuk pemusnahan dokumen, sesuai regulasi internal PT ASABRI.
- COMMANDO: CMS terpusat untuk mengelola komunikasi korporat dan pemantauan media di seluruh kantor pusat dan cabang nasional ASABRI, dengan RBAC untuk isolasi data antar cabang.
- Budget Tracker: Progressive Web App untuk manajemen keuangan pribadi dengan prediksi pengeluaran berbasis AI, gamifikasi, dan pemindaian struk fisik via OCR.
- WhatsApp Assistant: Bot WhatsApp headless terintegrasi API Kemnaker untuk mengotomatisasi pelacakan laporan harian dan absensi intern, dengan fitur gamifikasi grup.

---

## VALIDATION CHECKLIST

Before finalizing, verify the following:
- [ ] Profile image loads correctly (no broken img tag)
- [ ] Hero tagline and subtitle display correctly in both EN and ID
- [ ] All 6 projects appear in the projects section with correct titles, descriptions, and tech tags
- [ ] Both professional experiences (ASABRI, GaoTek) and at least 1 organizational experience (BEM) appear in the experience section
- [ ] Skills section shows all 8 categories
- [ ] Contact section email and LinkedIn are clickable links
- [ ] SEO meta tags are present in `<head>`
- [ ] Language toggle (EN/ID) switches content correctly for all sections
- [ ] No placeholder text (Lorem ipsum, "dummy", "example", "test", "your name", etc.) remains anywhere on the page
- [ ] All existing animations, hover effects, and transitions still work
- [ ] Site deploys cleanly to Vercel with no build errors

---

## NOTES FOR THE AGENT

1. **Do not change the visual design.** If you find yourself modifying CSS variables, Tailwind classes, animation configs, or layout structures, STOP — you are outside your scope.
2. **Do not add new sections** that don't already exist in the design. Only populate existing ones.
3. **Do not add a GitHub link** — the user has not provided their GitHub URL. Leave any GitHub field hidden or empty.
4. **Tech stack tags** should remain in English in both language modes (e.g., "React", "PostgreSQL" — these are proper nouns, not translated).
5. **"Solo"** label on all 6 projects should appear consistently — every project in this portfolio was built solo by Bima.
6. **Internal projects** (ASABRI-related) should be labelled "Production (Internal)" not with live links, since these are proprietary enterprise systems.
7. If the CV download button exists, link it to: `[USER WILL PROVIDE PDF URL]` — leave it as a visible TODO comment in the code.
8. Commit all changes with the message: `feat: populate portfolio with real content from CV data`
