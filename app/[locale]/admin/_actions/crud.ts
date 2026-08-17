"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/server-boundary";
import type {
  Project,
  Skill,
  Experience,
  Education,
  Profile,
  CurrentlyBuilding,
  Post,
} from "@/lib/types";
import {
  DEFAULT_PROJECTS,
  DEFAULT_SKILLS,
  DEFAULT_EXPERIENCES,
  DEFAULT_EDUCATION,
  DEFAULT_PROFILE,
} from "@/lib/data";

const requireAuth = requireAdmin;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const FIELDS = {
  projects: ["id","sort_order","category","slug","name","role_en","role_id","desc_en","desc_id","detail_en","detail_id","tags","highlight","status","metrics","github_url","live_url","images"],
  skills: ["id","group_name","name","is_featured","sort_order"],
  experiences: ["id","sort_order","type","period","title_en","title_id","org","location_en","location_id","desc_en","desc_id","achievement_en","achievement_id","tools"],
  education: ["id","sort_order","degree_en","degree_id","institution","location_en","location_id","period","gpa","highlights_en","highlights_id"],
  currently_building: ["id","sort_order","name_en","name_id","description_en","description_id","status_en","status_id","stack"],
  posts: ["id","slug","title_en","title_id","excerpt_en","excerpt_id","content_en","content_id","cover_image","published_at","updated_at"],
  profile: ["id","hero_name","hero_tagline_en","hero_tagline_id","hero_bio_en","hero_bio_id","badge_en","badge_id","location","photo_url","stats","contact_email","contact_linkedin","contact_portfolio","contact_github","cv_url_en","cv_url_id","footer_en","footer_id","contact_cta_en","contact_cta_id","about_en","about_id","pills_en","pills_id","certifications"],
} as const;
function validId(id: number) { if (!Number.isInteger(id) || id < 1) throw new Error("Invalid ID"); }
function validate(kind: keyof typeof FIELDS, value: Record<string, unknown>, partial = false) {
  const allowed = new Set(FIELDS[kind]);
  if (Object.keys(value).some((key) => !allowed.has(key as never))) throw new Error("Unexpected fields");
  for (const [key, item] of Object.entries(value)) {
    if (item === null || (typeof item !== "string" && typeof item !== "number" && typeof item !== "boolean" && !Array.isArray(item))) throw new Error("Invalid field type");
    if (key === "sort_order" && (typeof item !== "number" || !Number.isInteger(item) || item < 0 || item > 100000)) throw new Error("Invalid sort order");
    if (typeof item === "string" && item.length > 10000) throw new Error("Field too long");
    if (/(_url|photo_url)$/.test(key) && typeof item === "string" && item && !/^https?:\/\//i.test(item)) throw new Error("Invalid URL");
  }
  if (!partial && !("id" in value)) throw new Error("Invalid record");
}

function validateImage(file: FormDataEntryValue | null): asserts file is File {
  if (!(file instanceof File) || file.size === 0) throw new Error("No file provided");
  if (!IMAGE_TYPES.has(file.type) || file.size > MAX_IMAGE_BYTES) throw new Error("Image must be JPEG, PNG, WebP, or GIF and no larger than 5 MB");
}

function stripProject(p: Project) {
  const { id, ...rest } = p;
  void id;
  return rest;
}

function stripExperience(e: Experience) {
  const { id, ...rest } = e;
  void id;
  return rest;
}

function stripEducation(e: Education) {
  const { id, ...rest } = e;
  void id;
  return rest;
}

function stripBuilding(b: CurrentlyBuilding) {
  const { id, ...rest } = b;
  void id;
  return rest;
}

function stripSkill(s: Skill) {
  const { id, ...rest } = s;
  void id;
  return rest;
}

function stripPost(p: Post) {
  const { id, ...rest } = p;
  void id;
  return rest;
}

// ── Projects ────────────────────────────────────────────
function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createProject(p: Project) {
  try {
    const row = { ...p };
    delete row.slug;
    validate("projects", row as unknown as Record<string, unknown>);
    const supabase = await requireAuth();
    const { data, error } = await supabase
      .from("projects")
      .insert(stripProject(row))
      .select();
    if (error) throw error;
    const created = data?.[0];
    if (created && !created.slug) {
      const { error: slugError } = await supabase
        .from("projects")
        .update({ slug: `${slugify(created.name)}-${created.id}` })
        .eq("id", created.id);
      if (slugError) throw slugError;
      created.slug = `${slugify(created.name)}-${created.id}`;
    }
    revalidatePath("/en", "layout");
    revalidatePath("/id", "layout");
    revalidatePath("/en/admin");
    revalidatePath("/id/admin");
    return { ok: true, row: created };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function updateProject(id: number, p: Partial<Project>) {
  try {
    validId(id);
    const row = { ...p };
    if (!row.slug && row.name) row.slug = `${slugify(row.name)}-${id}`;
    validate("projects", row as unknown as Record<string, unknown>, true);
    const supabase = await requireAuth();
    const { data, error } = await supabase
      .from("projects")
      .update(row)
      .eq("id", id)
      .select();
    if (error) throw error;
    if (!data || data.length === 0)
      throw new Error("Row not found (it may be a fallback default record)");
    revalidatePath("/en", "layout");
    revalidatePath("/id", "layout");
    revalidatePath("/en/admin");
    revalidatePath("/id/admin");
    return { ok: true, row: data[0] };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function deleteProject(id: number) {
  try {
    validId(id);
    const supabase = await requireAuth();
    const { error, count } = await supabase
      .from("projects")
      .delete({ count: "exact" })
      .eq("id", id);
    if (error) throw error;
    if (count === 0) throw new Error("Row not found");
    const { data: files, error: listError } = await supabase.storage.from("portfolio-assets").list(`projects/${id}`);
    if (listError) {
      console.error("Project media cleanup list failed", { projectId: id, error: listError });
    } else if (files?.length) {
      const { error: removeError } = await supabase.storage.from("portfolio-assets").remove(files.map((f) => `projects/${id}/${f.name}`));
      if (removeError) console.error("Project media cleanup remove failed", { projectId: id, error: removeError });
    }
    revalidatePath("/en", "layout");
    revalidatePath("/id", "layout");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

// ── Skills ──────────────────────────────────────────────
export async function createSkill(s: Skill) {
  try {
    validate("skills", s as unknown as Record<string, unknown>);
    const supabase = await requireAuth();
    const { data, error } = await supabase
      .from("skills")
      .insert(stripSkill(s))
      .select();
    if (error) throw error;
    revalidatePath("/en", "layout");
    revalidatePath("/id", "layout");
    return { ok: true, row: data?.[0] };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function updateSkill(id: number, s: Partial<Skill>) {
  try {
    validId(id); validate("skills", s as unknown as Record<string, unknown>, true);
    const supabase = await requireAuth();
    const { data, error } = await supabase
      .from("skills")
      .update(s)
      .eq("id", id)
      .select();
    if (error) throw error;
    if (!data || data.length === 0)
      throw new Error("Row not found (it may be a fallback default record)");
    revalidatePath("/en", "layout");
    revalidatePath("/id", "layout");
    return { ok: true, row: data[0] };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function deleteSkill(id: number) {
  try {
    validId(id);
    const supabase = await requireAuth();
    const { error, count } = await supabase
      .from("skills")
      .delete({ count: "exact" })
      .eq("id", id);
    if (error) throw error;
    if (count === 0) throw new Error("Row not found");
    revalidatePath("/en", "layout");
    revalidatePath("/id", "layout");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

// ── Experiences ─────────────────────────────────────────
export async function createExperience(e: Experience) {
  try {
    validate("experiences", e as unknown as Record<string, unknown>);
    const supabase = await requireAuth();
    const { data, error } = await supabase
      .from("experiences")
      .insert(stripExperience(e))
      .select();
    if (error) throw error;
    revalidatePath("/en", "layout");
    revalidatePath("/id", "layout");
    return { ok: true, row: data?.[0] };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function updateExperience(id: number, e: Partial<Experience>) {
  try {
    validId(id); validate("experiences", e as unknown as Record<string, unknown>, true);
    const supabase = await requireAuth();
    const { data, error } = await supabase
      .from("experiences")
      .update(e)
      .eq("id", id)
      .select();
    if (error) throw error;
    if (!data || data.length === 0)
      throw new Error("Row not found (it may be a fallback default record)");
    revalidatePath("/en", "layout");
    revalidatePath("/id", "layout");
    return { ok: true, row: data[0] };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function deleteExperience(id: number) {
  try {
    validId(id);
    const supabase = await requireAuth();
    const { error, count } = await supabase
      .from("experiences")
      .delete({ count: "exact" })
      .eq("id", id);
    if (error) throw error;
    if (count === 0) throw new Error("Row not found");
    revalidatePath("/en", "layout");
    revalidatePath("/id", "layout");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

// ── Education ───────────────────────────────────────────
export async function createEducation(e: Education) {
  try {
    validate("education", e as unknown as Record<string, unknown>);
    const supabase = await requireAuth();
    const { data, error } = await supabase
      .from("education")
      .insert(stripEducation(e))
      .select();
    if (error) throw error;
    revalidatePath("/en", "layout");
    revalidatePath("/id", "layout");
    return { ok: true, row: data?.[0] };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function updateEducation(id: number, e: Partial<Education>) {
  try {
    validId(id); validate("education", e as unknown as Record<string, unknown>, true);
    const supabase = await requireAuth();
    const { data, error } = await supabase
      .from("education")
      .update(e)
      .eq("id", id)
      .select();
    if (error) throw error;
    if (!data || data.length === 0)
      throw new Error("Row not found (it may be a fallback default record)");
    revalidatePath("/en", "layout");
    revalidatePath("/id", "layout");
    return { ok: true, row: data[0] };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function deleteEducation(id: number) {
  try {
    validId(id);
    const supabase = await requireAuth();
    const { error, count } = await supabase
      .from("education")
      .delete({ count: "exact" })
      .eq("id", id);
    if (error) throw error;
    if (count === 0) throw new Error("Row not found");
    revalidatePath("/en", "layout");
    revalidatePath("/id", "layout");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

// ── Currently Building ─────────────────────────────────
export async function createBuilding(b: CurrentlyBuilding) {
  try {
    validate("currently_building", b as unknown as Record<string, unknown>);
    const supabase = await requireAuth();
    const { data, error } = await supabase
      .from("currently_building")
      .insert(stripBuilding(b))
      .select();
    if (error) throw error;
    revalidatePath("/en", "layout");
    revalidatePath("/id", "layout");
    revalidatePath("/en/admin");
    revalidatePath("/id/admin");
    return { ok: true, row: data?.[0] };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function updateBuilding(id: number, b: Partial<CurrentlyBuilding>) {
  try {
    validId(id);
    validate("currently_building", b as unknown as Record<string, unknown>, true);
    const supabase = await requireAuth();
    const { data, error } = await supabase
      .from("currently_building")
      .update(b)
      .eq("id", id)
      .select();
    if (error) throw error;
    if (!data || data.length === 0)
      throw new Error("Row not found (it may be a fallback default record)");
    revalidatePath("/en", "layout");
    revalidatePath("/id", "layout");
    revalidatePath("/en/admin");
    revalidatePath("/id/admin");
    return { ok: true, row: data[0] };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function deleteBuilding(id: number) {
  try {
    validId(id);
    const supabase = await requireAuth();
    const { error, count } = await supabase
      .from("currently_building")
      .delete({ count: "exact" })
      .eq("id", id);
    if (error) throw error;
    if (count === 0) throw new Error("Row not found");
    revalidatePath("/en", "layout");
    revalidatePath("/id", "layout");
    revalidatePath("/en/admin");
    revalidatePath("/id/admin");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

// ── Posts ──────────────────────────────────────────────
export async function createPost(p: Post) {
  try {
    const row: Post = {
      ...p,
      slug: p.slug?.trim() || slugify(p.title_en || p.title_id || "post"),
    };
    validate("posts", row as unknown as Record<string, unknown>);
    const supabase = await requireAuth();
    const { data, error } = await supabase
      .from("posts")
      .insert(stripPost(row))
      .select();
    if (error) throw error;
    revalidatePath("/en", "layout");
    revalidatePath("/id", "layout");
    revalidatePath("/en/blog");
    revalidatePath("/id/blog");
    return { ok: true, row: data?.[0] };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function updatePost(id: number, p: Partial<Post>) {
  try {
    validId(id);
    validate("posts", p as unknown as Record<string, unknown>, true);
    const supabase = await requireAuth();
    const { data, error } = await supabase
      .from("posts")
      .update(p)
      .eq("id", id)
      .select();
    if (error) throw error;
    if (!data || data.length === 0)
      throw new Error("Row not found (it may be a fallback default record)");
    revalidatePath("/en", "layout");
    revalidatePath("/id", "layout");
    revalidatePath("/en/blog");
    revalidatePath("/id/blog");
    return { ok: true, row: data[0] };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function deletePost(id: number) {
  try {
    validId(id);
    const supabase = await requireAuth();
    const { error, count } = await supabase
      .from("posts")
      .delete({ count: "exact" })
      .eq("id", id);
    if (error) throw error;
    if (count === 0) throw new Error("Row not found");
    revalidatePath("/en", "layout");
    revalidatePath("/id", "layout");
    revalidatePath("/en/blog");
    revalidatePath("/id/blog");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

// ── Profile ─────────────────────────────────────────────
export async function updateProfile(p: Partial<Profile>) {
  try {
    validate("profile", p as unknown as Record<string, unknown>, true);
    const supabase = await requireAuth();
    const { data, error } = await supabase
      .from("profile")
      .upsert({ id: 1, ...p })
      .select();
    if (error) throw error;
    revalidatePath("/en", "layout");
    revalidatePath("/id", "layout");
    return { ok: true, row: data?.[0] };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

// ── Photo upload ────────────────────────────────────────
export async function uploadPhoto(formData: FormData) {
  try {
    const supabase = await requireAuth();
    const file = formData.get("file");
    validateImage(file);
    const ext = file.name.split(".").pop() || "png";
    const fileName = `profile-photo-${Date.now()}.${ext}`;
    const filePath = `photos/${fileName}`;

    const { error } = await supabase.storage
      .from("portfolio-assets")
      .upload(filePath, file, { cacheControl: "3600", upsert: true });
    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("portfolio-assets")
      .getPublicUrl(filePath);

    // Persist into profile
    const { error: persistError } = await supabase
      .from("profile")
      .upsert({ id: 1, photo_url: urlData.publicUrl });
    if (persistError) {
      await supabase.storage.from("portfolio-assets").remove([filePath]);
      throw persistError;
    }
    const { data: list } = await supabase.storage.from("portfolio-assets").list("photos");
    const oldFiles = (list ?? []).filter((f) => f.name !== fileName).map((f) => `photos/${f.name}`);
    if (oldFiles.length) await supabase.storage.from("portfolio-assets").remove(oldFiles);

    revalidatePath("/en", "layout");
    revalidatePath("/id", "layout");
    return { ok: true, url: urlData.publicUrl };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

// ── CV upload ─────────────────────────────────────────
const CV_MAX_BYTES = 10 * 1024 * 1024;
const CV_TYPES = new Set(["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]);

export async function uploadCv(formData: FormData) {
  try {
    const supabase = await requireAuth();
    const file = formData.get("file");
    const lang = formData.get("lang");
    if (lang !== "en" && lang !== "id") throw new Error("Invalid language");
    if (!(file instanceof File) || file.size === 0) throw new Error("No file provided");
    if (!CV_TYPES.has(file.type) || file.size > CV_MAX_BYTES) throw new Error("CV must be PDF or DOCX and no larger than 10 MB");

    const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
    const fileName = `cv-${Date.now()}.${ext}`;
    const folder = `cv/${lang}`;
    const filePath = `${folder}/${fileName}`;

    const { error } = await supabase.storage
      .from("portfolio-assets")
      .upload(filePath, file, { cacheControl: "3600", upsert: true });
    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("portfolio-assets")
      .getPublicUrl(filePath);

    const { error: persistError } = await supabase
      .from("profile")
      .upsert({ id: 1, [`cv_url_${lang}`]: urlData.publicUrl });
    if (persistError) {
      await supabase.storage.from("portfolio-assets").remove([filePath]);
      throw persistError;
    }

    const { data: list } = await supabase.storage.from("portfolio-assets").list(folder);
    const oldFiles = (list ?? []).filter((f) => f.name !== fileName).map((f) => `${folder}/${f.name}`);
    if (oldFiles.length) await supabase.storage.from("portfolio-assets").remove(oldFiles);

    revalidatePath("/en", "layout");
    revalidatePath("/id", "layout");
    return { ok: true, url: urlData.publicUrl };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function clearCv(lang: string) {
  try {
    const supabase = await requireAuth();
    if (lang !== "en" && lang !== "id") throw new Error("Invalid language");
    const key = `cv_url_${lang}` as const;

    const { data: row } = await supabase.from("profile").select("cv_url_en,cv_url_id").eq("id", 1).maybeSingle();
    const url: string | undefined = row?.[key];

    const { error } = await supabase.from("profile").update({ [key]: "" }).eq("id", 1);
    if (error) throw error;

    if (url) {
      const marker = "/portfolio-assets/";
      const idx = url.indexOf(marker);
      if (idx !== -1) {
        const filePath = url.substring(idx + marker.length);
        if (/^cv\/[a-z]{2}\/[^/]+$/.test(filePath)) {
          await supabase.storage.from("portfolio-assets").remove([filePath]);
        }
      }
    }

    revalidatePath("/en", "layout");
    revalidatePath("/id", "layout");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

// ── Project image upload ────────────────────────────────
export async function uploadProjectImage(projectId: number, formData: FormData) {
  try {
    const supabase = await requireAuth();
    const file = formData.get("file");
    validateImage(file);
    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const fileName = `img-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${ext}`;
    const filePath = `projects/${projectId}/${fileName}`;
    if (!Number.isInteger(projectId) || projectId < 1) throw new Error("Invalid project");

    const { error } = await supabase.storage
      .from("portfolio-assets")
      .upload(filePath, file, { cacheControl: "3600", upsert: true });
    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("portfolio-assets")
      .getPublicUrl(filePath);

    const { error: persistError } = await supabase.rpc("project_media_append", { p_id: projectId, p_url: urlData.publicUrl });
    if (persistError) { await supabase.storage.from("portfolio-assets").remove([filePath]); throw persistError; }

    return { ok: true, url: urlData.publicUrl };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function deleteProjectImage(projectId: number, publicUrl: string) {
  try {
    const supabase = await requireAuth();
    const marker = "/portfolio-assets/";
    const idx = publicUrl.indexOf(marker);
    if (idx === -1) throw new Error("Invalid URL");
    const filePath = publicUrl.substring(idx + marker.length);
    validId(projectId);
    if (!new RegExp(`^projects/${projectId}/[^/]+$`).test(filePath)) throw new Error("Project image path required");
    const { error: persistError } = await supabase.rpc("project_media_remove", { p_id: projectId, p_url: publicUrl });
    if (persistError) throw persistError;
    const { error } = await supabase.storage.from("portfolio-assets").remove([filePath]);
    if (error) {
      await supabase.rpc("project_media_append", { p_id: projectId, p_url: publicUrl });
      throw error;
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}
