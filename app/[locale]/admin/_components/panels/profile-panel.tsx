"use client";

import { useState } from "react";
import { updateProfile, uploadPhoto, uploadCv, clearCv } from "../../_actions/crud";
import type { Profile, ProfileStat, Certification } from "@/lib/types";

export function ProfilePanel({
  initial,
  locale: _locale,
  onChanged,
  onError,
}: {
  initial: Profile;
  locale: string;
  onChanged: () => void;
  onError: (m: string) => void;
}) {
  const [p, setP] = useState<Profile>({ ...initial });
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    const r = await updateProfile(p);
    setBusy(false);
    if (r.ok) onChanged();
    else onError(r.error ?? "Save failed");
  };

  const onUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    const r = await uploadPhoto(fd);
    if (r.ok && r.url) {
      setP({ ...p, photo_url: r.url });
      onChanged();
    } else {
      onError(r.error ?? "Upload failed");
    }
  };

  const onUploadCv = async (lang: "en" | "id", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("lang", lang);
    const r = await uploadCv(fd);
    if (r.ok && r.url) {
      setP({ ...p, [`cv_url_${lang}`]: r.url });
      onChanged();
    } else {
      onError(r.error ?? "Upload failed");
    }
  };

  const onClearCv = async (lang: "en" | "id") => {
    const r = await clearCv(lang);
    if (r.ok) {
      setP({ ...p, [`cv_url_${lang}`]: "" });
      onChanged();
    } else {
      onError(r.error ?? "Clear failed");
    }
  };

  const setStat = (i: number, k: keyof ProfileStat, v: string) => {
    const stats = [...p.stats];
    stats[i] = { ...stats[i], [k]: v };
    setP({ ...p, stats });
  };

  const setCert = (i: number, k: keyof Certification, v: string) => {
    const certifications = [...p.certifications];
    certifications[i] = { ...certifications[i], [k]: v };
    setP({ ...p, certifications });
  };

  return (
    <div>
      <div className="panel-header">
        <h2>Profile &amp; Settings</h2>
        <button className="btn btn-primary" onClick={save} disabled={busy}>
          {busy ? "Saving..." : "Save Profile"}
        </button>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">HERO NAME</label>
          <input
            className="form-input"
            value={p.hero_name}
            onChange={(e) => setP({ ...p, hero_name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">LOCATION</label>
          <input
            className="form-input"
            value={p.location}
            onChange={(e) => setP({ ...p, location: e.target.value })}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">TAGLINE (EN)</label>
          <input
            className="form-input"
            value={p.hero_tagline_en}
            onChange={(e) => setP({ ...p, hero_tagline_en: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">TAGLINE (ID)</label>
          <input
            className="form-input"
            value={p.hero_tagline_id}
            onChange={(e) => setP({ ...p, hero_tagline_id: e.target.value })}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">BIO (EN)</label>
          <textarea
            className="form-textarea"
            rows={3}
            value={p.hero_bio_en}
            onChange={(e) => setP({ ...p, hero_bio_en: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">BIO (ID)</label>
          <textarea
            className="form-textarea"
            rows={3}
            value={p.hero_bio_id}
            onChange={(e) => setP({ ...p, hero_bio_id: e.target.value })}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">BADGE (EN)</label>
          <input
            className="form-input"
            value={p.badge_en}
            onChange={(e) => setP({ ...p, badge_en: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">BADGE (ID)</label>
          <input
            className="form-input"
            value={p.badge_id}
            onChange={(e) => setP({ ...p, badge_id: e.target.value })}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">FOOTER (EN)</label>
          <input
            className="form-input"
            value={p.footer_en}
            onChange={(e) => setP({ ...p, footer_en: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">FOOTER (ID)</label>
          <input
            className="form-input"
            value={p.footer_id}
            onChange={(e) => setP({ ...p, footer_id: e.target.value })}
          />
        </div>
      </div>

      <h3 style={{ marginTop: 24, marginBottom: 12 }}>Photo</h3>
      <div className="form-group">
        {p.photo_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.photo_url}
            alt="Profile"
            style={{
              width: 120,
              height: 144,
              objectFit: "cover",
              borderRadius: 18,
              marginBottom: 12,
            }}
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={onUploadPhoto}
          className="form-input"
        />
      </div>

      <h3 style={{ marginTop: 24, marginBottom: 12 }}>CV (Resume)</h3>
      {(["en", "id"] as const).map((lang) => (
        <div key={lang} className="form-row" style={{ alignItems: "center" }}>
          <div className="form-group">
            <label className="form-label">CV URL ({lang.toUpperCase()})</label>
            {p[`cv_url_${lang}`] ? (
              <a href={p[`cv_url_${lang}`]} target="_blank" rel="noopener noreferrer">
                {p[`cv_url_${lang}`]}
              </a>
            ) : (
              <span style={{ opacity: 0.6 }}>Not uploaded — hero falls back to Google Drive link</span>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">UPLOAD ({lang.toUpperCase()})</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => onUploadCv(lang, e)}
              className="form-input"
            />
          </div>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => onClearCv(lang)}
            disabled={!p[`cv_url_${lang}`]}
          >
            Clear
          </button>
        </div>
      ))}

      <h3 style={{ marginTop: 24, marginBottom: 12 }}>Stats</h3>
      {p.stats.map((s, i) => (
        <div key={i} className="form-row" style={{ alignItems: "center" }}>
          <div className="form-group">
            <label className="form-label">VALUE</label>
            <input
              className="form-input"
              value={s.value}
              onChange={(e) => setStat(i, "value", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">LABEL (EN)</label>
            <input
              className="form-input"
              value={s.label_en}
              onChange={(e) => setStat(i, "label_en", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">LABEL (ID)</label>
            <input
              className="form-input"
              value={s.label_id}
              onChange={(e) => setStat(i, "label_id", e.target.value)}
            />
          </div>
        </div>
      ))}

      <h3 style={{ marginTop: 24, marginBottom: 12 }}>Contact</h3>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">EMAIL</label>
          <input
            className="form-input"
            value={p.contact_email}
            onChange={(e) => setP({ ...p, contact_email: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">LINKEDIN</label>
          <input
            className="form-input"
            value={p.contact_linkedin}
            onChange={(e) => setP({ ...p, contact_linkedin: e.target.value })}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">GITHUB</label>
          <input
            className="form-input"
            value={p.contact_github}
            onChange={(e) => setP({ ...p, contact_github: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">PORTFOLIO URL</label>
          <input
            className="form-input"
            value={p.contact_portfolio}
            onChange={(e) => setP({ ...p, contact_portfolio: e.target.value })}
          />
        </div>
      </div>

      <h3 style={{ marginTop: 24, marginBottom: 12 }}>About (paragraphs)</h3>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">ABOUT (EN, one per line)</label>
          <textarea
            className="form-textarea"
            rows={6}
            value={p.about_en.join("\n\n")}
            onChange={(e) =>
              setP({ ...p, about_en: e.target.value.split(/\n\n+/).filter(Boolean) })
            }
          />
        </div>
        <div className="form-group">
          <label className="form-label">ABOUT (ID, one per line)</label>
          <textarea
            className="form-textarea"
            rows={6}
            value={p.about_id.join("\n\n")}
            onChange={(e) =>
              setP({ ...p, about_id: e.target.value.split(/\n\n+/).filter(Boolean) })
            }
          />
        </div>
      </div>

      <h3 style={{ marginTop: 24, marginBottom: 12 }}>Pills</h3>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">PILLS (EN, comma separated)</label>
          <input
            className="form-input"
            value={p.pills_en.join(", ")}
            onChange={(e) =>
              setP({
                ...p,
                pills_en: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
              })
            }
          />
        </div>
        <div className="form-group">
          <label className="form-label">PILLS (ID, comma separated)</label>
          <input
            className="form-input"
            value={p.pills_id.join(", ")}
            onChange={(e) =>
              setP({
                ...p,
                pills_id: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
              })
            }
          />
        </div>
      </div>

      <h3 style={{ marginTop: 24, marginBottom: 12 }}>Certifications</h3>
      {p.certifications.map((c, i) => (
        <div key={i} className="form-row">
          <div className="form-group" style={{ flex: 2 }}>
            <label className="form-label">NAME</label>
            <input
              className="form-input"
              value={c.name}
              onChange={(e) => setCert(i, "name", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">ISSUER</label>
            <input
              className="form-input"
              value={c.issuer}
              onChange={(e) => setCert(i, "issuer", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">YEAR</label>
            <input
              className="form-input"
              value={c.year}
              onChange={(e) => setCert(i, "year", e.target.value)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
