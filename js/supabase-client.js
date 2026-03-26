// ═══════════════════════════════════════════════════
// Supabase Client — supabase-client.js
// Initializes the Supabase client + helper functions
// ═══════════════════════════════════════════════════

let sbClient = null;

// The Anon Key is inherently safe to expose in client-side code for a public web application.
// Database security must be handled via Supabase Row Level Security (RLS) policies.
const SUPABASE_URL = 'https://blpwhdygjpgnchgrfbgr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_G1RGU8mHns-bdaEPQmnhtQ_PXXNLWIB';

function initSupabase() {
  // Check Supabase CDN loaded
  if (!window.supabase || !window.supabase.createClient) {
    console.warn('[Portfolio] Supabase JS library not loaded — using fallback data');
    return false;
  }

  // If URL indicates placeholder, skip initialization
  if (SUPABASE_URL.includes('YOUR_SUPABASE_URL')) {
    console.warn('[Portfolio] Supabase not configured — using fallback data');
    return false;
  }

  try {
    sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return true;
  } catch (e) {
    console.error('[Portfolio] Supabase init failed:', e);
    return false;
  }
}

// ── Auth helpers ──
async function signIn(email, password) {
  if (!sbClient) throw new Error('Supabase not initialized');
  const { data, error } = await sbClient.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

async function signOut() {
  if (!sbClient) return;
  const { error } = await sbClient.auth.signOut();
  if (error) throw error;
}

async function getUser() {
  if (!sbClient) return null;
  const { data: { user } } = await sbClient.auth.getUser();
  return user;
}

async function getSession() {
  if (!sbClient) return null;
  const { data: { session } } = await sbClient.auth.getSession();
  return session;
}

// ── Data fetch helpers (public read) ──
async function fetchProjects() {
  if (!sbClient) return null;
  const { data, error } = await sbClient
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) { console.error('[Supabase] fetchProjects:', error); return null; }
  return data;
}

async function fetchSkills() {
  if (!sbClient) return null;
  const { data, error } = await sbClient
    .from('skills')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) { console.error('[Supabase] fetchSkills:', error); return null; }
  return data;
}

async function fetchExperiences() {
  if (!sbClient) return null;
  const { data, error } = await sbClient
    .from('experiences')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) { console.error('[Supabase] fetchExperiences:', error); return null; }
  return data;
}

async function fetchEducation() {
  if (!sbClient) return null;
  const { data, error } = await sbClient
    .from('education')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) { console.error('[Supabase] fetchEducation:', error); return null; }
  return data;
}

async function fetchProfile() {
  if (!sbClient) return null;
  const { data, error } = await sbClient
    .from('profile')
    .select('*')
    .maybeSingle();
  if (error) { console.error('[Supabase] fetchProfile:', error); return null; }
  return data;
}

// ── CRUD helpers (authenticated) ──
// Using .select() without .single() to avoid 406 errors,
// then returning the first row from the array result.
async function insertRow(table, row) {
  const { data, error } = await sbClient.from(table).insert(row).select();
  if (error) throw error;
  return data && data.length > 0 ? data[0] : null;
}

async function updateRow(table, id, updates) {
  const { data, error } = await sbClient.from(table).update(updates).eq('id', id).select();
  if (error) throw error;
  return data && data.length > 0 ? data[0] : null;
}

async function deleteRow(table, id) {
  const { error } = await sbClient.from(table).delete().eq('id', id);
  if (error) throw error;
}

async function upsertProfile(profileData) {
  const { data, error } = await sbClient.from('profile').upsert({ id: 1, ...profileData }).select();
  if (error) throw error;
  return data && data.length > 0 ? data[0] : null;
}
