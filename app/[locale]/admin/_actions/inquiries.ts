"use server";

import { requireAdmin } from "@/lib/server-boundary";
import type { ContactMessage } from "@/lib/types";

export async function getInquiries(): Promise<ContactMessage[]> {
  try {
    const supabase = await requireAdmin();
    const { data, error } = await supabase
      .from("contact_messages")
      .select("id,name,email,message,locale,created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) {
      console.error("getInquiries:", error);
      return [];
    }
    return (data as ContactMessage[]) ?? [];
  } catch (e) {
    console.error("getInquiries:", e);
    return [];
  }
}
