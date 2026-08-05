"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/server-boundary";
import {
  DEFAULT_PROJECTS,
  DEFAULT_SKILLS,
  DEFAULT_EXPERIENCES,
  DEFAULT_EDUCATION,
  DEFAULT_PROFILE,
} from "@/lib/data";

const requireAuth = requireAdmin;

export async function seedDefaults() {
  try {
    const supabase = await requireAuth();
    const { error } = await supabase.rpc("seed_portfolio_defaults", {
      payload: { projects: DEFAULT_PROJECTS, skills: DEFAULT_SKILLS, experiences: DEFAULT_EXPERIENCES,
        education: DEFAULT_EDUCATION, profile: DEFAULT_PROFILE },
    });
    if (error) throw new Error("Unable to seed defaults");

    revalidatePath("/en", "layout");
    revalidatePath("/id", "layout");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function resyncToDatabase() {
  // Same as seedDefaults — alias kept for parity with the original admin UI
  return seedDefaults();
}
