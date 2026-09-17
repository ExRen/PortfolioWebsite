import type { Profile } from "@/lib/types";

export async function Footer({
  profile,
  locale,
}: {
  profile: Profile;
  locale: string;
}) {
  return (
    <footer className="w-full py-8 border-t border-hairline bg-[var(--canvas-parchment)] backdrop-blur-md mt-16">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-label-meta text-xs text-ink-muted-48 text-center sm:text-left" id="footerText">
          {locale === "id" ? profile.footer_id : profile.footer_en}
        </span>
        <span className="font-label-code text-xs text-primary font-semibold">
          Next.js 15 · TypeScript · Supabase
        </span>
      </div>
    </footer>
  );
}
