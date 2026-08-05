"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/server-boundary";
import type { AnalyticsEvent } from "@/lib/types";

export async function getAnalytics(): Promise<AnalyticsEvent[]> {
  try {
    const supabase = await requireAdmin();
    const { data, error } = await supabase
      .from("analytics_events")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("getAnalytics:", error);
      return [];
    }
    return (data as AnalyticsEvent[]) ?? [];
  } catch (e) {
    console.error("getAnalytics:", e);
    return [];
  }
}
