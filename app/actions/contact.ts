"use server";

export async function submitContact(form: {
  name: string;
  email: string;
  message: string;
  locale: string; honeypot?: string;
}) {
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { cleanContact } = await import("@/lib/server-boundary");
    const input = cleanContact(form);
    const { data, error } = await supabase.rpc("submit_contact", { p_name: input.name, p_email: input.email, p_message: input.message, p_locale: input.locale });

    if (error || data !== true) {
      console.error("contact submit error:", error);
      return { ok: false };
    }
    return { ok: true };
  } catch (e) {
    console.error("contact submit exception:", e);
    return { ok: false };
  }
}
