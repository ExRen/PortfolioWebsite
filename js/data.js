// ═══════════════════════════════════════════════════
// DATA STORE — data.js
// Default portfolio content + translations
// Used as fallback when Supabase is unavailable
// ═══════════════════════════════════════════════════

const DEFAULT_PROJECTS = [
  {
    id: 1, sort_order: 1, category: 'ai',
    name: 'MedMon & Sentiment Analyzer',
    desc_en: 'AI-powered media intelligence using fine-tuned IndoBERT for national news sentiment classification at 91% accuracy.',
    desc_id: 'Intelijen media berbasis AI menggunakan IndoBERT yang di-fine-tune untuk klasifikasi sentimen berita nasional dengan akurasi 91%.',
    detail_en: 'MedMon is an AI-driven media monitoring platform designed for the corporate communications department at PT ASABRI. The system crawls national news sources, classifies articles using a fine-tuned IndoBERT model (achieving 91% accuracy), and generates daily sentiment reports. Key features include real-time dashboard visualization, automated alerting for negative sentiment spikes, and historical trend analysis. The ML pipeline was built using Python, HuggingFace Transformers, and FastAPI for the inference API.',
    detail_id: 'MedMon adalah platform pemantauan media berbasis AI yang dirancang untuk departemen komunikasi korporat di PT ASABRI. Sistem ini menelusuri sumber berita nasional, mengklasifikasikan artikel menggunakan model IndoBERT yang di-fine-tune (mencapai akurasi 91%), dan menghasilkan laporan sentimen harian. Fitur utama meliputi visualisasi dashboard real-time, peringatan otomatis untuk lonjakan sentimen negatif, dan analisis tren historis. Pipeline ML dibangun menggunakan Python, HuggingFace Transformers, dan FastAPI untuk API inferensi.',
    tags: ['Python', 'HuggingFace', 'FastAPI', 'IndoBERT'],
    github_url: '',
    live_url: ''
  },
  {
    id: 2, sort_order: 2, category: 'fullstack',
    name: 'ROCKET',
    desc_en: 'Enterprise project & budget platform replacing manual spreadsheets with multi-tier approval workflows and real-time monitoring.',
    desc_id: 'Platform proyek & anggaran enterprise yang menggantikan spreadsheet manual dengan alur persetujuan bertingkat dan pemantauan real-time.',
    detail_en: 'ROCKET is an enterprise-grade project management and budget tracking platform developed for PT ASABRI. It replaces fragmented spreadsheet-based project tracking with a unified web application featuring multi-tier approval workflows, real-time budget monitoring with visual dashboards, role-based access control, automated report generation, and Redis-powered caching for performance. The system handles concurrent users across departments with Prisma ORM for type-safe database operations.',
    detail_id: 'ROCKET adalah platform manajemen proyek dan pelacakan anggaran tingkat enterprise yang dikembangkan untuk PT ASABRI. Sistem ini menggantikan pelacakan proyek berbasis spreadsheet yang terfragmentasi dengan aplikasi web terpadu yang menampilkan alur kerja persetujuan bertingkat, pemantauan anggaran real-time dengan dashboard visual, kontrol akses berbasis peran, pembuatan laporan otomatis, dan caching Redis untuk performa.',
    tags: ['React', 'NestJS', 'Redis', 'Prisma'],
    github_url: '',
    live_url: ''
  },
  {
    id: 3, sort_order: 3, category: 'fullstack',
    name: 'DRMS',
    desc_en: 'Digital archive lifecycle system with automated retention cycles, 2-step destruction approval, and corporate compliance audit trails.',
    desc_id: 'Sistem siklus hidup arsip digital dengan retensi otomatis, persetujuan pemusnahan 2 tahap, dan jejak audit kepatuhan korporat.',
    detail_en: 'DRMS (Document Records Management System) is a full-stack digital archive lifecycle management system built for PT ASABRI. It handles the complete document lifecycle from creation to destruction, featuring automated retention cycles based on configurable policies, a 2-step destruction approval workflow for compliance, comprehensive audit trails for corporate governance, full-text search across archived documents, and Docker-based deployment for scalability.',
    detail_id: 'DRMS (Document Records Management System) adalah sistem manajemen siklus hidup arsip digital full-stack yang dibangun untuk PT ASABRI. Sistem ini menangani siklus hidup dokumen lengkap dari pembuatan hingga pemusnahan, dengan fitur siklus retensi otomatis berdasarkan kebijakan yang dapat dikonfigurasi, alur kerja persetujuan pemusnahan 2 tahap untuk kepatuhan, jejak audit komprehensif untuk tata kelola perusahaan.',
    tags: ['Next.js', 'NestJS', 'PostgreSQL', 'Docker'],
    github_url: '',
    live_url: ''
  },
  {
    id: 4, sort_order: 4, category: 'fullstack',
    name: 'COMMANDO',
    desc_en: 'Centralized CMS for corporate communications across all ASABRI national branches with role-based data isolation.',
    desc_id: 'CMS terpusat untuk komunikasi korporat di seluruh cabang nasional ASABRI dengan isolasi data berbasis peran.',
    detail_en: 'COMMANDO is a centralized Content Management System designed for managing corporate communications across all PT ASABRI national branches. Features include role-based access control with data isolation ensuring each branch can only see their own content, a unified publishing workflow, media asset management, analytics dashboard tracking content reach and engagement, and Supabase-powered real-time updates.',
    detail_id: 'COMMANDO adalah Sistem Manajemen Konten terpusat yang dirancang untuk mengelola komunikasi korporat di seluruh cabang nasional PT ASABRI. Fitur meliputi kontrol akses berbasis peran dengan isolasi data yang memastikan setiap cabang hanya dapat melihat konten mereka sendiri, alur kerja penerbitan terpadu, manajemen aset media, dashboard analitik.',
    tags: ['React', 'Supabase', 'PostgreSQL', 'RBAC'],
    github_url: '',
    live_url: ''
  },
  {
    id: 5, sort_order: 5, category: 'fullstack',
    name: 'Budget Tracker PWA',
    desc_en: 'Personal finance PWA with ML-based spending prediction and Tesseract.js OCR for scanning physical receipts.',
    desc_id: 'PWA keuangan pribadi dengan prediksi pengeluaran berbasis ML dan OCR Tesseract.js untuk memindai struk fisik.',
    detail_en: 'Budget Tracker is a Progressive Web App for personal finance management. Key features include ML-based spending prediction that forecasts monthly expenses based on historical patterns, Tesseract.js OCR integration for scanning and auto-parsing physical receipts, category-based expense tracking with visual analytics, offline-first architecture with service workers, and Supabase for cloud sync.',
    detail_id: 'Budget Tracker adalah Progressive Web App untuk manajemen keuangan pribadi. Fitur utama meliputi prediksi pengeluaran berbasis ML yang memperkirakan biaya bulanan berdasarkan pola historis, integrasi OCR Tesseract.js untuk memindai dan mengurai struk fisik secara otomatis, pelacakan pengeluaran berbasis kategori dengan analitik visual.',
    tags: ['React', 'Vite', 'Supabase', 'Tesseract.js'],
    github_url: '',
    live_url: ''
  },
  {
    id: 6, sort_order: 6, category: 'tools',
    name: 'WhatsApp Internship Bot',
    desc_en: 'Headless WhatsApp bot integrated with Kemnaker API for automated daily report tracking and gamified attendance reminders.',
    desc_id: 'Bot WhatsApp headless yang terintegrasi dengan API Kemnaker untuk pelacakan laporan harian magang secara otomatis.',
    detail_en: 'WhatsApp Internship Bot is an automated communication system that streamlines internship report tracking at PT ASABRI. Integrated with the Kemnaker (Ministry of Manpower) API, it automatically tracks daily report submissions, sends gamified attendance reminders with streak counters and leaderboards, generates weekly summary reports for supervisors.',
    detail_id: 'WhatsApp Internship Bot adalah sistem komunikasi otomatis yang menyederhanakan pelacakan laporan magang di PT ASABRI. Terintegrasi dengan API Kemnaker, bot ini secara otomatis melacak pengiriman laporan harian, mengirim pengingat kehadiran gamifikasi dengan penghitung streak dan papan peringkat.',
    tags: ['Node.js', 'Supabase', 'Node-cron', 'WA-Web.js'],
    github_url: '',
    live_url: ''
  }
];

const DEFAULT_SKILLS = [
  { id: 1, group_name: 'Frontend', name: 'React', is_featured: true, sort_order: 1 },
  { id: 2, group_name: 'Frontend', name: 'Next.js', is_featured: false, sort_order: 2 },
  { id: 3, group_name: 'Frontend', name: 'Tailwind CSS', is_featured: false, sort_order: 3 },
  { id: 4, group_name: 'Frontend', name: 'Figma', is_featured: false, sort_order: 4 },
  { id: 5, group_name: 'Frontend', name: 'Vite', is_featured: false, sort_order: 5 },
  { id: 6, group_name: 'Frontend', name: 'Adobe Suite', is_featured: false, sort_order: 6 },
  { id: 7, group_name: 'Backend & Infra', name: 'NestJS', is_featured: true, sort_order: 7 },
  { id: 8, group_name: 'Backend & Infra', name: 'Node.js', is_featured: false, sort_order: 8 },
  { id: 9, group_name: 'Backend & Infra', name: 'PostgreSQL', is_featured: false, sort_order: 9 },
  { id: 10, group_name: 'Backend & Infra', name: 'Redis', is_featured: false, sort_order: 10 },
  { id: 11, group_name: 'Backend & Infra', name: 'Prisma ORM', is_featured: false, sort_order: 11 },
  { id: 12, group_name: 'Backend & Infra', name: 'Docker', is_featured: false, sort_order: 12 },
  { id: 13, group_name: 'Backend & Infra', name: 'Supabase', is_featured: false, sort_order: 13 },
  { id: 14, group_name: 'AI & Data', name: 'Python', is_featured: true, sort_order: 14 },
  { id: 15, group_name: 'AI & Data', name: 'HuggingFace', is_featured: false, sort_order: 15 },
  { id: 16, group_name: 'AI & Data', name: 'IndoBERT', is_featured: false, sort_order: 16 },
  { id: 17, group_name: 'AI & Data', name: 'Streamlit', is_featured: false, sort_order: 17 },
  { id: 18, group_name: 'AI & Data', name: 'Tesseract.js', is_featured: false, sort_order: 18 },
  { id: 19, group_name: 'Certifications', name: 'Azure AZ-900', is_featured: true, sort_order: 19 },
  { id: 20, group_name: 'Certifications', name: 'Azure DP-900', is_featured: true, sort_order: 20 },
];

// ── Experience with TYPE field (professional / organization) ──
const DEFAULT_EXPERIENCES = [
  {
    id: 1, sort_order: 1, type: 'professional', period: 'OCT 2025 → NOW',
    title_en: 'IT Support – Corp. Communication',
    title_id: 'IT Support – Komunikasi Korporat',
    org: 'PT ASABRI (Persero)',
    desc_en: 'Led corporate website redesign. Built AI & document systems. IT support for Sekretariat Perusahaan.',
    desc_id: 'Memimpin desain ulang website korporat. Membangun sistem AI & dokumen. IT support Sekretariat Perusahaan.'
  },
  {
    id: 2, sort_order: 2, type: 'professional', period: 'JUL → OCT 2025',
    title_en: 'Visual Designer (Remote)',
    title_id: 'Visual Designer (Remote)',
    org: 'GaoTek Company',
    desc_en: 'Designed high-impact global marketing assets. Streamlined design-to-approval workflows for faster digital deployment.',
    desc_id: 'Merancang aset pemasaran global berdampak tinggi. Merampingkan alur kerja desain hingga persetujuan.'
  },
  {
    id: 3, sort_order: 3, type: 'organization', period: 'MAY 2024 → MAR 2025',
    title_en: 'Head of Information & Communication',
    title_id: 'Kepala Bidang Informasi & Komunikasi',
    org: 'BEM Universitas Sriwijaya',
    desc_en: 'Led 29-person content team. +15% engagement in 2 weeks. −60% production time per post.',
    desc_id: 'Memimpin tim konten 29 orang. +15% engagement dalam 2 minggu. −60% waktu produksi per unggahan.'
  }
];

// ── Education data ──
const DEFAULT_EDUCATION = [
  {
    id: 1, sort_order: 1,
    degree_en: 'Bachelor of Computer Science (S.T.)',
    degree_id: 'Sarjana Teknik Informatika (S.T.)',
    institution: 'Universitas Sriwijaya',
    period: '2021 — 2025',
    gpa: '3.93 / 4.00',
    highlights_en: ['Cohort Leader 2021', 'Cloud Computing', 'Database Systems', 'Web Development', 'UI/UX Design'],
    highlights_id: ['Ketua Angkatan 2021', 'Cloud Computing', 'Basis Data', 'Pengembangan Web', 'Desain UI/UX']
  }
];

// ── Profile with additional editable fields ──
const DEFAULT_PROFILE = {
  id: 1,
  hero_name: 'BIMA\nARYA',
  hero_bio_en: 'Full-stack developer & IT communicator at PT ASABRI. Builds AI-powered media intelligence, document management, and internal web systems for corporate-scale operations.',
  hero_bio_id: 'Developer full-stack & komunikator IT di PT ASABRI. Membangun sistem intelijen media berbasis AI, manajemen dokumen, dan aplikasi web internal untuk operasional korporat skala nasional.',
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
  contact_phone: '+62 823 7141 6026',
  footer_en: '© 2025 Bima Aryadinata',
  footer_id: '© 2025 Bima Aryadinata',
  contact_cta_en: 'Let\'s<br>work<span style="color:var(--ac)">.</span>',
  contact_cta_id: 'Mari<br>bekerja<span style="color:var(--ac)">.</span>',
  about_en: [
    "Hi, I'm Bima — a fresh Information Technology graduate from Universitas Sriwijaya (GPA 3.93/4.00) currently working as an IT Support intern at PT ASABRI (Persero), a state-owned insurance company serving Indonesian military personnel and civil servants.",
    "I specialize in building full-stack internal systems, AI-powered media intelligence tools, and digital experiences that solve real operational problems. My work spans across backend architecture, machine learning pipelines, and UI design — often all three at once.",
    "Outside of work, I enjoy exploring OSINT tools, building personal productivity apps, and learning about the intersection of AI and communications in the public sector."
  ],
  about_id: [
    "Halo, saya Bima — lulusan baru Teknik Informatika dari Universitas Sriwijaya (IPK 3,93/4,00) yang saat ini bekerja sebagai intern IT Support di PT ASABRI (Persero), perusahaan asuransi BUMN yang melayani prajurit TNI/Polri dan ASN.",
    "Saya fokus membangun sistem internal full-stack, alat intelijen media berbasis AI, dan pengalaman digital yang menyelesaikan masalah operasional nyata. Pekerjaan saya mencakup arsitektur backend, pipeline machine learning, dan desain UI — seringkali ketiganya sekaligus.",
    "Di luar pekerjaan, saya senang mengeksplorasi tools OSINT, membangun aplikasi produktivitas pribadi, dan mempelajari persinggungan antara AI dan komunikasi di sektor publik."
  ],
  pills_en: ['Full-Stack Developer', 'AI / ML Enthusiast', 'Visual Designer', 'BUMN — Jakarta', 'Open to Work'],
  pills_id: ['Full-Stack Developer', 'Penggemar AI / ML', 'Visual Designer', 'BUMN — Jakarta', 'Terbuka untuk Kerja']
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
