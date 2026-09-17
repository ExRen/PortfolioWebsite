"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { submitContact } from "@/app/actions/contact";

export function ContactForm({ locale }: { locale: string }) {
  const t = useTranslations("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">(
    "idle"
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const result = await submitContact({ name, email, message, locale });
      if (result.ok) {
        setStatus("ok");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("err");
      }
    } catch {
      setStatus("err");
    }
  };

  return (
    <form className="p-6 md:p-8 rounded-3xl liquid-glass-panel flex flex-col gap-4" onSubmit={onSubmit} id="contactForm">
      <div>
        <label htmlFor="contact-name" className="sr-only">
          {t("contact.name")}
        </label>
        <input
          className="w-full px-4 py-3 rounded-2xl liquid-glass-input text-fg placeholder:text-ink-muted-48 font-body-sm text-sm focus:outline-none transition-all"
          type="text"
          id="contact-name"
          aria-label={t("contact.name")}
          placeholder={t("contact.name")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="sr-only">
          {t("contact.email")}
        </label>
        <input
          className="w-full px-4 py-3 rounded-2xl liquid-glass-input text-fg placeholder:text-ink-muted-48 font-body-sm text-sm focus:outline-none transition-all"
          type="email"
          id="contact-email"
          aria-label={t("contact.email")}
          placeholder={t("contact.email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="sr-only">
          {t("contact.message")}
        </label>
        <textarea
          className="w-full px-4 py-3 rounded-2xl liquid-glass-input text-fg placeholder:text-ink-muted-48 font-body-sm text-sm focus:outline-none transition-all resize-y"
          id="contact-message"
          aria-label={t("contact.message")}
          placeholder={t("contact.message")}
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="magnetic-btn w-full py-3.5 px-6 rounded-full liquid-pill-btn text-white font-body-sm text-sm font-semibold transition-all border border-orange-300/40 disabled:opacity-50 cursor-pointer"
        disabled={status === "sending"}
      >
        {status === "sending" ? t("misc.sending") : t("contact.send")}
      </button>
      <div
        role="status"
        aria-live="polite"
        className={`text-center font-label-meta text-xs font-semibold ${
          status === "ok" ? "text-emerald-400" : status === "err" ? "text-rose-400" : ""
        }`}
      >
        {status === "ok"
          ? t("misc.messageSent")
          : status === "err"
            ? t("misc.messageFailed")
            : ""}
      </div>
    </form>
  );
}
