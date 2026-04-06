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
});

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
    { href: p.contact_portfolio, text: 's.id/PortFolioBimaAryadinata', icon: '<path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>' }
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
  if (ftEl) ftEl.textContent = currentLang === 'id' ? (p.footer_id || '© 2025 Bima Aryadinata') : (p.footer_en || '© 2025 Bima Aryadinata');
  if (faEl) faEl.textContent = TRANSLATIONS[currentLang].footer_admin;
}

/* ═══════════════════════════════
   THEME TOGGLE
═══════════════════════════════ */
function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  localStorage.setItem('pf-theme', currentTheme);
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

  const modalBody = document.getElementById('modalBody');
  if (modalBody) {
    modalBody.innerHTML = `
      <div class="modal-category">${catDisplay}${project.status ? ` · ${project.status}` : ''}</div>
      <h2 class="modal-title">${project.name}</h2>
      ${role ? `<div class="modal-role">${role}</div>` : ''}
      ${project.highlight ? `<div class="modal-highlight">🏆 ${project.highlight}</div>` : ''}
      <div class="modal-desc">${detail || (currentLang === 'id' ? project.desc_id : project.desc_en)}</div>
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
