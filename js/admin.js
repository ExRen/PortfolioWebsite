// ═══════════════════════════════════════════════════
// ADMIN PANEL — admin.js
// Authentication, CRUD operations, export/import
// Full profile editor: hero, stats, location, footer, photo
// ═══════════════════════════════════════════════════

/* ═══════════════════════════════
   STATE
═══════════════════════════════ */
let adminUser = null;
let adminData = {
  projects: [],
  skills: [],
  experiences: [],
  education: [],
  profile: null
};
let currentTab = 'projects';
let editingItem = null;

/* ═══════════════════════════════
   INIT
═══════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {
  const savedTheme = localStorage.getItem('pf-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  const sbReady = initSupabase();
  if (!sbReady) {
    document.getElementById('loginError').textContent = 'Supabase JS failed to load or keys missing.';
    document.getElementById('loginError').classList.add('show');
    showLogin();
    return;
  }

  const session = await getSession();
  if (session) {
    adminUser = session.user;
    await loadAdminData();
    showDashboard();
  } else {
    showLogin();
  }
});

// Config screen logic removed - keys are now strictly defined in supabase-client.js

/* ═══════════════════════════════
   AUTH
═══════════════════════════════ */
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errorEl = document.getElementById('loginError');
  try {
    errorEl.classList.remove('show');
    const data = await signIn(email, password);
    adminUser = data.user;
    await loadAdminData();
    showDashboard();
  } catch (err) {
    errorEl.textContent = err.message || 'Login failed';
    errorEl.classList.add('show');
  }
}

async function handleLogout() {
  await signOut();
  adminUser = null;
  showLogin();
}

function showLogin() {
  const cfgEl = document.getElementById('configScreen');
  if (cfgEl) cfgEl.style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('dashboard').style.display = 'none';
}

function showDashboard() {
  const cfgEl = document.getElementById('configScreen');
  if (cfgEl) cfgEl.style.display = 'none';
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  const userEl = document.getElementById('adminEmail');
  if (userEl && adminUser) userEl.textContent = adminUser.email;
  renderTab();
}

/* ═══════════════════════════════
   DATA LOADING
═══════════════════════════════ */
async function loadAdminData() {
  try {
    const [projects, skills, experiences, education, profile] = await Promise.all([
      fetchProjects(), fetchSkills(), fetchExperiences(), fetchEducation(), fetchProfile()
    ]);
    adminData.projects = projects && projects.length ? projects : DEFAULT_PROJECTS;
    adminData.skills = skills && skills.length ? skills : DEFAULT_SKILLS;
    adminData.experiences = experiences && experiences.length ? experiences : DEFAULT_EXPERIENCES;
    adminData.education = education && education.length ? education : DEFAULT_EDUCATION;
    adminData.profile = profile || DEFAULT_PROFILE;
  } catch (e) {
    console.error('Load failed:', e);
    showToast('Failed to load data', 'error');
  }
}

/* ═══════════════════════════════
   TABS
═══════════════════════════════ */
function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === `panel-${tab}`));
  renderTab();
}

function renderTab() {
  switch (currentTab) {
    case 'projects': renderProjectsTable(); break;
    case 'skills': renderSkillsPanel(); break;
    case 'experience': renderExperienceTable(); break;
    case 'education': renderEducationTable(); break;
    case 'profile': renderProfileForm(); break;
  }
}

/* ═══════════════════════════════
   PROJECTS TABLE
═══════════════════════════════ */
function renderProjectsTable() {
  const tbody = document.getElementById('projectsTbody');
  if (!tbody) return;
  tbody.innerHTML = adminData.projects.map(p => `
    <tr>
      <td>${p.sort_order}</td>
      <td><strong>${p.name}</strong></td>
      <td>${p.category}</td>
      <td>${(p.tags||[]).join(', ')}</td>
      <td class="actions">
        <button class="btn btn-sm btn-secondary" onclick="editProject(${p.id})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteProject(${p.id})">Del</button>
      </td>
    </tr>`).join('');
}

function openProjectEditor(project = null) {
  editingItem = project;
  const overlay = document.getElementById('editorOverlay');
  document.getElementById('editorTitle').textContent = project ? 'Edit Project' : 'Add Project';
  document.getElementById('projName').value = project?.name || '';
  document.getElementById('projCategory').value = project?.category || 'fullstack';
  document.getElementById('projOrder').value = project?.sort_order || adminData.projects.length + 1;
  document.getElementById('projDescEn').value = project?.desc_en || '';
  document.getElementById('projDescId').value = project?.desc_id || '';
  document.getElementById('projDetailEn').value = project?.detail_en || '';
  document.getElementById('projDetailId').value = project?.detail_id || '';
  document.getElementById('projGithub').value = project?.github_url || '';
  document.getElementById('projLive').value = project?.live_url || '';
  const tagsWrap = document.getElementById('projTagsWrap');
  const tagsInput = document.getElementById('projTagsInput');
  tagsWrap.querySelectorAll('.tag-item').forEach(el => el.remove());
  if (project?.tags) project.tags.forEach(t => addTagElement(tagsWrap, tagsInput, t));
  overlay.classList.add('active');
}

async function saveProject() {
  const tags = getTagsFromWrap('projTagsWrap');
  const data = {
    name: document.getElementById('projName').value.trim(),
    category: document.getElementById('projCategory').value,
    sort_order: parseInt(document.getElementById('projOrder').value) || 1,
    desc_en: document.getElementById('projDescEn').value.trim(),
    desc_id: document.getElementById('projDescId').value.trim(),
    detail_en: document.getElementById('projDetailEn').value.trim(),
    detail_id: document.getElementById('projDetailId').value.trim(),
    github_url: document.getElementById('projGithub').value.trim(),
    live_url: document.getElementById('projLive').value.trim(),
    tags: tags
  };
  if (!data.name) { showToast('Name required', 'error'); return; }
  try {
    if (editingItem) {
      await updateRow('projects', editingItem.id, data);
      showToast('Project updated!', 'success');
    } else {
      await insertRow('projects', data);
      showToast('Project added!', 'success');
    }
    closeEditor(); await loadAdminData(); renderProjectsTable();
  } catch (e) { showToast('Error: ' + e.message, 'error'); }
}

function editProject(id) {
  const p = adminData.projects.find(x => x.id === id);
  if (p) openProjectEditor(p);
}

async function deleteProject(id) {
  if (!confirm('Delete this project?')) return;
  try {
    await deleteRow('projects', id);
    showToast('Deleted', 'success');
    await loadAdminData(); renderProjectsTable();
  } catch (e) { showToast('Error: ' + e.message, 'error'); }
}

/* ═══════════════════════════════
   SKILLS PANEL
═══════════════════════════════ */
function renderSkillsPanel() {
  const container = document.getElementById('skillsPanel');
  if (!container) return;
  const groups = {};
  adminData.skills.forEach(s => {
    if (!groups[s.group_name]) groups[s.group_name] = [];
    groups[s.group_name].push(s);
  });

  container.innerHTML = Object.entries(groups).map(([gName, skills]) => `
    <div style="margin-bottom:1.25rem">
      <span class="sg-title" style="margin:0">${gName}</span>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:.5rem">
        ${skills.map(s => `
          <span class="sk${s.is_featured ? ' f' : ''}" style="cursor:pointer;display:flex;align-items:center;gap:5px" onclick="toggleFeatured(${s.id})">
            ${s.name}
            <span style="font-size:12px;color:var(--danger);cursor:pointer" onclick="event.stopPropagation();deleteSkill(${s.id})" title="Remove">×</span>
          </span>
        `).join('')}
      </div>
    </div>
  `).join('');

  container.innerHTML += `
    <div style="margin-top:1rem;padding-top:1rem;border-top:0.5px solid var(--bd)">
      <div class="form-row" style="grid-template-columns:1fr 1fr auto auto">
        <input class="form-input" id="newSkillName" placeholder="Skill name">
        <select class="form-select" id="newSkillGroup">
          <option value="Frontend">Frontend</option>
          <option value="Backend & Infra">Backend & Infra</option>
          <option value="AI & Data">AI & Data</option>
          <option value="Certifications">Certifications</option>
        </select>
        <label style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--ts);font-family:var(--fm)">
          <input type="checkbox" id="newSkillFeatured"> Featured
        </label>
        <button class="btn btn-primary btn-sm" onclick="addSkill()">Add</button>
      </div>
    </div>`;
}

async function addSkill() {
  const name = document.getElementById('newSkillName').value.trim();
  const group = document.getElementById('newSkillGroup').value;
  const featured = document.getElementById('newSkillFeatured').checked;
  if (!name) { showToast('Name required', 'error'); return; }
  try {
    await insertRow('skills', { name, group_name: group, is_featured: featured, sort_order: adminData.skills.length + 1 });
    showToast('Skill added!', 'success');
    await loadAdminData(); renderSkillsPanel();
  } catch (e) { showToast('Error: ' + e.message, 'error'); }
}

async function deleteSkill(id) {
  if (!confirm('Remove this skill?')) return;
  try { await deleteRow('skills', id); showToast('Removed', 'success'); await loadAdminData(); renderSkillsPanel(); }
  catch (e) { showToast('Error: ' + e.message, 'error'); }
}

async function toggleFeatured(id) {
  const skill = adminData.skills.find(s => s.id === id);
  if (!skill) return;
  try { await updateRow('skills', id, { is_featured: !skill.is_featured }); await loadAdminData(); renderSkillsPanel(); }
  catch (e) { showToast('Error: ' + e.message, 'error'); }
}

/* ═══════════════════════════════
   EXPERIENCE TABLE (with type)
═══════════════════════════════ */
function renderExperienceTable() {
  const tbody = document.getElementById('expTbody');
  if (!tbody) return;
  tbody.innerHTML = adminData.experiences.map(e => `
    <tr>
      <td>${e.sort_order}</td>
      <td><strong>${e.title_en}</strong></td>
      <td>${e.org}</td>
      <td><span style="font-size:10px;font-family:var(--fm);padding:2px 6px;border-radius:3px;background:var(--ac-light);color:var(--ac)">${e.type || 'professional'}</span></td>
      <td>${e.period}</td>
      <td class="actions">
        <button class="btn btn-sm btn-secondary" onclick="editExperience(${e.id})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteExperience(${e.id})">Del</button>
      </td>
    </tr>`).join('');
}

function openExpEditor(exp = null) {
  editingItem = exp;
  const overlay = document.getElementById('expEditorOverlay');
  document.getElementById('expEditorTitle').textContent = exp ? 'Edit Experience' : 'Add Experience';
  document.getElementById('expPeriod').value = exp?.period || '';
  document.getElementById('expType').value = exp?.type || 'professional';
  document.getElementById('expTitleEn').value = exp?.title_en || '';
  document.getElementById('expTitleId').value = exp?.title_id || '';
  document.getElementById('expOrg').value = exp?.org || '';
  document.getElementById('expDescEn').value = exp?.desc_en || '';
  document.getElementById('expDescId').value = exp?.desc_id || '';
  document.getElementById('expOrder').value = exp?.sort_order || adminData.experiences.length + 1;
  overlay.classList.add('active');
}

async function saveExperience() {
  const data = {
    period: document.getElementById('expPeriod').value.trim(),
    type: document.getElementById('expType').value,
    title_en: document.getElementById('expTitleEn').value.trim(),
    title_id: document.getElementById('expTitleId').value.trim(),
    org: document.getElementById('expOrg').value.trim(),
    desc_en: document.getElementById('expDescEn').value.trim(),
    desc_id: document.getElementById('expDescId').value.trim(),
    sort_order: parseInt(document.getElementById('expOrder').value) || 1
  };
  if (!data.title_en || !data.org) { showToast('Title and org required', 'error'); return; }
  try {
    if (editingItem) {
      await updateRow('experiences', editingItem.id, data);
      showToast('Updated!', 'success');
    } else {
      await insertRow('experiences', data);
      showToast('Added!', 'success');
    }
    closeExpEditor(); await loadAdminData(); renderExperienceTable();
  } catch (e) { showToast('Error: ' + e.message, 'error'); }
}

function editExperience(id) {
  const e = adminData.experiences.find(x => x.id === id);
  if (e) openExpEditor(e);
}

async function deleteExperience(id) {
  if (!confirm('Delete this experience?')) return;
  try { await deleteRow('experiences', id); showToast('Deleted', 'success'); await loadAdminData(); renderExperienceTable(); }
  catch (e) { showToast('Error: ' + e.message, 'error'); }
}

/* ═══════════════════════════════
   EDUCATION TABLE
═══════════════════════════════ */
function renderEducationTable() {
  const tbody = document.getElementById('eduTbody');
  if (!tbody) return;
  tbody.innerHTML = adminData.education.map(e => `
    <tr>
      <td>${e.sort_order}</td>
      <td><strong>${e.degree_en}</strong></td>
      <td>${e.institution}</td>
      <td>${e.period}</td>
      <td>${e.gpa || '-'}</td>
      <td class="actions">
        <button class="btn btn-sm btn-secondary" onclick="editEducation(${e.id})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteEducation(${e.id})">Del</button>
      </td>
    </tr>`).join('');
}

function openEduEditor(edu = null) {
  editingItem = edu;
  const overlay = document.getElementById('eduEditorOverlay');
  document.getElementById('eduEditorTitle').textContent = edu ? 'Edit Education' : 'Add Education';
  document.getElementById('eduPeriod').value = edu?.period || '';
  document.getElementById('eduInstitution').value = edu?.institution || '';
  document.getElementById('eduDegreeEn').value = edu?.degree_en || '';
  document.getElementById('eduDegreeId').value = edu?.degree_id || '';
  document.getElementById('eduGpa').value = edu?.gpa || '';
  document.getElementById('eduOrder').value = edu?.sort_order || adminData.education.length + 1;
  
  const tagsEnWrap = document.getElementById('eduTagsEnWrap');
  const tagsEnInput = document.getElementById('eduTagsEnInput');
  tagsEnWrap.querySelectorAll('.tag-item').forEach(el => el.remove());
  if (edu?.highlights_en) edu.highlights_en.forEach(t => addTagElement(tagsEnWrap, tagsEnInput, t));

  const tagsIdWrap = document.getElementById('eduTagsIdWrap');
  const tagsIdInput = document.getElementById('eduTagsIdInput');
  tagsIdWrap.querySelectorAll('.tag-item').forEach(el => el.remove());
  if (edu?.highlights_id) edu.highlights_id.forEach(t => addTagElement(tagsIdWrap, tagsIdInput, t));

  overlay.classList.add('active');
}

async function saveEducation() {
  const data = {
    period: document.getElementById('eduPeriod').value.trim(),
    institution: document.getElementById('eduInstitution').value.trim(),
    degree_en: document.getElementById('eduDegreeEn').value.trim(),
    degree_id: document.getElementById('eduDegreeId').value.trim(),
    gpa: document.getElementById('eduGpa').value.trim(),
    highlights_en: getTagsFromWrap('eduTagsEnWrap'),
    highlights_id: getTagsFromWrap('eduTagsIdWrap'),
    sort_order: parseInt(document.getElementById('eduOrder').value) || 1
  };
  if (!data.degree_en || !data.institution) { showToast('Degree and institution required', 'error'); return; }
  try {
    if (editingItem) {
      await updateRow('education', editingItem.id, data);
      showToast('Updated!', 'success');
    } else {
      await insertRow('education', data);
      showToast('Added!', 'success');
    }
    closeEduEditor(); await loadAdminData(); renderEducationTable();
  } catch (e) { showToast('Error: ' + e.message, 'error'); }
}

function editEducation(id) {
  const e = adminData.education.find(x => x.id === id);
  if (e) openEduEditor(e);
}

async function deleteEducation(id) {
  if (!confirm('Delete this education?')) return;
  try { await deleteRow('education', id); showToast('Deleted', 'success'); await loadAdminData(); renderEducationTable(); }
  catch (e) { showToast('Error: ' + e.message, 'error'); }
}

function closeEduEditor() {
  const overlay = document.getElementById('eduEditorOverlay');
  if (overlay) overlay.classList.remove('active');
  editingItem = null;
}

/* ═══════════════════════════════
   PROFILE FORM — Full Editor
   Hero, Photo, Stats, Location, Footer, CTA, About, Contact
═══════════════════════════════ */
function renderProfileForm() {
  const container = document.getElementById('profilePanel');
  if (!container) return;
  const p = adminData.profile;
  const statsJson = JSON.stringify(p.stats || [], null, 2);

  container.innerHTML = `
    <!-- HERO SECTION -->
    <div class="profile-section">
      <div class="profile-section-title">🎯 Hero Section</div>
      <div class="form-group">
        <label class="form-label">Hero Name (line breaks = \\n)</label>
        <input class="form-input" id="profHeroName" value="${(p.hero_name || 'BIMA\nARYA').replace(/\n/g, '\\n')}">
        <div class="form-hint">e.g. BIMA\\nARYA — each \\n will be a line break</div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Badge Text (EN)</label>
          <input class="form-input" id="profBadgeEn" value="${p.badge_en || 'Available for hire'}">
        </div>
        <div class="form-group">
          <label class="form-label">Badge Text (ID)</label>
          <input class="form-input" id="profBadgeId" value="${p.badge_id || 'Terbuka untuk peluang baru'}">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Hero Bio (EN)</label>
          <textarea class="form-textarea" id="profBioEn" rows="3">${p.hero_bio_en || ''}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Hero Bio (ID)</label>
          <textarea class="form-textarea" id="profBioId" rows="3">${p.hero_bio_id || ''}</textarea>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Location</label>
        <input class="form-input" id="profLocation" value="${p.location || 'Jakarta, Indonesia'}">
      </div>
    </div>

    <!-- PHOTO -->
    <div class="profile-section">
      <div class="profile-section-title">📷 Profile Photo</div>
      <div style="display:flex;gap:1rem;align-items:center">
        <div id="photoPreview" style="width:80px;height:96px;border-radius:8px;border:0.5px solid var(--bd);overflow:hidden;display:flex;align-items:center;justify-content:center;background:var(--bgs)">
          ${p.photo_url ? `<img src="${p.photo_url}" style="width:100%;height:100%;object-fit:cover">` : '<span style="font-size:24px">👤</span>'}
        </div>
        <div>
          <input type="file" id="photoFileInput" accept="image/*" style="display:none" onchange="handleAdminPhotoUpload(this)">
          <button class="btn btn-secondary btn-sm" onclick="document.getElementById('photoFileInput').click()">Choose Photo</button>
          <div class="form-hint" style="margin-top:.3rem">Photo is stored in localStorage and shown on the portfolio</div>
        </div>
      </div>
    </div>

    <!-- STATS -->
    <div class="profile-section">
      <div class="profile-section-title">📊 Statistics</div>
      <div class="form-hint" style="margin-bottom:.5rem">Edit stats displayed in the hero section. Each stat has a value and bilingual labels.</div>
      <div id="statsEditor"></div>
      <button class="btn btn-secondary btn-sm" onclick="addStatRow()" style="margin-top:.5rem">+ Add Stat</button>
    </div>

    <!-- CONTACT -->
    <div class="profile-section">
      <div class="profile-section-title">📞 Contact Info</div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Email</label>
          <input class="form-input" id="profEmail" value="${p.contact_email || ''}">
        </div>
        <div class="form-group">
          <label class="form-label">Phone</label>
          <input class="form-input" id="profPhone" value="${p.contact_phone || ''}">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">LinkedIn URL</label>
          <input class="form-input" id="profLinkedin" value="${p.contact_linkedin || ''}">
        </div>
        <div class="form-group">
          <label class="form-label">Portfolio URL</label>
          <input class="form-input" id="profPortfolio" value="${p.contact_portfolio || ''}">
        </div>
      </div>
    </div>

    <!-- FOOTER & CTA -->
    <div class="profile-section">
      <div class="profile-section-title">🔻 Footer & CTA</div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Footer Text (EN)</label>
          <input class="form-input" id="profFooterEn" value="${p.footer_en || '© 2025 Bima Aryadinata'}">
        </div>
        <div class="form-group">
          <label class="form-label">Footer Text (ID)</label>
          <input class="form-input" id="profFooterId" value="${p.footer_id || '© 2025 Bima Aryadinata'}">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Contact CTA (EN, supports HTML)</label>
          <input class="form-input" id="profCtaEn" value="${escHtml(p.contact_cta_en || '')}">
        </div>
        <div class="form-group">
          <label class="form-label">Contact CTA (ID, supports HTML)</label>
          <input class="form-input" id="profCtaId" value="${escHtml(p.contact_cta_id || '')}">
        </div>
      </div>
    </div>

    <div style="margin-top:1.5rem">
      <button class="btn btn-primary" onclick="saveProfile()">💾 Save All Profile Changes</button>
    </div>
  `;

  // Render stats editor rows
  renderStatsEditor(p.stats || []);
}

function escHtml(str) {
  return str.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ── STATS EDITOR ── */
function renderStatsEditor(stats) {
  const container = document.getElementById('statsEditor');
  if (!container) return;
  container.innerHTML = stats.map((s, i) => `
    <div class="stat-row" data-idx="${i}" style="display:grid;grid-template-columns:100px 1fr 1fr auto;gap:.5rem;margin-bottom:.5rem;align-items:end">
      <div class="form-group" style="margin:0">
        <label class="form-label" style="font-size:9px">Value</label>
        <input class="form-input stat-val" value="${s.value}" placeholder="3.93">
      </div>
      <div class="form-group" style="margin:0">
        <label class="form-label" style="font-size:9px">Label EN</label>
        <input class="form-input stat-label-en" value="${s.label_en}" placeholder="GPA / 4.00">
      </div>
      <div class="form-group" style="margin:0">
        <label class="form-label" style="font-size:9px">Label ID</label>
        <input class="form-input stat-label-id" value="${s.label_id}" placeholder="IPK / 4,00">
      </div>
      <button class="btn btn-danger btn-sm" onclick="removeStat(${i})" style="height:34px">×</button>
    </div>
  `).join('');
}

function addStatRow() {
  const stats = collectStats();
  stats.push({ value: '', label_en: '', label_id: '' });
  renderStatsEditor(stats);
}

function removeStat(idx) {
  const stats = collectStats();
  stats.splice(idx, 1);
  renderStatsEditor(stats);
}

function collectStats() {
  const rows = document.querySelectorAll('#statsEditor .stat-row');
  return Array.from(rows).map(row => ({
    value: row.querySelector('.stat-val').value,
    label_en: row.querySelector('.stat-label-en').value,
    label_id: row.querySelector('.stat-label-id').value
  }));
}

/* ── PHOTO UPLOAD (admin only) ── */
function handleAdminPhotoUpload(input) {
  if (!input.files || !input.files[0]) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    localStorage.setItem('pf-photo', e.target.result);
    const preview = document.getElementById('photoPreview');
    if (preview) preview.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover">`;
    showToast('Photo uploaded!', 'success');
  };
  reader.readAsDataURL(input.files[0]);
}

/* ── SAVE PROFILE ── */
async function saveProfile() {
  const heroNameRaw = document.getElementById('profHeroName').value;
  const heroName = heroNameRaw.replace(/\\n/g, '\n');
  const stats = collectStats().filter(s => s.value);

  const data = {
    hero_name: heroName,
    hero_bio_en: document.getElementById('profBioEn').value.trim(),
    hero_bio_id: document.getElementById('profBioId').value.trim(),
    badge_en: document.getElementById('profBadgeEn').value.trim(),
    badge_id: document.getElementById('profBadgeId').value.trim(),
    location: document.getElementById('profLocation').value.trim(),
    stats: stats,
    contact_email: document.getElementById('profEmail').value.trim(),
    contact_phone: document.getElementById('profPhone').value.trim(),
    contact_linkedin: document.getElementById('profLinkedin').value.trim(),
    contact_portfolio: document.getElementById('profPortfolio').value.trim(),
    footer_en: document.getElementById('profFooterEn').value.trim(),
    footer_id: document.getElementById('profFooterId').value.trim(),
    contact_cta_en: document.getElementById('profCtaEn').value,
    contact_cta_id: document.getElementById('profCtaId').value,
    about_en: adminData.profile.about_en,
    about_id: adminData.profile.about_id,
    pills_en: adminData.profile.pills_en,
    pills_id: adminData.profile.pills_id,
    photo_url: adminData.profile.photo_url || ''
  };
  try {
    await upsertProfile(data);
    showToast('Profile saved!', 'success');
    await loadAdminData();
  } catch (e) { showToast('Error: ' + e.message, 'error'); }
}

/* ═══════════════════════════════
   TAGS INPUT HELPER
═══════════════════════════════ */
function setupTagsInput(wrapId, inputId) {
  const input = document.getElementById(inputId);
  const wrap = document.getElementById(wrapId);
  if (!input || !wrap) return;
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = input.value.trim().replace(',', '');
      if (val) { addTagElement(wrap, input, val); input.value = ''; }
    }
    if (e.key === 'Backspace' && !input.value) {
      const tags = wrap.querySelectorAll('.tag-item');
      if (tags.length) tags[tags.length - 1].remove();
    }
  });
}

function addTagElement(wrap, input, text) {
  const tag = document.createElement('span');
  tag.className = 'tag-item';
  tag.innerHTML = `${text}<span class="tag-remove" onclick="this.parentElement.remove()">×</span>`;
  wrap.insertBefore(tag, input);
}

function getTagsFromWrap(wrapId) {
  const wrap = document.getElementById(wrapId);
  if (!wrap) return [];
  return Array.from(wrap.querySelectorAll('.tag-item')).map(el => el.textContent.replace('×', '').trim());
}

/* ═══════════════════════════════
   EDITOR MODALS
═══════════════════════════════ */
function closeEditor() {
  const overlay = document.getElementById('editorOverlay');
  if (overlay) overlay.classList.remove('active');
  editingItem = null;
}

function closeExpEditor() {
  const overlay = document.getElementById('expEditorOverlay');
  if (overlay) overlay.classList.remove('active');
  editingItem = null;
}

/* ═══════════════════════════════
   EXPORT / IMPORT / SEED
═══════════════════════════════ */
function exportData() {
  const json = JSON.stringify(adminData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click(); URL.revokeObjectURL(url);
  showToast('Exported!', 'success');
}

function importData() {
  const input = document.createElement('input');
  input.type = 'file'; input.accept = '.json';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (confirm('Replace ALL existing data?')) {
        if (data.projects) for (const p of data.projects) { const { id, created_at, ...rest } = p; await insertRow('projects', rest); }
        if (data.skills) for (const s of data.skills) { const { id, ...rest } = s; await insertRow('skills', rest); }
        if (data.experiences) for (const exp of data.experiences) { const { id, ...rest } = exp; await insertRow('experiences', rest); }
        if (data.education) for (const edu of data.education) { const { id, ...rest } = edu; await insertRow('education', rest); }
        if (data.profile) { const { id, ...rest } = data.profile; await upsertProfile(rest); }
        await loadAdminData(); renderTab();
        showToast('Imported!', 'success');
      }
    } catch (err) { showToast('Import failed: ' + err.message, 'error'); }
  };
  input.click();
}

async function seedDefaults() {
  if (!confirm('Insert default data? Existing data will NOT be deleted.')) return;
  try {
    for (const p of DEFAULT_PROJECTS) { const { id, ...rest } = p; await insertRow('projects', rest); }
    for (const s of DEFAULT_SKILLS) { const { id, ...rest } = s; await insertRow('skills', rest); }
    for (const exp of DEFAULT_EXPERIENCES) { const { id, ...rest } = exp; await insertRow('experiences', rest); }
    for (const edu of DEFAULT_EDUCATION) { const { id, ...rest } = edu; await insertRow('education', rest); }
    await upsertProfile(DEFAULT_PROFILE);
    await loadAdminData(); renderTab();
    showToast('Seeded!', 'success');
  } catch (e) { showToast('Error: ' + e.message, 'error'); }
}

/* ═══════════════════════════════
   TOAST NOTIFICATIONS
═══════════════════════════════ */
function showToast(msg, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => { toast.classList.add('hide'); setTimeout(() => toast.remove(), 300); }, 3000);
}

/* ═══════════════════════════════
   THEME TOGGLE (admin)
═══════════════════════════════ */
function toggleAdminTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('pf-theme', next);
}
