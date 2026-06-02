# Portfolio Website — AI Agent Execution Guide
**Target:** `portfolio-bima-eosin.vercel.app` (Next.js / React SPA, deployed on Vercel)  
**Author:** Bima Aryadinata  
**Stack:** Next.js 14+, React, Tailwind CSS (assumed), Vercel Hosting  
**Purpose:** Actionable fix list for AI coding agent — prioritized, scoped, and ready to execute.

---

## Agent Instructions

> Execute tasks in the **Priority Order** listed below (P0 → P1 → P2).  
> Each task includes: **what to do**, **which file(s) to touch**, and **exact code to implement**.  
> Do NOT skip P0 tasks — they are blocking issues that make the site look unfinished.  
> After completing each task, verify the output compiles without errors before moving to the next.

---

## P0 — Critical Fixes (Execute First)

### TASK 1: Fix Broken Profile Image

**Problem:** Profile photo at `00 — About` section is returning an empty `src`, causing a broken image element on the page.

**Files to check:**
- `src/components/About.jsx` (or `AboutSection.tsx`)
- `public/` directory (verify image file exists)
- Any component rendering `<img src="" alt="Bima Aryadinata — Informatics Engineer" />`

**Fix:**
```jsx
// BEFORE (broken)
<img src="" alt="Bima Aryadinata — Informatics Engineer" />

// AFTER — Option A: local asset (place image at /public/images/bima-profile.jpg)
import Image from 'next/image';

<Image
  src="/images/bima-profile.jpg"
  alt="Bima Aryadinata — Full-Stack Developer & IT Communicator"
  width={400}
  height={400}
  priority
  className="rounded-xl object-cover"
  onError={(e) => {
    e.currentTarget.src = '/images/avatar-fallback.png'; // fallback placeholder
  }}
/>

// AFTER — Option B: if using external URL (e.g. LinkedIn CDN, Cloudinary)
// Add the domain to next.config.js:
```

```js
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // replace with your actual image host
      },
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
      }
    ],
  },
};
module.exports = nextConfig;
```

**Acceptance Criteria:** Profile image renders correctly on both desktop and mobile. If image fails to load, a styled placeholder/initials avatar appears — layout does NOT break.

---

### TASK 2: Add SEO Metadata (og:image, title, description)

**Problem:** Missing `<meta>` tags means link previews on LinkedIn, WhatsApp, and email clients show only a blank URL. This directly impacts recruiter trust.

**File to edit:** `src/app/layout.tsx` (App Router) OR `pages/_app.tsx` / `pages/index.tsx` (Pages Router)

**Fix — App Router (recommended):**
```tsx
// src/app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bima Aryadinata — Full-Stack Developer & IT Communicator',
  description:
    'Fresh graduate Informatics Engineer from Universitas Sriwijaya (GPA 3.93). Building AI-powered internal tools and enterprise digital systems. Available for hire in Jakarta, Indonesia.',
  metadataBase: new URL('https://portfolio-bima-eosin.vercel.app'),
  openGraph: {
    title: 'Bima Aryadinata — Full-Stack Developer & IT Communicator',
    description:
      'Informatics Engineer · Full-Stack Developer · AI/ML Builder. Based in Jakarta, Indonesia. GPA 3.93 · Universitas Sriwijaya.',
    url: 'https://portfolio-bima-eosin.vercel.app',
    siteName: 'Bima Aryadinata Portfolio',
    images: [
      {
        url: '/og-image.png', // Create this: 1200x630px image with photo + name + role
        width: 1200,
        height: 630,
        alt: 'Bima Aryadinata — Full-Stack Developer & IT Communicator',
      },
    ],
    locale: 'id_ID',
    alternateLocale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bima Aryadinata — Full-Stack Developer & IT Communicator',
    description: 'Informatics Engineer · Full-Stack · AI/ML Builder · Jakarta',
    images: ['/og-image.png'],
  },
  keywords: [
    'Bima Aryadinata',
    'Full-Stack Developer Jakarta',
    'IT Developer Indonesia',
    'Next.js Developer',
    'AI Engineer Indonesia',
    'Portfolio Informatics Engineer',
    'ASABRI IT',
    'Universitas Sriwijaya',
  ],
  authors: [{ name: 'Bima Aryadinata', url: 'https://portfolio-bima-eosin.vercel.app' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
```

**Also create:** `/public/og-image.png`
- Dimensions: **1200 × 630px**
- Content: Profile photo (left) + Name + Role + "Available for hire" badge + subtle background
- Tool suggestion: Use Figma or Canva to generate, export as PNG, place in `/public/`

---

### TASK 3: Add sitemap.xml and robots.txt

**Problem:** Google cannot efficiently crawl and index the site. Portfolio does not appear in search results when recruiter Googles "Bima Aryadinata".

**Fix — Next.js App Router (auto-generated):**

```ts
// src/app/sitemap.ts
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://portfolio-bima-eosin.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    // Add more URLs if you add case study pages later
  ];
}
```

```ts
// src/app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://portfolio-bima-eosin.vercel.app/sitemap.xml',
  };
}
```

**Verify after deploy:** Visit `https://portfolio-bima-eosin.vercel.app/sitemap.xml` and `https://portfolio-bima-eosin.vercel.app/robots.txt` — both should return valid responses.

---

### TASK 4: Add "Hire Me" CTA Button to Hero Section

**Problem:** No visible contact call-to-action in the hero. Recruiter who spends 30 seconds on the page may leave without knowing how to reach you.

**File:** `src/components/Hero.jsx` (or equivalent hero section component)

**Fix:**
```jsx
// Add alongside existing "View Projects" and "Download CV" buttons
<a
  href="#contact"
  className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium text-sm hover:bg-gray-100 transition-colors"
  // Adjust styling to match your existing design system
>
  <span className="relative flex h-2 w-2">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
  </span>
  Available for hire
</a>
```

**Also add a sticky contact button in Navbar:**
```jsx
// Inside your Navbar component, add at the end of nav links:
<a
  href="mailto:your@email.com" // replace with actual email
  className="ml-4 px-4 py-2 border border-current rounded-full text-sm font-medium hover:bg-white hover:text-black transition-colors hidden md:inline-flex"
>
  Contact
</a>
```

---

## P1 — High Priority Improvements

### TASK 5: Add Security Headers via vercel.json

**Problem:** Missing HTTP security headers. This is a glaring gap for a candidate applying to IT/tech roles.

**File:** Create `vercel.json` at project root (if it doesn't exist)

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=63072000; includeSubDomains; preload"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

**Verify after deploy:** Use [securityheaders.com](https://securityheaders.com) and input your URL. Target grade: **A or A+**.

---

### TASK 6: Add Quantitative Metrics to Each Project Card

**Problem:** Project descriptions are activity-based ("I built..."), not outcome-based. Recruiters care about impact, not effort.

**File:** `src/data/projects.js` (or wherever project data is stored — could be inline JSX)

**Updated data structure (add `metrics` array to each project):**
```js
const projects = [
  {
    id: 1,
    title: 'ASABRI Corporate Website Redesign',
    description: 'Solo end-to-end redesign of PT ASABRI (Persero) corporate website — from Figma wireframes to HTML/CSS implementation.',
    tech: ['Figma', 'HTML', 'CSS', 'JavaScript'],
    metrics: [
      { label: 'Page Speed Score', value: '+28pts', note: '61 → 89 (Lighthouse)' },
      { label: 'Sections Redesigned', value: '12+' },
      { label: 'Timeline', value: 'Solo, 3 months' },
    ],
    links: { github: null, live: null, figma: 'YOUR_FIGMA_LINK' },
  },
  {
    id: 2,
    title: 'MedMon v3.0 — Media Monitoring Dashboard',
    description: 'AI-powered media monitoring system for ASABRI using IndoBERT sentiment analysis, Supabase, and Streamlit.',
    tech: ['Python', 'Streamlit', 'IndoBERT', 'Supabase', 'PostgreSQL'],
    metrics: [
      { label: 'Sentiment F1 Macro', value: '0.896' },
      { label: 'DB Migrated', value: 'MySQL → Supabase' },
      { label: 'Articles Processed', value: '500+' },
    ],
    links: { github: 'YOUR_GITHUB_LINK', live: null },
  },
  {
    id: 3,
    title: 'ShopVerse — E-Commerce Platform',
    description: 'Full-stack Indonesian e-commerce app with payment gateway integration (Midtrans), Cloudinary CDN, and production deployment.',
    tech: ['Next.js 14', 'NestJS', 'PostgreSQL', 'Prisma', 'Midtrans', 'Cloudinary'],
    metrics: [
      { label: 'Payment Methods', value: '5+', note: 'GoPay, BCA, BNI, QRIS, PayLater' },
      { label: 'Deployment', value: 'Production VPS' },
      { label: 'Stack', value: 'Full-Stack' },
    ],
    links: { github: 'YOUR_GITHUB_LINK', live: 'YOUR_LIVE_URL' },
  },
];
```

**Update Project Card component to render metrics:**
```jsx
// Inside ProjectCard component
{project.metrics && (
  <div className="flex flex-wrap gap-2 mt-3 mb-4">
    {project.metrics.map((m, i) => (
      <div key={i} className="text-xs bg-white/5 border border-white/10 rounded-md px-2 py-1">
        <span className="font-semibold text-white">{m.value}</span>
        <span className="text-gray-400 ml-1">{m.label}</span>
      </div>
    ))}
  </div>
)}

{/* Project links */}
<div className="flex gap-3 mt-4">
  {project.links.github && (
    <a href={project.links.github} target="_blank" rel="noopener noreferrer"
       className="text-xs flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
      GitHub →
    </a>
  )}
  {project.links.live && (
    <a href={project.links.live} target="_blank" rel="noopener noreferrer"
       className="text-xs flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
      Live Demo →
    </a>
  )}
</div>
```

---

### TASK 7: Persist Language Preference in localStorage

**Problem:** EN/ID toggle resets on every page reload — poor UX for returning visitors.

**File:** Language toggle component (wherever `🇬🇧 EN` button lives)

```jsx
// In your language toggle component or context provider
import { useState, useEffect } from 'react';

const [lang, setLang] = useState('id'); // default to Indonesian

// Load from localStorage on mount
useEffect(() => {
  const saved = localStorage.getItem('portfolio-lang');
  if (saved === 'en' || saved === 'id') {
    setLang(saved);
  }
}, []);

// Save to localStorage on change
const toggleLang = () => {
  const next = lang === 'id' ? 'en' : 'id';
  setLang(next);
  localStorage.setItem('portfolio-lang', next);
};
```

---

### TASK 8: Expose GPA in Hero or Education Section

**Problem:** GPA 3.93/4.00 is a competitive differentiator for fresh graduates applying at BUMN or large corporations. It should not be buried.

**File:** Hero component OR Education section component

```jsx
// Add near your name/tagline in hero, or as a highlighted badge in Education:
<div className="flex flex-wrap gap-3 mt-4 text-sm text-gray-400">
  <span className="flex items-center gap-1.5">
    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
    GPA 3.93 / 4.00
  </span>
  <span className="flex items-center gap-1.5">
    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
    Universitas Sriwijaya
  </span>
  <span className="flex items-center gap-1.5">
    <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
    Informatics Engineering, 2024
  </span>
</div>
```

---

## P2 — Enhancement Tasks (Do After P0 + P1)

### TASK 9: Enable Vercel Analytics

**Problem:** No visibility into who visits your portfolio, from what source, and which sections they engage with. Data-blind = no iteration.

**File:** `src/app/layout.tsx`

```bash
# Step 1: Install
npm install @vercel/analytics
```

```tsx
// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        {children}
        <Analytics /> {/* Add this line */}
      </body>
    </html>
  );
}
```

**Also enable in Vercel Dashboard:** Go to `vercel.com/[your-project]` → Analytics tab → Enable.

---

### TASK 10: Add Structured Data (JSON-LD) for Google

**Problem:** Without structured data, Google cannot render rich results for your name. A candidate's portfolio should appear with rich snippets in search.

**File:** `src/app/layout.tsx` or `src/app/page.tsx`

```tsx
// Add inside <head> or as a Script component
import Script from 'next/script';

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Bima Aryadinata",
  "url": "https://portfolio-bima-eosin.vercel.app",
  "jobTitle": "Full-Stack Developer & IT Communicator",
  "alumniOf": {
    "@type": "EducationalOrganization",
    "name": "Universitas Sriwijaya"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Jakarta",
    "addressCountry": "ID"
  },
  "sameAs": [
    "https://www.linkedin.com/in/YOUR_LINKEDIN", // fill in
    "https://github.com/YOUR_GITHUB"              // fill in
  ]
};

// Inside your layout/page component:
<Script
  id="structured-data"
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
/>
```

---

### TASK 11: Add "Currently Building" Section

**Problem:** Portfolio only shows past work. Active projects signal growth mindset and passion — both highly valued by recruiters.

**File:** New component `src/components/CurrentlyBuilding.jsx`, add between Projects and Experience sections.

```jsx
const currentProjects = [
  {
    name: 'MedMon v3.0',
    description: 'AI-powered media monitoring dashboard for corporate use — IndoBERT sentiment analysis on Indonesian news.',
    status: 'Active',
    stack: ['Python', 'Streamlit', 'IndoBERT', 'Supabase'],
  },
  {
    name: 'Instagram Media Scraper',
    description: 'Internal tool for ASABRI social media monitoring using instagrapi and Python.',
    status: 'In Progress',
    stack: ['Python', 'instagrapi', 'Streamlit'],
  },
  {
    name: 'ROCKET Internal Tracker',
    description: 'Budget & approval workflow app for corporate division — React + NestJS + LDAP auth.',
    status: 'Planning',
    stack: ['React', 'NestJS', 'PostgreSQL', 'Prisma'],
  },
];

export default function CurrentlyBuilding() {
  return (
    <section id="building" className="py-20">
      <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-8">Currently Building</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {currentProjects.map((p) => (
          <div key={p.name} className="border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">{p.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                p.status === 'Active' ? 'bg-green-500/10 text-green-400' :
                p.status === 'In Progress' ? 'bg-yellow-500/10 text-yellow-400' :
                'bg-blue-500/10 text-blue-400'
              }`}>{p.status}</span>
            </div>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">{p.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {p.stack.map(s => (
                <span key={s} className="text-xs text-gray-500 border border-white/5 rounded px-2 py-0.5">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

---

## Vercel Deployment Checklist

After all code changes are made, run through this list before pushing to production:

```bash
# 1. Build locally first — catch errors before Vercel does
npm run build

# 2. Check for TypeScript/ESLint errors
npm run lint

# 3. Test production build locally
npm run start

# 4. Verify these URLs return valid responses after deploy:
# https://portfolio-bima-eosin.vercel.app/sitemap.xml
# https://portfolio-bima-eosin.vercel.app/robots.txt

# 5. Test link preview — paste URL in:
# - https://www.opengraph.xyz/  (og:image preview test)
# - https://cards-dev.twitter.com/validator (Twitter card)

# 6. Test security headers:
# - https://securityheaders.com/?q=portfolio-bima-eosin.vercel.app
# Target: Grade A or A+

# 7. Run Lighthouse audit in Chrome DevTools:
# Target scores: Performance >85, Accessibility >90, Best Practices >90, SEO >95
```

---

## Environment Variables (if needed)

If any new integrations require secrets, add them in **Vercel Dashboard → Project Settings → Environment Variables**:

```
# Never commit these to .env.local or git
NEXT_PUBLIC_SITE_URL=https://portfolio-bima-eosin.vercel.app
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX   # if using Google Analytics instead of Vercel Analytics
```

---

## Summary — Task Execution Order

| Priority | Task | Estimated Time | Impact |
|----------|------|---------------|--------|
| P0 | Fix broken profile image | 15 min | 🔴 Blocking |
| P0 | Add SEO metadata + og:image | 30 min | 🔴 Blocking |
| P0 | Add sitemap + robots.txt | 10 min | 🔴 Blocking |
| P0 | Add "Hire Me" CTA to hero | 20 min | 🔴 Blocking |
| P1 | Security headers (vercel.json) | 10 min | 🟠 High |
| P1 | Add metrics to project cards | 45 min | 🟠 High |
| P1 | Persist language in localStorage | 10 min | 🟠 High |
| P1 | Expose GPA in hero/education | 10 min | 🟠 High |
| P2 | Enable Vercel Analytics | 10 min | 🟡 Medium |
| P2 | Add JSON-LD structured data | 20 min | 🟡 Medium |
| P2 | "Currently Building" section | 45 min | 🟡 Medium |

**Total estimated time: ~3.5 hours for full execution (P0+P1+P2)**  
**P0 alone: ~75 minutes — do this today.**
