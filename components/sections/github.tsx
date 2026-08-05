import { getTranslations } from "next-intl/server";
import Image from "next/image";

export async function GitHub() {
  const t = await getTranslations("section");

  return (
    <section className="sec border-top" id="github">
      <div className="sec-hdr">
        <span className="sec-num">05 —</span>
        <h2 className="sec-title">{t("github")}</h2>
      </div>
      <div className="github-profile-layout">
        <div className="gh-sidebar">
          <div className="gh-avatar-wrap">
            <Image
              src="https://avatars.githubusercontent.com/ExRen?s=400"
              alt="Bima Aryadinata GitHub avatar"
              width={280}
              height={280}
              className="gh-avatar"
              unoptimized
            />
          </div>
          <div className="gh-name">Bima Aryadinata</div>
          <div className="gh-username">@ExRen</div>
          <p className="gh-bio">
            Full-Stack Developer &amp; IT Communicator · ASABRI
          </p>
          <div className="gh-meta">
            <div className="gh-meta-item">
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M2 4.75A2.75 2.75 0 0 1 4.75 2h6.5A2.75 2.75 0 0 1 14 4.75v6.5A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25ZM4.75 3.5A1.25 1.25 0 0 0 3.5 4.75v6.5A1.25 1.25 0 0 0 4.75 12.5h6.5a1.25 1.25 0 0 0 1.25-1.25v-6.5A1.25 1.25 0 0 0 11.25 3.5Z" />
              </svg>
              <a
                href="https://github.com/ExRen"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/ExRen
              </a>
            </div>
          </div>
        </div>
        <div className="gh-main">
          <div>
            <div className="gh-section-title">Contribution Graph</div>
            <div className="gh-graph-wrap">
              <Image
                src="https://github-readme-stats.vercel.app/api?username=ExRen&show_icons=true&theme=default&hide_border=true"
                alt="GitHub stats"
                width={495}
                height={195}
                className="gh-stats-card-img"
                unoptimized
              />
              <Image
                src="https://streak-stats.demolab.com?user=ExRen&theme=default&hide_border=true"
                alt="GitHub streak"
                width={320}
                height={195}
                className="gh-streak-card-img"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
