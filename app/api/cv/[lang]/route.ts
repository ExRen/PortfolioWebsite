import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ lang: string }> }
) {
  const { lang } = await params;
  if (lang !== "en" && lang !== "id") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profile")
    .select("cv_url_en,cv_url_id")
    .eq("id", 1)
    .maybeSingle();

  const cvUrl: string | undefined = data?.[`cv_url_${lang}`];
  if (error || !cvUrl) {
    return NextResponse.json({ error: "CV not uploaded yet" }, { status: 404 });
  }

  // ponytail: fire-and-forget, analytics must never break the download
  try {
    await supabase
      .from("analytics_events")
      .insert({ event_type: "cv_download", event_value: lang });
  } catch {
    // ignore analytics failures
  }

  return NextResponse.redirect(cvUrl, 302);
}