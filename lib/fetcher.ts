import { createClient } from "./supabase/server";
import {
  DEFAULT_PROJECTS,
  DEFAULT_SKILLS,
  DEFAULT_EXPERIENCES,
  DEFAULT_EDUCATION,
  DEFAULT_PROFILE,
  DEFAULT_CURRENT_BUILDING,
  TICKER_ITEMS,
  CATEGORIES,
} from "./data";
import type {
  Project,
  Skill,
  Experience,
  Education,
  Profile,
  CurrentlyBuilding,
} from "./types";

async function safeFetch<T>(loader: () => Promise<T>, fallback: T): Promise<T> {
  try {
    const result = await loader();
    if (result == null) return fallback;
    return result;
  } catch (e) {
    console.error("[fetcher] falling back to defaults:", e);
    return fallback;
  }
}

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();
  return safeFetch<Project[]>(async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("id,sort_order,category,name,role_en,role_id,desc_en,desc_id,detail_en,detail_id,tags,highlight,status,metrics,github_url,live_url,images")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data as Project[];
  }, DEFAULT_PROJECTS);
}

export async function getSkills(): Promise<Skill[]> {
  const supabase = await createClient();
  return safeFetch<Skill[]>(async () => {
    const { data, error } = await supabase
      .from("skills")
      .select("id,group_name,name,is_featured,sort_order")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data as Skill[];
  }, DEFAULT_SKILLS);
}

export async function getExperiences(): Promise<Experience[]> {
  const supabase = await createClient();
  return safeFetch<Experience[]>(async () => {
    const { data, error } = await supabase
      .from("experiences")
      .select("id,sort_order,type,period,title_en,title_id,org,location_en,location_id,desc_en,desc_id,achievement_en,achievement_id,tools")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data as Experience[];
  }, DEFAULT_EXPERIENCES);
}

export async function getEducation(): Promise<Education[]> {
  const supabase = await createClient();
  return safeFetch<Education[]>(async () => {
    const { data, error } = await supabase
      .from("education")
      .select("id,sort_order,degree_en,degree_id,institution,location_en,location_id,period,gpa,highlights_en,highlights_id")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data as Education[];
  }, DEFAULT_EDUCATION);
}

export async function getProfile(): Promise<Profile> {
  const supabase = await createClient();
  return safeFetch<Profile>(async () => {
    const { data, error } = await supabase
      .from("profile")
      .select("id,hero_name,hero_tagline_en,hero_tagline_id,hero_bio_en,hero_bio_id,badge_en,badge_id,location,photo_url,stats,contact_email,contact_linkedin,contact_portfolio,contact_github,footer_en,footer_id,contact_cta_en,contact_cta_id,about_en,about_id,pills_en,pills_id,certifications")
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new Error("no profile row");
    return data as Profile;
  }, DEFAULT_PROFILE);
}

export async function getCurrentlyBuilding(): Promise<CurrentlyBuilding[]> {
  // Static for now — could be moved to a `building` table later
  return DEFAULT_CURRENT_BUILDING;
}

export { TICKER_ITEMS, CATEGORIES };
