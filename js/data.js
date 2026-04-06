// ═══════════════════════════════════════════════════
// DATA STORE — data.js
// Default portfolio content + translations
// Used as fallback when Supabase is unavailable
// ═══════════════════════════════════════════════════

const DEFAULT_PROJECTS = [
  {
    id: 1, sort_order: 1, category: 'ai',
    name: 'MedMon & Sentiment Analyzer AI',
    role_en: 'AI & Backend Developer (Solo)',
    role_id: 'AI & Backend Developer (Solo)',
    desc_en: 'An end-to-end AI-powered media intelligence platform that scrapes national Indonesian news and classifies sentiment using a fine-tuned IndoBERT model. Achieved 91.38% test accuracy and F1 Macro ~0.896 across 3 sentiment classes (POSITIVE / NEUTRAL / NEGATIVE). Fully automated the pipeline from scraping to dashboard display for PT ASABRI\'s Corporate Secretary division.',
    desc_id: 'Platform intelijen media berbasis AI yang melakukan scraping berita nasional dan mengklasifikasikan sentimen menggunakan model IndoBERT yang di-fine-tune. Mencapai akurasi pengujian 91,38% dan F1 Macro ~0,896 pada 3 kelas sentimen.',
    detail_en: 'MedMon is an end-to-end AI-powered media intelligence platform that scrapes national Indonesian news and classifies sentiment using a fine-tuned IndoBERT model. Achieved 91.38% test accuracy and F1 Macro ~0.896 across 3 sentiment classes (POSITIVE / NEUTRAL / NEGATIVE). Fully automated the pipeline from scraping to dashboard display for PT ASABRI\'s Corporate Secretary division. The system includes real-time dashboard visualization, automated alerting for negative sentiment spikes, and historical trend analysis. The ML pipeline was built using Python, HuggingFace Transformers, and Streamlit for the dashboard.',
    detail_id: 'MedMon adalah platform intelijen media berbasis AI end-to-end yang melakukan scraping berita nasional Indonesia dan mengklasifikasikan sentimen menggunakan model IndoBERT yang di-fine-tune. Mencapai akurasi pengujian 91,38% dan F1 Macro ~0,896 pada 3 kelas sentimen (POSITIF / NETRAL / NEGATIF). Pipeline sepenuhnya otomatis dari scraping hingga tampilan dashboard untuk divisi Sekretariat Perusahaan PT ASABRI. Sistem ini mencakup visualisasi dashboard real-time, peringatan otomatis untuk lonjakan sentimen negatif, dan analisis tren historis.',
    tags: ['Python', 'Streamlit', 'HuggingFace', 'IndoBERT', 'Node.js', 'Crawlee', 'Supabase', 'PostgreSQL'],
    highlight: '91.38% Test Accuracy · F1 Macro ~0.896',
    status: 'Production (Internal)',
    github_url: '',
    live_url: '',
    images: []
  },
  {
    id: 2, sort_order: 2, category: 'fullstack',
    name: 'ROCKET — Corporate Project & Budget Management System',
    role_en: 'Full-Stack Developer (Solo)',
    role_id: 'Full-Stack Developer (Solo)',
    desc_en: 'An integrated enterprise platform for PT ASABRI\'s Communications team to manage projects and track budget absorption in real-time. Features a multi-level approval workflow (Staff → Kabid → GM), role-based access control, and automated PDF report generation. Replaced manual spreadsheet-based tracking across the entire division.',
    desc_id: 'Platform enterprise terintegrasi untuk tim Komunikasi PT ASABRI guna mengelola proyek dan memantau serapan anggaran secara real-time, dengan alur persetujuan bertingkat (Staf → Kabid → GM) dan pembuatan laporan PDF otomatis.',
    detail_en: 'ROCKET is an integrated enterprise platform for PT ASABRI\'s Communications team to manage projects and track budget absorption in real-time. Features a multi-level approval workflow (Staff → Kabid → GM), role-based access control, and automated PDF report generation. Replaced manual spreadsheet-based tracking across the entire division. The system handles concurrent users across departments with Prisma ORM for type-safe database operations and Redis-powered caching for performance.',
    detail_id: 'ROCKET adalah platform enterprise terintegrasi untuk tim Komunikasi PT ASABRI guna mengelola proyek dan memantau serapan anggaran secara real-time. Fitur meliputi alur persetujuan bertingkat (Staf → Kabid → GM), kontrol akses berbasis peran, dan pembuatan laporan PDF otomatis. Menggantikan pelacakan berbasis spreadsheet manual di seluruh divisi. Sistem ini menangani pengguna bersamaan lintas departemen dengan Prisma ORM untuk operasi database type-safe dan caching Redis untuk performa.',
    tags: ['React', 'NestJS', 'Prisma', 'PostgreSQL', 'Redis', 'Puppeteer', 'Tailwind CSS', 'Ant Design'],
    status: 'Production (Internal)',
    github_url: '',
    live_url: '',
    images: []
  },
  {
    id: 3, sort_order: 3, category: 'fullstack',
    name: 'DRMS — Document Records Management System',
    role_en: 'Backend & Architecture (Solo)',
    role_id: 'Backend & Architecture (Solo)',
    desc_en: 'A comprehensive digital archiving system featuring automated retention lifecycle management and a 2-stage approval workflow for official document disposal. Built in compliance with PT ASABRI\'s internal records regulation (PER/HK.01/35-AS/XII/2022). Architecture includes a 9-table PostgreSQL schema, MinIO object storage, Redis caching, and LDAP enterprise authentication.',
    desc_id: 'Sistem pengarsipan digital komprehensif dengan manajemen siklus retensi otomatis dan alur persetujuan 2 tahap untuk pemusnahan dokumen, sesuai regulasi internal PT ASABRI.',
    detail_en: 'DRMS (Document Records Management System) is a comprehensive digital archiving system featuring automated retention lifecycle management and a 2-stage approval workflow for official document disposal. Built in compliance with PT ASABRI\'s internal records regulation (PER/HK.01/35-AS/XII/2022). Architecture includes a 9-table PostgreSQL schema, MinIO object storage, Redis caching, and LDAP enterprise authentication. The system handles the complete document lifecycle from creation to destruction with comprehensive audit trails for corporate governance.',
    detail_id: 'DRMS (Document Records Management System) adalah sistem pengarsipan digital komprehensif dengan manajemen siklus hidup retensi otomatis dan alur kerja persetujuan 2 tahap untuk pemusnahan dokumen resmi. Dibangun sesuai regulasi internal PT ASABRI (PER/HK.01/35-AS/XII/2022). Arsitektur mencakup skema PostgreSQL 9 tabel, penyimpanan objek MinIO, caching Redis, dan autentikasi enterprise LDAP.',
    tags: ['Next.js 14', 'NestJS', 'Prisma', 'PostgreSQL', 'MinIO', 'Redis', 'Docker', 'LDAP', 'Turborepo'],
    status: 'Production (Internal)',
    github_url: '',
    live_url: '',
    images: []
  },
  {
    id: 4, sort_order: 4, category: 'fullstack',
    name: 'COMMANDO — Communication & Media Management for ASABRI National Digital Operations',
    role_en: 'Full-Stack Developer (Solo)',
    role_id: 'Full-Stack Developer (Solo)',
    desc_en: 'A centralized CMS for managing corporate communications and media monitoring across PT ASABRI\'s headquarters and all national branches. Implements RBAC (Role-Based Access Control) to enforce strict multi-branch data isolation and tiered content approval workflows.',
    desc_id: 'CMS terpusat untuk mengelola komunikasi korporat dan pemantauan media di seluruh kantor pusat dan cabang nasional ASABRI, dengan RBAC untuk isolasi data antar cabang.',
    detail_en: 'COMMANDO is a centralized Content Management System designed for managing corporate communications and media monitoring across PT ASABRI\'s headquarters and all national branches. Implements RBAC (Role-Based Access Control) to enforce strict multi-branch data isolation and tiered content approval workflows. Features include a unified publishing workflow, media asset management, and analytics dashboard tracking content reach and engagement with Supabase-powered real-time updates.',
    detail_id: 'COMMANDO adalah Sistem Manajemen Konten terpusat yang dirancang untuk mengelola komunikasi korporat dan pemantauan media di seluruh kantor pusat dan cabang nasional PT ASABRI. Mengimplementasikan RBAC (Kontrol Akses Berbasis Peran) untuk menerapkan isolasi data multi-cabang yang ketat dan alur kerja persetujuan konten bertingkat.',
    tags: ['React', 'Supabase', 'PostgreSQL', 'Tailwind CSS'],
    status: 'Production (Internal)',
    github_url: '',
    live_url: '',
    images: []
  },
  {
    id: 5, sort_order: 5, category: 'fullstack',
    name: 'Budget Tracker — AI-Powered Personal Finance PWA',
    role_en: 'Full-Stack Developer (Solo)',
    role_id: 'Full-Stack Developer (Solo)',
    desc_en: 'A Progressive Web App for personal finance management with AI-powered spending predictions, gamification features, and advanced reporting. Integrated Tesseract.js for OCR-based physical receipt scanning and ML algorithms for spending pattern prediction.',
    desc_id: 'Progressive Web App untuk manajemen keuangan pribadi dengan prediksi pengeluaran berbasis AI, gamifikasi, dan pemindaian struk fisik via OCR.',
    detail_en: 'Budget Tracker is a Progressive Web App for personal finance management with AI-powered spending predictions, gamification features, and advanced reporting. Integrated Tesseract.js for OCR-based physical receipt scanning and ML algorithms for spending pattern prediction. Features include category-based expense tracking with visual analytics, offline-first architecture with service workers, and Supabase for cloud sync.',
    detail_id: 'Budget Tracker adalah Progressive Web App untuk manajemen keuangan pribadi dengan prediksi pengeluaran berbasis AI, fitur gamifikasi, dan pelaporan tingkat lanjut. Terintegrasi Tesseract.js untuk pemindaian struk fisik berbasis OCR dan algoritma ML untuk prediksi pola pengeluaran.',
    tags: ['React', 'Vite', 'Tailwind CSS', 'Zustand', 'Supabase', 'Tesseract.js'],
    status: 'Personal Project',
    github_url: '',
    live_url: '',
    images: []
  },
  {
    id: 6, sort_order: 6, category: 'tools',
    name: 'Automated WhatsApp Assistant',
    role_en: 'Node.js Developer (Solo)',
    role_id: 'Node.js Developer (Solo)',
    desc_en: 'A headless WhatsApp bot integrated with the Kemnaker API to automate intern daily report tracking and scheduling. Implements group reminder automation and gamification features to improve intern participation and attendance monitoring.',
    desc_id: 'Bot WhatsApp headless terintegrasi API Kemnaker untuk mengotomatisasi pelacakan laporan harian dan absensi intern, dengan fitur gamifikasi grup.',
    detail_en: 'Automated WhatsApp Assistant is a headless WhatsApp bot integrated with the Kemnaker (Ministry of Manpower) API to automate intern daily report tracking and scheduling. Implements group reminder automation and gamification features with streak counters and leaderboards to improve intern participation and attendance monitoring. Generates weekly summary reports for supervisors.',
    detail_id: 'WhatsApp Assistant Otomatis adalah bot WhatsApp headless yang terintegrasi dengan API Kemnaker untuk mengotomatisasi pelacakan laporan harian dan penjadwalan intern. Mengimplementasikan otomasi pengingat grup dan fitur gamifikasi dengan penghitung streak dan papan peringkat untuk meningkatkan partisipasi dan pemantauan kehadiran intern.',
    tags: ['Node.js', 'whatsapp-web.js', 'Supabase', 'Node-cron'],
    status: 'Personal Project',
    github_url: '',
    live_url: '',
    images: []
  }
];

const DEFAULT_SKILLS = [
  // Frontend
  { id: 1, group_name: 'Frontend', name: 'React', is_featured: true, sort_order: 1 },
  { id: 2, group_name: 'Frontend', name: 'Next.js 14', is_featured: false, sort_order: 2 },
  { id: 3, group_name: 'Frontend', name: 'Vite', is_featured: false, sort_order: 3 },
  { id: 4, group_name: 'Frontend', name: 'Tailwind CSS', is_featured: false, sort_order: 4 },
  { id: 5, group_name: 'Frontend', name: 'Ant Design', is_featured: false, sort_order: 5 },
  { id: 6, group_name: 'Frontend', name: 'Zustand', is_featured: false, sort_order: 6 },
  // Backend
  { id: 7, group_name: 'Backend', name: 'NestJS', is_featured: true, sort_order: 7 },
  { id: 8, group_name: 'Backend', name: 'Node.js', is_featured: false, sort_order: 8 },
  { id: 9, group_name: 'Backend', name: 'Prisma ORM', is_featured: false, sort_order: 9 },
  { id: 10, group_name: 'Backend', name: 'REST API', is_featured: false, sort_order: 10 },
  // Database
  { id: 11, group_name: 'Database', name: 'PostgreSQL', is_featured: true, sort_order: 11 },
  { id: 12, group_name: 'Database', name: 'MySQL', is_featured: false, sort_order: 12 },
  { id: 13, group_name: 'Database', name: 'Supabase', is_featured: false, sort_order: 13 },
  { id: 14, group_name: 'Database', name: 'Redis', is_featured: false, sort_order: 14 },
  // AI / ML
  { id: 15, group_name: 'AI / ML', name: 'Python', is_featured: true, sort_order: 15 },
  { id: 16, group_name: 'AI / ML', name: 'HuggingFace Transformers', is_featured: false, sort_order: 16 },
  { id: 17, group_name: 'AI / ML', name: 'IndoBERT', is_featured: false, sort_order: 17 },
  { id: 18, group_name: 'AI / ML', name: 'Streamlit', is_featured: false, sort_order: 18 },
  { id: 19, group_name: 'AI / ML', name: 'Tesseract.js', is_featured: false, sort_order: 19 },
  // DevOps & Tools
  { id: 20, group_name: 'DevOps & Tools', name: 'Docker', is_featured: true, sort_order: 20 },
  { id: 21, group_name: 'DevOps & Tools', name: 'Git', is_featured: false, sort_order: 21 },
  { id: 22, group_name: 'DevOps & Tools', name: 'Vercel', is_featured: false, sort_order: 22 },
  { id: 23, group_name: 'DevOps & Tools', name: 'Turborepo', is_featured: false, sort_order: 23 },
  { id: 24, group_name: 'DevOps & Tools', name: 'MinIO', is_featured: false, sort_order: 24 },
  { id: 25, group_name: 'DevOps & Tools', name: 'LDAP', is_featured: false, sort_order: 25 },
  // Design
  { id: 26, group_name: 'Design', name: 'Figma', is_featured: true, sort_order: 26 },
  { id: 27, group_name: 'Design', name: 'Adobe Illustrator', is_featured: false, sort_order: 27 },
  { id: 28, group_name: 'Design', name: 'Adobe Photoshop', is_featured: false, sort_order: 28 },
  { id: 29, group_name: 'Design', name: 'Adobe Premiere Pro', is_featured: false, sort_order: 29 },
  // Cloud
  { id: 30, group_name: 'Cloud', name: 'Microsoft Azure (AZ-900)', is_featured: true, sort_order: 30 },
  { id: 31, group_name: 'Cloud', name: 'Microsoft Azure (DP-900)', is_featured: true, sort_order: 31 },
  // Languages
  { id: 32, group_name: 'Languages', name: 'Indonesian (Native)', is_featured: false, sort_order: 32 },
  { id: 33, group_name: 'Languages', name: 'English (Professional Working Proficiency)', is_featured: false, sort_order: 33 },
];

// ── Experience with TYPE field (professional / organization) ──
const DEFAULT_EXPERIENCES = [
  {
    id: 1, sort_order: 1, type: 'professional', period: 'OCT 2025 → NOW',
    title_en: 'IT Support – Corporate Communication (Internship)',
    title_id: 'IT Support – Komunikasi Korporat (Magang)',
    org: 'PT ASABRI (Persero)',
    location_en: 'Jakarta, Indonesia',
    location_id: 'Jakarta, Indonesia',
    desc_en: 'Led the end-to-end redesign of the corporate company profile website as a solo developer, delivering a fully finalized product after a 6-month development cycle. Provided technical IT support for the Corporate Secretary department, maintaining operational stability across hardware and software systems. Served as protocol officer for high-level executive events alongside the Board of Directors.',
    desc_id: 'Memimpin desain ulang menyeluruh website profil perusahaan korporat sebagai developer solo, menghasilkan produk yang sepenuhnya final setelah siklus pengembangan 6 bulan. Menyediakan dukungan teknis IT untuk departemen Sekretariat Perusahaan, menjaga stabilitas operasional di seluruh sistem perangkat keras dan lunak. Bertugas sebagai petugas protokol untuk acara eksekutif tingkat tinggi bersama Direksi.',
    achievement_en: 'Delivered a complete corporate company profile website redesign—from requirements gathering to final deployment—within 6 months, aligning ASABRI\'s digital presence with national BUMN visual identity standards.',
    achievement_id: 'Menghasilkan desain ulang website profil perusahaan korporat secara lengkap—dari pengumpulan kebutuhan hingga deployment akhir—dalam waktu 6 bulan, menyelaraskan kehadiran digital ASABRI dengan standar identitas visual BUMN nasional.',
    tools: ['Microsoft 365', 'Figma', 'Adobe Creative Suite']
  },
  {
    id: 2, sort_order: 2, type: 'professional', period: 'JUL → OCT 2025',
    title_en: 'Visual Designer (Internship)',
    title_id: 'Visual Designer (Magang)',
    org: 'GaoTek Company',
    location_en: 'Remote (International)',
    location_id: 'Remote (Internasional)',
    desc_en: 'Designed and delivered 3+ production-ready marketing assets per week—banners, flyers, and social media creatives—for global promotional campaigns. Produced 45+ approved design assets over a 4-month engagement, consistently delivering at least one finalized creative per synchronization session with the international team.',
    desc_id: 'Merancang dan mengirimkan 3+ aset pemasaran siap produksi per minggu—banner, flyer, dan kreatif media sosial—untuk kampanye promosi global. Menghasilkan 45+ aset desain yang disetujui selama 4 bulan keterlibatan, secara konsisten mengirimkan setidaknya satu kreatif final per sesi sinkronisasi dengan tim internasional.',
    achievement_en: 'Maintained a 3+ asset/week delivery cadence across international marketing campaigns with zero missed production deadlines throughout the entire engagement.',
    achievement_id: 'Menjaga cadence pengiriman 3+ aset/minggu lintas kampanye pemasaran internasional tanpa satu pun tenggat produksi yang terlewat sepanjang seluruh keterlibatan.',
    tools: ['Adobe Illustrator', 'Adobe Photoshop', 'Figma']
  },
  {
    id: 3, sort_order: 3, type: 'organization', period: 'MAY 2024 → MAR 2025',
    title_en: 'Head of Information & Communication',
    title_id: 'Kepala Bidang Informasi & Komunikasi',
    org: 'BEM Universitas Sriwijaya',
    location_en: 'Palembang, Indonesia',
    location_id: 'Palembang, Indonesia',
    desc_en: 'Led a 29-member content team and managed a professional editorial calendar for the university\'s official Instagram. Standardized brand guidelines and templates to ensure visual consistency across all organizational channels.',
    desc_id: 'Memimpin tim konten 29 orang dan mengelola kalender editorial profesional untuk Instagram resmi universitas. Menstandarisasi panduan brand dan template untuk memastikan konsistensi visual di seluruh saluran organisasi.',
    achievement_en: 'Boosted Instagram engagement by 15% within two weeks and reduced per-post production time by 60% through systematic template standardization.',
    achievement_id: 'Meningkatkan engagement Instagram sebesar 15% dalam dua minggu dan mengurangi waktu produksi per unggahan sebesar 60% melalui standarisasi template sistematis.',
    tools: ['Adobe Creative Suite', 'CapCut', 'Figma']
  }
];

// ── Education data ──
const DEFAULT_EDUCATION = [
  {
    id: 1, sort_order: 1,
    degree_en: 'Bachelor of Informatics Engineering (S.Kom.)',
    degree_id: 'Sarjana Teknik Informatika (S.Kom.)',
    institution: 'Universitas Sriwijaya',
    location_en: 'Palembang, Indonesia',
    location_id: 'Palembang, Indonesia',
    period: '2021 — 2025',
    gpa: '3.93 / 4.00',
    highlights_en: ['Elected as Cohort Leader for the Informatics Engineering Class of 2021', 'User Interface Design', 'Database Systems (SQL)', 'Web Development', 'Cloud Computing'],
    highlights_id: ['Terpilih sebagai Ketua Angkatan Teknik Informatika 2021', 'Desain Antarmuka Pengguna', 'Sistem Basis Data (SQL)', 'Pengembangan Web', 'Cloud Computing']
  }
];

// ── Profile with additional editable fields ──
const DEFAULT_PROFILE = {
  id: 1,
  hero_name: 'BIMA\nARYA',
  hero_tagline_en: 'Full-Stack Developer & IT Communicator',
  hero_tagline_id: 'Full-Stack Developer & IT Communicator',
  hero_bio_en: 'Building AI-powered internal tools and enterprise digital systems for corporate-scale operations at PT ASABRI (Persero), Jakarta.',
  hero_bio_id: 'Membangun sistem digital berbasis AI dan alat internal enterprise untuk operasional skala korporat di PT ASABRI (Persero), Jakarta.',
  badge_en: 'Available for hire',
  badge_id: 'Terbuka untuk peluang baru',
  location: 'Jakarta, Indonesia',
  photo_url: '',
  stats: [
    { value: '3.93', label_en: 'GPA / 4.00', label_id: 'IPK / 4,00' },
    { value: '6+', label_en: 'Projects Shipped', label_id: 'Proyek Selesai' },
    { value: '2x', label_en: 'Azure Certified', label_id: 'Sertifikasi Azure' },
    { value: '29', label_en: 'Team Members Led', label_id: 'Anggota Tim Dipimpin' },
    { value: '91%', label_en: 'AI Model Accuracy', label_id: 'Akurasi Model AI' }
  ],
  contact_email: 'bimaaryadinata01@gmail.com',
  contact_linkedin: 'https://linkedin.com/in/bima-aryadinata',
  contact_portfolio: 'https://s.id/PortFolioBimaAryadinata',
  footer_en: '© 2025 Bima Aryadinata',
  footer_id: '© 2025 Bima Aryadinata',
  contact_cta_en: 'Let\'s<br>work<span style="color:var(--ac)">.</span>',
  contact_cta_id: 'Mari<br>bekerja<span style="color:var(--ac)">.</span>',
  about_en: [
    "I'm an Informatics Engineering graduate from Universitas Sriwijaya (GPA 3.93/4.00) with a strong interest in building systems that actually solve real organizational problems—not just demo apps. Currently, I'm working as an IT Support intern at PT ASABRI (Persero) in Jakarta, where I function as a full-stack developer building internal tools for the Corporate Communications and Corporate Secretary divisions.",
    "My work spans the full stack: from architecting NestJS backends and PostgreSQL schemas to building React frontends and integrating AI models. I've shipped 6 production-grade internal systems solo, including a media intelligence platform powered by a fine-tuned IndoBERT model, a corporate project and budget management system, and a digital document archiving system.",
    "Outside of engineering, I have a background in organizational leadership—leading a 29-member content team as Head of Information & Communication at BEM Universitas Sriwijaya—and in visual design, having worked as a remote Visual Designer for GaoTek Company on international marketing campaigns."
  ],
  about_id: [
    "Saya adalah lulusan Teknik Informatika dari Universitas Sriwijaya (IPK 3,93/4,00) dengan ketertarikan kuat dalam membangun sistem yang benar-benar menyelesaikan masalah organisasi nyata. Saat ini bekerja sebagai intern IT Support di PT ASABRI (Persero), Jakarta, dengan peran sebagai full-stack developer yang membangun tools internal untuk divisi Komunikasi Korporat dan Sekretariat Perusahaan.",
    "Pekerjaan saya mencakup keseluruhan stack: dari perancangan backend NestJS dan skema PostgreSQL, hingga membangun frontend React dan mengintegrasikan model AI. Saya telah men-deliver 6 sistem internal tingkat produksi secara solo, termasuk platform media intelligence berbasis IndoBERT yang sudah di-fine-tune, sistem manajemen proyek dan anggaran korporat, serta sistem pengarsipan dokumen digital.",
    "Di luar engineering, saya memiliki latar belakang kepemimpinan organisasi—memimpin tim konten 29 orang sebagai Kepala Bidang Infokom di BEM Universitas Sriwijaya—dan desain visual, sebagai Visual Designer remote untuk GaoTek Company dalam kampanye pemasaran internasional."
  ],
  pills_en: ['Full-Stack Developer', 'AI / ML Enthusiast', 'Visual Designer', 'BUMN — Jakarta', 'Open to Work'],
  pills_id: ['Full-Stack Developer', 'Penggemar AI / ML', 'Visual Designer', 'BUMN — Jakarta', 'Terbuka untuk Kerja'],
  // Certifications data
  certifications: [
    { name: 'Microsoft Certified: Azure Fundamentals (AZ-900)', issuer: 'Microsoft', year: '2024' },
    { name: 'Microsoft Certified: Azure Data Fundamentals (DP-900)', issuer: 'Microsoft', year: '2024' },
    { name: '3rd Place – Poster Design Competition, PEKSIMIDA South Sumatra', issuer: 'PEKSIMIDA', year: '2022' }
  ]
};

// ── Translations ──
const TRANSLATIONS = {
  en: {
    nav_about: 'about', nav_projects: 'projects', nav_skills: 'skills',
    nav_experience: 'experience', nav_education: 'education', nav_contact: 'contact',
    sec_about: 'About', sec_projects: 'Selected Projects',
    sec_experience: 'Experience', sec_education: 'Education', sec_skills: 'Skills & Tools',
    exp_professional: 'Professional Experience',
    exp_organization: 'Organization',
    filter_all: 'All', filter_tools: 'Tools',
    photo_hint: 'Click to upload your photo', photo_change: 'Change photo',
    now: 'NOW',
    sg_cert: 'Certifications',
    modal_close: 'Close', modal_github: 'GitHub', modal_live: 'Live Demo',
    modal_detail: 'Project Details',
    modal_gallery: 'Documentation',
    modal_gallery_empty: 'No documentation photos yet',
    footer_admin: 'Admin',
    click_detail: 'Click for details →'
  },
  id: {
    nav_about: 'tentang', nav_projects: 'proyek', nav_skills: 'keahlian',
    nav_experience: 'pengalaman', nav_education: 'pendidikan', nav_contact: 'kontak',
    sec_about: 'Tentang Saya', sec_projects: 'Proyek Pilihan',
    sec_experience: 'Pengalaman', sec_education: 'Pendidikan', sec_skills: 'Keahlian & Alat',
    exp_professional: 'Pengalaman Profesional',
    exp_organization: 'Organisasi',
    filter_all: 'Semua', filter_tools: 'Alat',
    photo_hint: 'Klik untuk unggah foto kamu', photo_change: 'Ganti foto',
    now: 'SEKARANG',
    sg_cert: 'Sertifikasi',
    modal_close: 'Tutup', modal_github: 'GitHub', modal_live: 'Demo Langsung',
    modal_detail: 'Detail Proyek',
    modal_gallery: 'Dokumentasi',
    modal_gallery_empty: 'Belum ada foto dokumentasi',
    footer_admin: 'Admin',
    click_detail: 'Klik untuk detail →'
  }
};

// ── Ticker items ──
const TICKER_ITEMS = [
  'React', 'NestJS', 'PostgreSQL', 'Python', 'HuggingFace', 'Docker',
  'Prisma ORM', 'Figma', 'Node.js', 'IndoBERT', 'Tailwind CSS',
  'Redis', 'Next.js', 'Supabase', 'Azure AZ-900'
];

// ── Categories for filter ──
const CATEGORIES = [
  { key: 'all', label_en: 'All', label_id: 'Semua' },
  { key: 'ai', label_en: 'AI / ML', label_id: 'AI / ML' },
  { key: 'fullstack', label_en: 'Full-Stack', label_id: 'Full-Stack' },
  { key: 'tools', label_en: 'Tools', label_id: 'Alat' }
];
