// ═══════════════════════════════════════════════════
// MAIN APP — app.js
// Portfolio rendering, theme, language, modal, animations
// ═══════════════════════════════════════════════════

/* ═══════════════════════════════
   STATE
═══════════════════════════════ */
let currentLang = 'en';
let currentTheme = 'light';
let currentFilter = 'all';
let portfolioData = {
  projects: DEFAULT_PROJECTS,
  building: DEFAULT_CURRENT_BUILDING,
  skills: DEFAULT_SKILLS,
  experiences: DEFAULT_EXPERIENCES,
  education: DEFAULT_EDUCATION,
  profile: DEFAULT_PROFILE
};

/* ═══════════════════════════════
   INIT
═══════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {
  // Restore saved preferences
  const savedTheme = localStorage.getItem('pf-theme');
  const savedLang = localStorage.getItem('pf-lang');
  if (savedTheme) {
    currentTheme = savedTheme;
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
  if (savedLang) {
    currentLang = savedLang;
  }

  // Try loading from Supabase
  const sbReady = initSupabase();
  if (sbReady) {
    await loadFromSupabase();
  }

  // Render all sections first with defaults
  renderAll();

  // Then apply language (which also re-renders with proper lang)
  applyLang(currentLang);

  // Load saved photo
  loadSavedPhoto();

  // Setup interactions
  setupScrollTop();
  setupMobileMenu();
  setupModalClose();

  // Setup animations — double rAF to ensure DOM is fully painted
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setupScrollReveal();
      setupCounterAnimation();
    });
  });

  // Page entrance
  document.querySelector('.wrap').classList.add('page-enter');

  // Initialize Analytics
  initAnalytics();
});

/* ═══════════════════════════════
   ANALYTICS TRACKING
═══════════════════════════════ */
function initAnalytics() {
  if (typeof logAnalyticsEvent !== 'function') return;

  // 1. Session Management
  let sessionId = sessionStorage.getItem('pf-session-id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('pf-session-id', sessionId);
  }

  // 2. Page View Tracking
  logAnalyticsEvent('pageview', window.location.pathname || '/', sessionId);

  // 3. CV Download Tracking
  const cvBtn = document.getElementById('cvDownloadBtn');
  if (cvBtn) {
    cvBtn.addEventListener('click', () => {
      logAnalyticsEvent('cv_download', 'cv_pdf', sessionId);
    });
  }

  // 4. Section View Tracking
  const trackedSections = new Set();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;
        if (sectionId && !trackedSections.has(sectionId)) {
          // Log only once per session per section
          trackedSections.add(sectionId);
          logAnalyticsEvent('section_view', sectionId, sessionId);
        }
      }
    });
  }, { threshold: 0.5 }); // Trigger when 50% of section is visible

  document.querySelectorAll('section.sec').forEach(sec => {
    observer.observe(sec);
  });
}

/* ═══════════════════════════════
   SUPABASE DATA LOADING
═══════════════════════════════ */
async function loadFromSupabase() {
  try {
    const [projects, skills, experiences, education, profile] = await Promise.all([
      fetchProjects(),
      fetchSkills(),
      fetchExperiences(),
      fetchEducation(),
      fetchProfile()
    ]);
    if (projects && projects.length) portfolioData.projects = projects;
    if (skills && skills.length) portfolioData.skills = skills;
    if (experiences && experiences.length) portfolioData.experiences = experiences;
    if (education && education.length) portfolioData.education = education;
    if (profile) portfolioData.profile = profile;
  } catch (e) {
    console.warn('[Portfolio] Supabase load failed, using defaults:', e);
  }
}

/* ═══════════════════════════════
   RENDER ALL SECTIONS
═══════════════════════════════ */
function renderAll() {
  renderHero();
  renderStats();
  renderTicker();
  renderAbout();
  renderEducation();
  renderProjects();
  renderBuilding();
  renderGithubStatus();
  renderExperience();
  renderSkills();
  renderContact();
  renderFooter();
}

/* ═══════════════════════════════
   RENDER HERO (name, tagline, bio, badge, location, CTA — all from profile)
═══════════════════════════════ */
function renderHero() {
  const p = portfolioData.profile;

  // Hero name
  const nameEl = document.getElementById('heroName');
  if (nameEl) {
    const heroName = p.hero_name || 'BIMA\nARYA';
    const parts = heroName.split('\n');
    nameEl.innerHTML = parts.map((line, i) =>
      i === parts.length - 1
        ? `${line}<span class="ac">.</span>`
        : `${line}<br>`
    ).join('');
  }

  // Tagline
  const taglineEl = document.getElementById('heroTagline');
  if (taglineEl) taglineEl.textContent = currentLang === 'id'
    ? (p.hero_tagline_id || p.hero_tagline_en || 'Full-Stack Developer & IT Communicator')
    : (p.hero_tagline_en || 'Full-Stack Developer & IT Communicator');

  // Bio (subtitle)
  const bioEl = document.getElementById('heroBio');
  if (bioEl) bioEl.textContent = currentLang === 'id' ? p.hero_bio_id : p.hero_bio_en;

  // Badge
  const badgeEl = document.getElementById('badgeText');
  if (badgeEl) badgeEl.textContent = currentLang === 'id'
    ? (p.badge_id || 'Terbuka untuk peluang baru')
    : (p.badge_en || 'Available for hire');

  // Location
  const locEl = document.getElementById('locBadge');
  if (locEl) locEl.textContent = p.location || 'Jakarta, Indonesia';

  // CTA buttons language
  const ctaProjects = document.querySelector('[data-i18n="cta_projects"]');
  if (ctaProjects) ctaProjects.textContent = currentLang === 'id' ? 'Lihat Proyek' : 'View Projects';
  const ctaCv = document.querySelector('[data-i18n="cta_cv"]');
  if (ctaCv) ctaCv.textContent = currentLang === 'id' ? 'Unduh CV' : 'Download CV';
}

/* ═══════════════════════════════
   RENDER STATS
═══════════════════════════════ */
function renderStats() {
  const container = document.getElementById('statsContainer');
  if (!container) return;
  const stats = portfolioData.profile.stats || [];
  if (!stats.length) { container.innerHTML = ''; return; }
  container.innerHTML = stats.map((s, i) => {
    const sep = i < stats.length - 1 ? '<div class="sdiv"></div>' : '';
    return `
      <div class="stat-item">
        <div class="stat-v" data-count="${s.value}">${s.value}</div>
        <div class="stat-l" data-stat-label="${i}">${currentLang === 'id' ? s.label_id : s.label_en}</div>
      </div>${sep}`;
  }).join('');
}

/* ═══════════════════════════════
   RENDER TICKER
═══════════════════════════════ */
function renderTicker() {
  const track = document.getElementById('tickerTrack');
  if (!track) return;
  const items = TICKER_ITEMS.map(t => `<span class="t-item">${t}</span>`).join('');
  track.innerHTML = items + items; // duplicate for infinite scroll
  // Force reflow so CSS animation restarts reliably
  track.style.animation = 'none';
  track.offsetHeight; // trigger reflow
  track.style.animation = '';
}

/* ═══════════════════════════════
   RENDER ABOUT (photo from profile, no upload on frontend)
═══════════════════════════════ */
function renderAbout() {
  const container = document.getElementById('aboutText');
  if (!container) return;
  const p = portfolioData.profile;
  const paragraphs = currentLang === 'id' ? p.about_id : p.about_en;
  container.innerHTML = paragraphs.map(t => `<p>${t}</p>`).join('');

  const pillsC = document.getElementById('aboutPills');
  if (pillsC) {
    const pills = currentLang === 'id' ? p.pills_id : p.pills_en;
    pillsC.innerHTML = pills.map(t => `<span class="apill">${t}</span>`).join('');
  }

  // Update hero photo
  const photoImg = document.getElementById('photoImg');
  const photoPlaceholder = document.getElementById('photoPlaceholder');
  if (photoImg && p.photo_url) {
    photoImg.src = p.photo_url;
    photoImg.style.display = 'block';
    if (photoPlaceholder) photoPlaceholder.style.display = 'none';
  } else if (photoImg) {
    photoImg.style.display = 'none';
    if (photoPlaceholder) photoPlaceholder.style.display = 'flex';
  }
}

/* ═══════════════════════════════
   RENDER EDUCATION (card layout)
═══════════════════════════════ */
function renderEducation() {
  const container = document.getElementById('eduContainer');
  if (!container) return;
  const eduList = portfolioData.education;

  container.innerHTML = eduList.map(e => {
    const degree = currentLang === 'id' ? e.degree_id : e.degree_en;
    const highlights = currentLang === 'id' ? e.highlights_id : e.highlights_en;
    return `
      <div class="edu-card reveal">
        <div class="edu-icon">
          <svg viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
        </div>
        <div class="edu-body">
          <div class="edu-degree">${degree}</div>
          <div class="edu-institution">${e.institution}</div>
          <div class="edu-meta">
            <span class="edu-period">${e.period}</span>
            <span class="edu-gpa">GPA: ${e.gpa}</span>
          </div>
          <div class="edu-highlights">
            ${highlights.map(h => `<span class="edu-tag">${h}</span>`).join('')}
          </div>
        </div>
      </div>`;
  }).join('');
}

/* ═══════════════════════════════
   RENDER PROJECTS
═══════════════════════════════ */
function renderProjects() {
  const grid = document.getElementById('projectGrid');
  const filterRow = document.getElementById('filterRow');
  if (!grid) return;

  // Render filter buttons
  if (filterRow) {
    const pCount = portfolioData.projects.length;
    filterRow.innerHTML = CATEGORIES.map(c => {
      const count = c.key === 'all'
        ? pCount
        : portfolioData.projects.filter(p => p.category === c.key).length;
      const label = currentLang === 'id' ? c.label_id : c.label_en;
      return `<button class="fb${c.key === currentFilter ? ' active' : ''}" 
                onclick="doFilter('${c.key}')">${label} (${count})</button>`;
    }).join('');
  }

  // Render project cards
  grid.innerHTML = portfolioData.projects.map((p, i) => {
    const desc = currentLang === 'id' ? p.desc_id : p.desc_en;
    const catLabel = CATEGORIES.find(c => c.key === p.category);
    const catDisplay = catLabel ? (currentLang === 'id' ? catLabel.label_id : catLabel.label_en) : p.category;
    const hidden = currentFilter !== 'all' && p.category !== currentFilter ? ' hidden' : '';
    const role = currentLang === 'id' ? (p.role_id || p.role_en || '') : (p.role_en || '');
    const statusLabel = p.status ? `<span class="p-status">${p.status}</span>` : '';
    return `
      <div class="pc reveal${hidden}" data-cat="${p.category}" data-id="${p.id}" onclick="openProjectModal(${p.id})">
        <div class="p-num">[${String(i + 1).padStart(2, '0')}] — ${catDisplay}</div>
        <div class="p-name">${p.name}</div>
        ${role ? `<div class="p-role">${role}</div>` : ''}
        <div class="p-desc">${desc}</div>
        <div class="p-tags">${(p.tags||[]).map(t => `<span class="tag">${t}</span>`).join('')}${statusLabel}</div>
        <div class="p-arrow">
          <svg viewBox="0 0 24 24"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
        </div>
      </div>`;
  }).join('');

  // Re-setup reveal for new elements
  setupScrollReveal();
}

/* ═══════════════════════════════
   RENDER CURRENTLY BUILDING
═══════════════════════════════ */
function renderBuilding() {
  const grid = document.getElementById('buildingGrid');
  if (!grid || !portfolioData.building || !portfolioData.building.length) return;

  grid.innerHTML = portfolioData.building.map(b => {
    const name = currentLang === 'id' ? b.name_id : b.name_en;
    const desc = currentLang === 'id' ? b.description_id : b.description_en;
    const status = currentLang === 'id' ? b.status_id : b.status_en;
    
    // Status styling colors
    let stColor = 'gray'; let stBg = 'rgba(255,255,255,0.1)';
    if(b.status_en === 'Active') { stColor = '#4ade80'; stBg = 'rgba(74, 222, 128, 0.1)'; }
    if(b.status_en === 'In Progress') { stColor = '#fbbf24'; stBg = 'rgba(251, 191, 36, 0.1)'; }
    if(b.status_en === 'Planning') { stColor = '#60a5fa'; stBg = 'rgba(96, 165, 250, 0.1)'; }

    return `
      <div class="reveal" style="border: 1px solid var(--border); border-radius: 12px; padding: 20px; transition: border-color 0.2s;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
          <h3 style="font-size: 16px; margin: 0;">${name}</h3>
          <span style="font-size: 11px; padding: 2px 8px; border-radius: 999px; background: ${stBg}; color: ${stColor}; font-weight: 500;">
            ${status}
          </span>
        </div>
        <p style="font-size: 14px; color: var(--text); opacity: 0.8; margin-bottom: 16px; line-height: 1.5;">${desc}</p>
        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
          ${b.stack.map(s => `<span class="tag" style="padding: 2px 6px; font-size: 11px;">${s}</span>`).join('')}
        </div>
      </div>
    `;
  }).join('');
}

/* ═══════════════════════════════
   RENDER GITHUB STATUS — v3
   Layout baru: Stats prominently di atas, heatmap full-width,
   streak + lang side-by-side, repos grid di bawah.
   Dark mode: glow effect, kontras tinggi, border accent.
═══════════════════════════════ */
async function renderGithubStatus() {
  const container = document.getElementById('githubContainer');
  if (!container) return;

  const username = 'ExRen';
  const isDark   = currentTheme === 'dark';
  const ac       = isDark ? '#E5673A' : '#C4401A';

  // Streak dari demolab
  const tColor   = isDark ? 'b0b0b0' : '666666';
  const streakUrl = `https://streak-stats.demolab.com/?user=${username}&theme=transparent&hide_border=true&stroke=${isDark?'E5673A':'C4401A'}&ring=${isDark?'E5673A':'C4401A'}&fire=${isDark?'E5673A':'C4401A'}&currStreakNum=${isDark?'E5673A':'C4401A'}&sideNums=${tColor}&sideLabels=${tColor}&dates=${tColor}&background=00000000`;

  // Contribution heatmap
  const chartColor = isDark ? '4ade80' : '2da44e';
  const chartUrl   = `https://ghchart.rshah.org/${chartColor}/${username}`;

  const t = {
    activity : currentLang === 'id' ? 'Aktivitas Kontribusi' : 'Contribution Activity',
    streak   : currentLang === 'id' ? 'Streak & Total'       : 'Streak & Total',
    repos    : currentLang === 'id' ? 'Repositori'           : 'Repositories',
    stars    : currentLang === 'id' ? 'Bintang'              : 'Stars',
    followers: 'Followers',
    contribs : currentLang === 'id' ? 'Kontribusi'           : 'Contributions',
    langs    : currentLang === 'id' ? 'Bahasa Terpakai'      : 'Top Languages',
    pinned   : currentLang === 'id' ? 'Repositori Pilihan'   : 'Pinned Repositories',
    noDesc   : currentLang === 'id' ? 'Tidak ada deskripsi.' : 'No description.',
    noRepos  : currentLang === 'id' ? 'Tidak ada repositori.' : 'No repositories.',
    streakNA : currentLang === 'id' ? 'Streak tidak tersedia' : 'Streak unavailable',
  };

  container.innerHTML = `
    <div class="ghv3-root">

      <!-- ══ PROFIL ROW ══════════════════════════════════ -->
      <div class="ghv3-profile-row">
        <div class="ghv3-avatar-wrap">
          <div class="ghv3-avatar-skel" id="ghAvatarSkel"></div>
          <img id="ghAvatar" src="" alt="${username}" class="ghv3-avatar" style="display:none"
               onerror="this.style.display='none';document.getElementById('ghAvatarSkel').style.display='block'">
        </div>
        <div class="ghv3-profile-info">
          <h3 class="ghv3-name ghv3-skel" id="ghName">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h3>
          <span class="ghv3-username">@ExRen</span>
          <p class="ghv3-bio ghv3-skel" id="ghBio">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
          <div class="ghv3-meta-row">
            <span class="ghv3-meta-chip" id="ghFollowWrap">
              <svg viewBox="0 0 16 16" width="12" fill="currentColor">
                <path d="M2 5.5a3.5 3.5 0 115.898 2.549 5.507 5.507 0 013.035 5.174.75.75 0 11-1.499.03.4005.4005 0 00-.4-.4H3.5a.4.4 0 00-.4.4.75.75 0 01-1.499-.03 5.507 5.507 0 013.035-5.174A3.501 3.501 0 012 5.5z"/>
              </svg>
              <span id="ghFollowCount">–</span> followers · <span id="ghFollowingCount">–</span> following
            </span>
            <span class="ghv3-meta-chip" id="ghLocChip" style="display:none">
              <svg viewBox="0 0 16 16" width="12" fill="currentColor">
                <path d="M11.536 3.464a5 5 0 010 7.072L8 14.071 4.464 10.536a5 5 0 117.072-7.072zM8 9a2 2 0 100-4 2 2 0 000 4z"/>
              </svg>
              <span id="ghLocation"></span>
            </span>
          </div>
        </div>
      </div>

      <!-- ══ HERO STATS ══════════════════════════════════ -->
      <div class="ghv3-hero-stats" id="ghHeroStats" style="display:none">
        <div class="ghv3-stat-card ghv3-stat-accent">
          <div class="ghv3-stat-num" id="ghSnRepos">–</div>
          <div class="ghv3-stat-label">${t.repos}</div>
        </div>
        <div class="ghv3-stat-card">
          <div class="ghv3-stat-num" id="ghSnStars">–</div>
          <div class="ghv3-stat-label">${t.stars}</div>
        </div>
        <div class="ghv3-stat-card">
          <div class="ghv3-stat-num" id="ghSnFollowers">–</div>
          <div class="ghv3-stat-label">${t.followers}</div>
        </div>
        <div class="ghv3-stat-card">
          <div class="ghv3-stat-num" id="ghSnLangs">–</div>
          <div class="ghv3-stat-label">${t.langs}</div>
        </div>
      </div>

      <!-- ══ CONTRIBUTION HEATMAP ═══════════════════════ -->
      <div class="ghv3-section">
        <div class="ghv3-section-hd">
          <span class="ghv3-section-dot"></span>
          ${t.activity}
        </div>
        <div class="ghv3-heatmap-box">
          <img
            src="${chartUrl}"
            class="ghv3-heatmap-img"
            alt="Contribution Graph"
            loading="lazy"
            onerror="this.parentElement.style.display='none'">
        </div>
      </div>

      <!-- ══ STREAK + LANGUAGE ═══════════════════════════ -->
      <div class="ghv3-mid-row">

        <!-- Streak -->
        <div class="ghv3-section ghv3-section-streak">
          <div class="ghv3-section-hd">
            <span class="ghv3-section-dot"></span>
            ${t.streak}
          </div>
          <div class="ghv3-streak-wrap">
            <img
              src="${streakUrl}"
              class="ghv3-streak-img"
              alt="GitHub Streak"
              loading="lazy"
              onerror="this.style.display='none';document.getElementById('ghStreakNA').style.display='flex'">
            <div id="ghStreakNA" class="ghv3-na-box" style="display:none">
              <svg viewBox="0 0 24 24" width="20" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/>
              </svg>
              ${t.streakNA}
            </div>
          </div>
        </div>

        <!-- Language bar -->
        <div class="ghv3-section ghv3-section-lang" id="ghLangSection" style="display:none">
          <div class="ghv3-section-hd">
            <span class="ghv3-section-dot"></span>
            ${t.langs}
          </div>
          <div class="ghv3-lang-bar" id="ghLangBar"></div>
          <div class="ghv3-lang-legend" id="ghLangLegend"></div>
        </div>

      </div>

      <!-- ══ REPOS GRID ═══════════════════════════════════ -->
      <div class="ghv3-section">
        <div class="ghv3-section-hd">
          <span class="ghv3-section-dot"></span>
          ${t.pinned}
        </div>
        <div class="ghv3-repos-grid" id="ghPinnedGrid">
          ${[1,2,3,4,5,6].map(() =>
            `<div class="ghv3-repo-skel ghv3-skel"></div>`
          ).join('')}
        </div>
      </div>

    </div>

    <style>
      /* ══ ROOT ══════════════════════════════════════════ */
      .ghv3-root {
        display: flex;
        flex-direction: column;
        gap: 28px;
      }

      /* ══ SKELETON ══════════════════════════════════════ */
      .ghv3-skel {
        background: var(--border) !important;
        border-radius: 6px;
        animation: ghv3Pulse 1.6s ease-in-out infinite;
        color: transparent !important;
        border-color: transparent !important;
      }
      .ghv3-avatar-skel {
        width: 64px; height: 64px; border-radius: 50%;
        background: var(--border);
        animation: ghv3Pulse 1.6s ease-in-out infinite;
      }
      .ghv3-repo-skel { min-height: 100px; border-radius: 10px; }
      @keyframes ghv3Pulse {
        0%,100% { opacity:1 } 50% { opacity:0.3 }
      }

      /* ══ PROFIL ROW ════════════════════════════════════ */
      .ghv3-profile-row {
        display: flex;
        align-items: center;
        gap: 18px;
      }
      .ghv3-avatar-wrap { position:relative; flex-shrink:0; }
      .ghv3-avatar {
        width: 64px; height: 64px;
        border-radius: 50%;
        border: 2px solid ${ac};
        box-shadow: 0 0 0 4px ${isDark ? 'rgba(229,103,58,0.15)' : 'rgba(196,64,26,0.1)'};
        object-fit: cover;
      }
      .ghv3-profile-info { flex:1; min-width:0; }
      .ghv3-name {
        font-size: 20px; font-weight: 700;
        color: var(--fg); margin: 0 0 2px;
        letter-spacing: -0.02em;
      }
      .ghv3-username {
        font-size: 13px; font-family: var(--font-mono, monospace);
        color: ${ac}; opacity:0.85;
        display: block; margin-bottom: 4px;
      }
      .ghv3-bio {
        font-size: 13px; color: var(--text); opacity:${isDark ? '0.85' : '0.7'};
        margin: 0 0 8px; line-height: 1.4;
      }
      .ghv3-meta-row { display:flex; flex-wrap:wrap; gap:8px; }
      .ghv3-meta-chip {
        display: inline-flex; align-items: center; gap: 4px;
        font-size: 12px; color: var(--text); opacity: ${isDark ? '0.85' : '0.65'};
        background: ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'};
        border: 1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'var(--border)'};
        border-radius: 999px; padding: 3px 10px;
      }

      /* ══ HERO STATS ════════════════════════════════════ */
      .ghv3-hero-stats {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
      }
      @media (max-width: 560px) {
        .ghv3-hero-stats { grid-template-columns: repeat(2, 1fr); }
      }
      .ghv3-stat-card {
        position: relative;
        padding: 18px 12px 14px;
        border-radius: 12px;
        border: 1px solid var(--border);
        background: ${isDark
          ? 'rgba(255,255,255,0.03)'
          : 'rgba(0,0,0,0.02)'};
        text-align: center;
        transition: border-color 0.2s, transform 0.2s;
        overflow: hidden;
      }
      .ghv3-stat-card:hover {
        border-color: ${ac};
        transform: translateY(-2px);
      }
      .ghv3-stat-card.ghv3-stat-accent {
        border-color: ${isDark ? 'rgba(229,103,58,0.5)' : 'rgba(196,64,26,0.4)'};
        background: ${isDark
          ? 'rgba(229,103,58,0.08)'
          : 'rgba(196,64,26,0.05)'};
      }
      .ghv3-stat-card.ghv3-stat-accent::before {
        content: '';
        position: absolute; top:0; left:50%; transform:translateX(-50%);
        width: 60%; height: 2px;
        background: ${ac};
        border-radius: 0 0 4px 4px;
      }
      .ghv3-stat-num {
        font-size: 32px;
        font-weight: 800;
        font-family: var(--font-mono, monospace);
        color: ${ac};
        line-height: 1;
        margin-bottom: 6px;
        ${isDark ? `text-shadow: 0 0 24px rgba(229,103,58,0.7), 0 0 48px rgba(229,103,58,0.25);` : ''}
      }
      .ghv3-stat-label {
        font-size: 11px;
        font-family: var(--font-mono, monospace);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--text);
        opacity: 0.5;
      }

      /* ══ SECTION HEADER ════════════════════════════════ */
      .ghv3-section-hd {
        display: flex; align-items: center; gap: 8px;
        font-size: 11px;
        font-family: var(--font-mono, monospace);
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--text);
        opacity: 0.5;
        margin-bottom: 12px;
      }
      .ghv3-section-dot {
        display: inline-block;
        width: 6px; height: 6px; border-radius: 50%;
        background: ${ac};
        box-shadow: ${isDark ? `0 0 6px ${ac}` : 'none'};
        flex-shrink: 0;
      }

      /* ══ HEATMAP ═══════════════════════════════════════ */
      .ghv3-heatmap-box {
        width: 100%;
        border-radius: 10px;
        overflow: hidden;
        border: 1px solid ${isDark ? 'rgba(229,103,58,0.2)' : 'rgba(0,0,0,0.08)'};
        background: ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'};
        padding: 14px 10px;
      }
      .ghv3-heatmap-img {
        width: 100%; height: auto; display: block;
        ${isDark
          ? 'filter: brightness(1.4) contrast(1.2) saturate(1.3);'
          : 'filter: saturate(1.1);'}
      }

      /* ══ MID ROW (streak + langs) ══════════════════════ */
      .ghv3-mid-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }
      @media (max-width: 600px) {
        .ghv3-mid-row { grid-template-columns: 1fr; }
      }
      .ghv3-section-streak, .ghv3-section-lang {
        border: 1px solid ${isDark ? 'rgba(229,103,58,0.18)' : 'rgba(0,0,0,0.07)'};
        border-radius: 12px;
        padding: 16px;
        background: ${isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'};
      }
      .ghv3-streak-wrap { width:100%; }
      .ghv3-streak-img  { width:100%; height:auto; display:block; }
      .ghv3-na-box {
        display:flex; align-items:center; gap:8px;
        font-size:12px; color:var(--text); opacity:0.45;
        padding:12px; border:1px dashed var(--border); border-radius:8px;
      }

      /* ══ LANGUAGE BAR ══════════════════════════════════ */
      .ghv3-lang-bar {
        display: flex; height: 10px;
        border-radius: 999px; overflow: hidden;
        gap: 3px; margin-bottom: 14px;
        background: var(--border);
      }
      .ghv3-lang-seg {
        border-radius: 999px; flex-shrink: 0;
        transition: flex 0.4s ease;
      }
      .ghv3-lang-legend {
        display: flex; flex-wrap: wrap; gap: 8px 14px;
      }
      .ghv3-lang-item {
        display: flex; align-items: center; gap: 5px;
        font-size: 11px; color: var(--text); opacity: 0.75;
        font-family: var(--font-mono, monospace);
      }
      .ghv3-lang-dot {
        width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0;
        ${isDark ? 'box-shadow: 0 0 4px currentColor;' : ''}
      }

      /* ══ REPOS GRID ════════════════════════════════════ */
      .ghv3-repos-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
      }
      @media (max-width: 540px) {
        .ghv3-repos-grid { grid-template-columns: 1fr; }
      }
      .gh-pinned-card {
        display: flex; flex-direction: column;
        border: 1px solid var(--border);
        border-radius: 10px;
        padding: 14px;
        text-decoration: none;
        background: ${isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.015)'};
        transition: border-color 0.18s, background 0.18s, transform 0.18s;
        gap: 6px;
      }
      .gh-pinned-card:hover {
        border-color: ${ac};
        background: ${isDark ? 'rgba(229,103,58,0.07)' : 'rgba(196,64,26,0.04)'};
        transform: translateY(-2px);
        ${isDark ? `box-shadow: 0 4px 20px rgba(229,103,58,0.15);` : ''}
      }
      .gh-pinned-header {
        display: flex; align-items: center; gap: 6px;
        font-size: 13px; font-weight: 600;
        color: ${ac};
      }
      .gh-repo-icon { opacity: 0.7; flex-shrink:0; }
      .gh-repo-name { flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      .gh-repo-badge {
        font-size: 10px; padding: 1px 6px; border-radius: 999px;
        border: 1px solid ${isDark ? 'rgba(229,103,58,0.4)' : 'rgba(196,64,26,0.3)'};
        color: ${ac}; flex-shrink:0; font-family:var(--font-mono,monospace);
      }
      .gh-repo-desc {
        font-size: 12px; color: var(--text); opacity: 0.65;
        line-height: 1.4; flex:1;
      }
      .gh-repo-footer {
        display: flex; align-items: center; gap: 10px;
        font-size: 11px; color: var(--text); opacity: 0.55;
        margin-top: 4px;
      }
      .gh-repo-lang { display:flex; align-items:center; gap:4px; }
      .gh-lang-dot  { width:9px; height:9px; border-radius:50%; }
      .gh-repo-stars{ display:flex; align-items:center; gap:3px; }
    </style>
  `;

  // ─── GitHub REST API ──────────────────────────────────────────
  try {
    const hdrs = { 'Accept': 'application/vnd.github.v3+json' };
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers: hdrs }),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, { headers: hdrs })
    ]);

    // ── User ──
    const clearSkel = (id, text) => {
      const el = document.getElementById(id);
      if (el) { el.classList.remove('ghv3-skel'); el.textContent = text; }
    };

    if (userRes.ok) {
      const u = await userRes.json();
      const avatarEl  = document.getElementById('ghAvatar');
      const avatarSkel = document.getElementById('ghAvatarSkel');
      if (avatarEl) { avatarEl.src = u.avatar_url; avatarEl.style.display = 'block'; }
      if (avatarSkel) avatarSkel.style.display = 'none';
      clearSkel('ghName', u.name || username);
      clearSkel('ghBio',  u.bio  || '');
      const fc = document.getElementById('ghFollowCount');
      const fi = document.getElementById('ghFollowingCount');
      if (fc) fc.textContent = u.followers;
      if (fi) fi.textContent = u.following;
      if (u.location) {
        const lc = document.getElementById('ghLocChip');
        const ll = document.getElementById('ghLocation');
        if (lc) lc.style.display = 'inline-flex';
        if (ll) ll.textContent = u.location;
      }
      const snFoll = document.getElementById('ghSnFollowers');
      if (snFoll) snFoll.textContent = u.followers;
    } else {
      clearSkel('ghName', username);
      clearSkel('ghBio', '');
    }

    // ── Repos ──
    if (reposRes.ok) {
      const repos = await reposRes.json();

      // Hero stats
      const totalStars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
      const langMap    = {};
      repos.forEach(r => { if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1; });
      const topLangs   = Object.entries(langMap).sort((a,b)=>b[1]-a[1]);

      const snR = document.getElementById('ghSnRepos');
      const snS = document.getElementById('ghSnStars');
      const snL = document.getElementById('ghSnLangs');
      if (snR) snR.textContent = repos.length;
      if (snS) snS.textContent = totalStars;
      if (snL) snL.textContent = topLangs.length;

      const heroEl = document.getElementById('ghHeroStats');
      if (heroEl) heroEl.style.display = 'grid';

      // Language bar
      if (topLangs.length) {
        const total    = topLangs.reduce((s,[,v])=>s+v,0);
        const top5     = topLangs.slice(0,5);
        const langSec  = document.getElementById('ghLangSection');
        const langBar  = document.getElementById('ghLangBar');
        const langLeg  = document.getElementById('ghLangLegend');
        if (langSec) langSec.style.display = 'flex';
        if (langBar) {
          langBar.innerHTML = top5.map(([lang, cnt]) => {
            const pct = (cnt/total*100).toFixed(1);
            return `<div class="ghv3-lang-seg" style="width:${pct}%;background:${getLangColor(lang)}" title="${lang} ${pct}%"></div>`;
          }).join('');
        }
        if (langLeg) {
          langLeg.innerHTML = top5.map(([lang, cnt]) => {
            const pct = (cnt/total*100).toFixed(1);
            return `<div class="ghv3-lang-item">
              <span class="ghv3-lang-dot" style="background:${getLangColor(lang)}"></span>
              ${lang}&nbsp;<span style="opacity:0.45">${pct}%</span>
            </div>`;
          }).join('');
        }
      }

      // Pinned repos grid
      const gridEl = document.getElementById('ghPinnedGrid');
      if (gridEl) {
        const show = repos.slice(0, 6);
        if (!show.length) {
          gridEl.innerHTML = `<p style="color:var(--text);opacity:0.45;font-size:13px;grid-column:1/-1">${t.noRepos}</p>`;
        } else {
          gridEl.innerHTML = show.map(repo => `
            <a href="${repo.html_url}" target="_blank" rel="noopener" class="gh-pinned-card">
              <div class="gh-pinned-header">
                <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" class="gh-repo-icon">
                  <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z"/>
                </svg>
                <span class="gh-repo-name">${repo.name}</span>
                <span class="gh-repo-badge">Public</span>
              </div>
              <div class="gh-repo-desc">${repo.description
                ? repo.description
                : `<span style="opacity:0.4">${t.noDesc}</span>`}</div>
              <div class="gh-repo-footer">
                ${repo.language ? `
                  <span class="gh-repo-lang">
                    <span class="gh-lang-dot" style="background:${getLangColor(repo.language)}"></span>
                    ${repo.language}
                  </span>` : ''}
                <span class="gh-repo-stars">
                  <svg viewBox="0 0 16 16" width="12" fill="currentColor">
                    <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
                  </svg>
                  ${repo.stargazers_count}
                </span>
              </div>
            </a>
          `).join('');
        }
      }
    } else {
      const gridEl = document.getElementById('ghPinnedGrid');
      if (gridEl) gridEl.innerHTML = `<p style="color:var(--text);opacity:0.45;font-size:13px;grid-column:1/-1">${t.noRepos}</p>`;
    }

  } catch (err) {
    console.error('[GitHub] Fetch error:', err);
    clearSkel = (id, text) => {
      const el = document.getElementById(id);
      if (el) { el.classList.remove('ghv3-skel'); el.textContent = text || ''; }
    };
    ['ghName','ghBio'].forEach(id => clearSkel(id, id==='ghName'?username:''));
    const avatarSkel = document.getElementById('ghAvatarSkel');
    if (avatarSkel) avatarSkel.style.display = 'none';
  }

  setupScrollReveal();
}

function getLangColor(lang) {
  const colors = {
    JavaScript:'#f1e05a', TypeScript:'#3178c6',
    Python:'#3572A5',     HTML:'#e34c26',
    CSS:'#563d7c',        PHP:'#4F5D95',
    Vue:'#41b883',        'C++':'#f34b7d',
    Java:'#b07219',       Go:'#00ADD8',
    Rust:'#dea584',       Shell:'#89e051',
    Kotlin:'#A97BFF',     Swift:'#F05138'
  };
  return colors[lang] || '#8b949e';
}


/* ═══════════════════════════════
   RENDER EXPERIENCE — MILESTONE TIMELINE
   Sub-sections: Professional & Organization
═══════════════════════════════ */
function renderExperience() {
  const container = document.getElementById('expContainer');
  if (!container) return;

  const t = TRANSLATIONS[currentLang];
  const allExp = portfolioData.experiences;

  // Split by type
  const professional = allExp.filter(e => e.type === 'professional');
  const organization = allExp.filter(e => e.type === 'organization' || (!e.type && !professional.includes(e)));

  let html = '';

  // Professional section
  if (professional.length) {
    html += `
      <div class="exp-section reveal">
        <div class="exp-section-title">
          <svg viewBox="0 0 24 24" class="exp-icon"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>
          <span>${t.exp_professional}</span>
        </div>
        <div class="timeline">
          ${professional.map(e => renderTimelineItem(e)).join('')}
        </div>
      </div>`;
  }

  // Organization section
  if (organization.length) {
    html += `
      <div class="exp-section reveal">
        <div class="exp-section-title">
          <svg viewBox="0 0 24 24" class="exp-icon"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
          <span>${t.exp_organization}</span>
        </div>
        <div class="timeline">
          ${organization.map(e => renderTimelineItem(e)).join('')}
        </div>
      </div>`;
  }

  container.innerHTML = html;
}

function renderTimelineItem(e) {
  const title = currentLang === 'id' ? (e.title_id || e.title_en) : e.title_en;
  const desc = currentLang === 'id' ? (e.desc_id || e.desc_en) : e.desc_en;
  const period = e.period.replace('NOW', currentLang === 'id' ? 'SEKARANG' : 'NOW');
  const isActive = e.period.includes('NOW');
  const location = currentLang === 'id' ? (e.location_id || e.location_en || '') : (e.location_en || '');
  const achievement = currentLang === 'id' ? (e.achievement_id || e.achievement_en || '') : (e.achievement_en || '');
  const toolsHtml = (e.tools && e.tools.length)
    ? `<div class="timeline-tools">${e.tools.map(t => `<span class="tool-tag">${t}</span>`).join('')}</div>`
    : '';
  return `
    <div class="timeline-item${isActive ? ' active' : ''}">
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <div class="timeline-period">${period}</div>
        <div class="timeline-title">${title}</div>
        <div class="timeline-org">${e.org}${location ? ` · ${location}` : ''}</div>
        <div class="timeline-desc">${desc}</div>
        ${achievement ? `<div class="timeline-achievement">⭐ ${achievement}</div>` : ''}
        ${toolsHtml}
      </div>
    </div>`;
}

/* ═══════════════════════════════
   RENDER SKILLS
═══════════════════════════════ */
function renderSkills() {
  const container = document.getElementById('skillsContainer');
  if (!container) return;
  const groups = {};
  portfolioData.skills.forEach(s => {
    if (!groups[s.group_name]) groups[s.group_name] = [];
    groups[s.group_name].push(s);
  });

  container.innerHTML = Object.entries(groups).map(([groupName, skills]) => {
    const gName = groupName === 'Certifications' && currentLang === 'id' ? 'Sertifikasi' : groupName;
    return `
      <div class="sg reveal">
        <div class="sg-title">${gName}</div>
        <div class="stags">
          ${skills.map(s => `<span class="sk${s.is_featured ? ' f' : ''}">${s.name}</span>`).join('')}
        </div>
      </div>`;
  }).join('');
}

/* ═══════════════════════════════
   RENDER CONTACT (from profile)
═══════════════════════════════ */
function renderContact() {
  const container = document.getElementById('contactLinks');
  const ctaEl = document.getElementById('ctaText');
  if (!container) return;
  const p = portfolioData.profile;

  // CTA text from profile
  if (ctaEl) {
    ctaEl.innerHTML = currentLang === 'id'
      ? (p.contact_cta_id || 'Mari<br>bekerja<span style="color:var(--ac)">.</span>')
      : (p.contact_cta_en || 'Let\'s<br>work<span style="color:var(--ac)">.</span>');
  }

  const links = [
    { href: `mailto:${p.contact_email}`, text: p.contact_email, icon: '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>' },
    { href: p.contact_linkedin, text: 'linkedin.com/in/bima-aryadinata', icon: '<path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>' },
    { href: p.contact_portfolio, text: 's.id/PortFolioBimaAryadinata', icon: '<path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>' },
    { href: p.contact_github || 'https://github.com/ExRen', text: 'github.com/ExRen', icon: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>' }
  ];
  container.innerHTML = links.map(l =>
    `<a class="cl" href="${l.href}" target="_blank" rel="noopener">
      <svg viewBox="0 0 24 24">${l.icon}</svg>${l.text}
    </a>`
  ).join('');
}

/* ═══════════════════════════════
   RENDER FOOTER (from profile)
═══════════════════════════════ */
function renderFooter() {
  const p = portfolioData.profile;
  const ftEl = document.getElementById('footerText');
  const faEl = document.getElementById('footerAdmin');
  const year = new Date().getFullYear();
  if (ftEl) ftEl.textContent = currentLang === 'id'
    ? (p.footer_id || `© ${year} Bima Aryadinata`).replace('2025', year)
    : (p.footer_en || `© ${year} Bima Aryadinata`).replace('2025', year);
  if (faEl) faEl.textContent = TRANSLATIONS[currentLang].footer_admin;
}

/* ═══════════════════════════════
   THEME TOGGLE
═══════════════════════════════ */
function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  localStorage.setItem('pf-theme', currentTheme);
  renderGithubStatus(); // Update github cards colors
}

/* ═══════════════════════════════
   LANGUAGE
═══════════════════════════════ */
function toggleLang() {
  applyLang(currentLang === 'en' ? 'id' : 'en');
}

function applyLang(lang) {
  currentLang = lang;
  const t = TRANSLATIONS[lang];
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('data-lang', lang);

  // Flag + label
  const flagEl = document.getElementById('langFlag');
  const labelEl = document.getElementById('langLabel');
  if (flagEl) flagEl.innerHTML = lang === 'en' ? '&#127468;&#127463;' : '&#127470;&#127465;';
  if (labelEl) labelEl.textContent = lang === 'en' ? 'EN' : 'ID';

  // Nav links with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  // Re-render all dynamic sections (they read currentLang)
  renderAll();

  // Re-setup scroll reveal for newly rendered elements
  requestAnimationFrame(() => {
    setupScrollReveal();
    setupCounterAnimation();
  });

  localStorage.setItem('pf-lang', lang);
}

/* ═══════════════════════════════
   PROJECT FILTER
═══════════════════════════════ */
function doFilter(cat) {
  currentFilter = cat;
  renderProjects();
}

/* ═══════════════════════════════
   PROJECT DETAIL MODAL
═══════════════════════════════ */
function openProjectModal(id) {
  const project = portfolioData.projects.find(p => p.id === id);
  if (!project) return;

  const t = TRANSLATIONS[currentLang];
  const detail = currentLang === 'id' ? project.detail_id : project.detail_en;
  const catLabel = CATEGORIES.find(c => c.key === project.category);
  const catDisplay = catLabel ? (currentLang === 'id' ? catLabel.label_id : catLabel.label_en) : project.category;
  const role = currentLang === 'id' ? (project.role_id || project.role_en || '') : (project.role_en || '');

  let linksHTML = '';
  if (project.github_url) {
    linksHTML += `<a class="modal-link" href="${project.github_url}" target="_blank" rel="noopener">
      <svg viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>
      ${t.modal_github}
    </a>`;
  }
  if (project.live_url) {
    linksHTML += `<a class="modal-link" href="${project.live_url}" target="_blank" rel="noopener">
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
      ${t.modal_live}
    </a>`;
  }

  // Build gallery HTML if project has images
  const images = project.images || [];
  let galleryHTML = '';
  if (images.length) {
    const slides = images.map((url, i) =>
      `<div class="gallery-slide${i === 0 ? ' active' : ''}" data-idx="${i}">
        <img src="${url}" alt="${project.name} — Doc ${i + 1}" loading="lazy" onclick="openLightbox(${id}, ${i})">
      </div>`
    ).join('');

    const dots = images.length > 1
      ? `<div class="gallery-dots">${images.map((_, i) =>
          `<button class="gallery-dot${i === 0 ? ' active' : ''}" onclick="goToSlide(${i})" aria-label="Photo ${i + 1}"></button>`
        ).join('')}</div>`
      : '';

    const arrows = images.length > 1
      ? `<button class="gallery-arrow gallery-prev" onclick="slideGallery(-1)" aria-label="Previous">
           <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
         </button>
         <button class="gallery-arrow gallery-next" onclick="slideGallery(1)" aria-label="Next">
           <svg viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18"/></svg>
         </button>`
      : '';

    const counter = images.length > 1
      ? `<div class="gallery-counter"><span id="galleryIdx">1</span> / ${images.length}</div>`
      : '';

    galleryHTML = `
      <div class="modal-gallery-section">
        <div class="modal-gallery-title">
          <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          ${t.modal_gallery}
        </div>
        <div class="gallery-carousel" id="galleryCarousel" data-current="0" data-total="${images.length}">
          <div class="gallery-track">${slides}</div>
          ${arrows}
          ${counter}
        </div>
        ${dots}
      </div>`;
  }

  let metricsHTML = '';
  if (project.metrics && project.metrics.length > 0) {
    metricsHTML = `<div class="modal-metrics" style="display:flex; flex-wrap:wrap; gap:8px; margin: 16px 0;">
      ${project.metrics.map(m => `
        <div style="background:var(--card-bg); border:1px solid var(--border); border-radius:6px; padding:6px 10px; font-size:12px;">
          <strong style="color:var(--fg); display:block; font-family:var(--font-mono);">${m.value}</strong>
          <span style="color:var(--text); opacity:0.8;">${currentLang === 'id' ? m.label_id : m.label_en}</span>
        </div>
      `).join('')}
    </div>`;
  }

  const modalBody = document.getElementById('modalBody');
  if (modalBody) {
    modalBody.innerHTML = `
      <div class="modal-category">${catDisplay}${project.status ? ` · ${project.status}` : ''}</div>
      <h2 class="modal-title">${project.name}</h2>
      ${role ? `<div class="modal-role">${role}</div>` : ''}
      ${project.highlight ? `<div class="modal-highlight">🏆 ${project.highlight}</div>` : ''}
      <div class="modal-desc">${detail || (currentLang === 'id' ? project.desc_id : project.desc_en)}</div>
      ${metricsHTML}
      ${galleryHTML}
      <div class="modal-tags">
        ${(project.tags||[]).map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
      ${linksHTML ? `<div class="modal-links">${linksHTML}</div>` : ''}
    `;
  }

  const overlay = document.getElementById('modalOverlay');
  if (overlay) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

/* ═══════════════════════════════
   GALLERY CAROUSEL CONTROLS
═══════════════════════════════ */
let currentSlide = 0;

function slideGallery(dir) {
  const carousel = document.getElementById('galleryCarousel');
  if (!carousel) return;
  const total = parseInt(carousel.dataset.total);
  currentSlide = (currentSlide + dir + total) % total;
  updateGalleryView();
}

function goToSlide(idx) {
  currentSlide = idx;
  updateGalleryView();
}

function updateGalleryView() {
  const carousel = document.getElementById('galleryCarousel');
  if (!carousel) return;

  // Update slides
  carousel.querySelectorAll('.gallery-slide').forEach((s, i) => {
    s.classList.toggle('active', i === currentSlide);
  });

  // Update dots
  document.querySelectorAll('.gallery-dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentSlide);
  });

  // Update counter
  const counter = document.getElementById('galleryIdx');
  if (counter) counter.textContent = currentSlide + 1;

  // Update carousel data
  carousel.dataset.current = currentSlide;
}

/* ═══════════════════════════════
   LIGHTBOX (full-size image view)
═══════════════════════════════ */
let lightboxImages = [];
let lightboxIdx = 0;

function openLightbox(projectId, idx) {
  const project = portfolioData.projects.find(p => p.id === projectId);
  if (!project || !project.images || !project.images.length) return;

  lightboxImages = project.images;
  lightboxIdx = idx;

  // Create lightbox if not exists
  let lb = document.getElementById('lightboxOverlay');
  if (!lb) {
    lb = document.createElement('div');
    lb.id = 'lightboxOverlay';
    lb.className = 'lightbox-overlay';
    lb.innerHTML = `
      <button class="lightbox-close" onclick="closeLightbox()">
        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <button class="lightbox-arrow lightbox-prev" onclick="lightboxNav(-1)">
        <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <img class="lightbox-img" id="lightboxImg" alt="Full-size documentation photo">
      <button class="lightbox-arrow lightbox-next" onclick="lightboxNav(1)">
        <svg viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18"/></svg>
      </button>
      <div class="lightbox-counter" id="lightboxCounter"></div>
    `;
    lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
    document.body.appendChild(lb);
  }

  updateLightbox();
  lb.classList.add('active');
}

function updateLightbox() {
  const img = document.getElementById('lightboxImg');
  const counter = document.getElementById('lightboxCounter');
  if (img) img.src = lightboxImages[lightboxIdx];
  if (counter) counter.textContent = `${lightboxIdx + 1} / ${lightboxImages.length}`;

  // Show/hide arrows
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');
  if (prevBtn) prevBtn.style.display = lightboxImages.length > 1 ? 'flex' : 'none';
  if (nextBtn) nextBtn.style.display = lightboxImages.length > 1 ? 'flex' : 'none';
}

function lightboxNav(dir) {
  lightboxIdx = (lightboxIdx + dir + lightboxImages.length) % lightboxImages.length;
  updateLightbox();
}

function closeLightbox() {
  const lb = document.getElementById('lightboxOverlay');
  if (lb) lb.classList.remove('active');
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function setupModalClose() {
  const overlay = document.getElementById('modalOverlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    // Lightbox takes priority
    const lb = document.getElementById('lightboxOverlay');
    if (lb && lb.classList.contains('active')) {
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') lightboxNav(-1);
      else if (e.key === 'ArrowRight') lightboxNav(1);
      return;
    }
    // Gallery carousel in modal
    const carousel = document.getElementById('galleryCarousel');
    if (carousel && document.getElementById('modalOverlay')?.classList.contains('active')) {
      if (e.key === 'ArrowLeft') slideGallery(-1);
      else if (e.key === 'ArrowRight') slideGallery(1);
    }
    if (e.key === 'Escape') closeModal();
  });
}

/* ═══════════════════════════════
   PHOTO (display only — upload is admin-only)
═══════════════════════════════ */
function loadSavedPhoto() {
  const saved = localStorage.getItem('pf-photo');
  const profileUrl = portfolioData.profile.photo_url;
  const src = saved || profileUrl;

  if (src) {
    const img = document.getElementById('photoImg');
    if (img) {
      img.src = src;
      img.classList.add('loaded');
    }
    const placeholder = document.getElementById('photoPlaceholder');
    if (placeholder) placeholder.style.display = 'none';
  }
}

/* ═══════════════════════════════
   SCROLL REVEAL (IntersectionObserver)
═══════════════════════════════ */
function setupScrollReveal() {
  const els = document.querySelectorAll('.reveal:not(.visible)');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ═══════════════════════════════
   STATS COUNTER ANIMATION
═══════════════════════════════ */
function setupCounterAnimation() {
  const statEls = document.querySelectorAll('.stat-v[data-count]');
  if (!statEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statEls.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const finalText = el.getAttribute('data-count');
  const numMatch = finalText.match(/[\d.]+/);
  if (!numMatch) return;

  const finalNum = parseFloat(numMatch[0]);
  const prefix = finalText.substring(0, finalText.indexOf(numMatch[0]));
  const suffix = finalText.substring(finalText.indexOf(numMatch[0]) + numMatch[0].length);
  const isFloat = numMatch[0].includes('.');
  const duration = 1200;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = isFloat
      ? (finalNum * eased).toFixed(numMatch[0].split('.')[1]?.length || 2)
      : Math.floor(finalNum * eased);
    el.textContent = prefix + current + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = finalText;
  }
  requestAnimationFrame(update);
}

/* ═══════════════════════════════
   SCROLL TO TOP
═══════════════════════════════ */
function setupScrollTop() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ═══════════════════════════════
   MOBILE MENU
═══════════════════════════════ */
function setupMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}