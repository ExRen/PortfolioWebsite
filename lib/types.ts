export type Locale = "en" | "id";

export interface Project {
  id: number;
  sort_order: number;
  category: "ai" | "fullstack" | "tools";
  slug?: string;
  name: string;
  role_en: string;
  role_id: string;
  desc_en: string;
  desc_id: string;
  detail_en: string;
  detail_id: string;
  tags: string[];
  highlight?: string;
  status?: string;
  metrics?: { label_en: string; label_id: string; value: string }[];
  github_url: string;
  live_url: string;
  images: string[];
}

export interface Skill {
  id: number;
  group_name: string;
  name: string;
  is_featured: boolean;
  sort_order: number;
}

export interface Experience {
  id: number;
  sort_order: number;
  type: "professional" | "organization";
  period: string;
  title_en: string;
  title_id: string;
  org: string;
  location_en: string;
  location_id: string;
  desc_en: string;
  desc_id: string;
  achievement_en: string;
  achievement_id: string;
  tools: string[];
}

export interface Education {
  id: number;
  sort_order: number;
  degree_en: string;
  degree_id: string;
  institution: string;
  location_en: string;
  location_id: string;
  period: string;
  gpa: string;
  highlights_en: string[];
  highlights_id: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
}

export interface ProfileStat {
  value: string;
  label_en: string;
  label_id: string;
}

export interface Profile {
  id: number;
  hero_name: string;
  hero_tagline_en: string;
  hero_tagline_id: string;
  hero_bio_en: string;
  hero_bio_id: string;
  badge_en: string;
  badge_id: string;
  location: string;
  photo_url: string;
  stats: ProfileStat[];
  contact_email: string;
  contact_linkedin: string;
  contact_portfolio: string;
  contact_github: string;
  cv_url_en?: string;
  cv_url_id?: string;
  footer_en: string;
  footer_id: string;
  contact_cta_en: string;
  contact_cta_id: string;
  about_en: string[];
  about_id: string[];
  pills_en: string[];
  pills_id: string[];
  certifications: Certification[];
}

export interface CurrentlyBuilding {
  id?: number;
  sort_order?: number;
  name_en: string;
  name_id: string;
  description_en: string;
  description_id: string;
  status_en: string;
  status_id: string;
  stack: string[];
}

export interface Post {
  id: number;
  slug: string;
  title_en: string;
  title_id: string;
  excerpt_en: string;
  excerpt_id: string;
  content_en: string;
  content_id: string;
  cover_image: string | null;
  published_at: string | null;
  updated_at: string | null;
}

export interface AnalyticsEvent {
  id: number;
  event_type: string;
  event_value: string;
  session_id: string;
  created_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  locale: string;
  created_at: string;
}
