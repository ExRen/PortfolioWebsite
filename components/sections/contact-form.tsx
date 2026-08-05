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
    <form className="contact-form" onSubmit={onSubmit} id="contactForm">
      <input
        className="cf-input"
        type="text"
        id="contact-name"
        aria-label={t("contact.name")}
        placeholder={t("contact.name")}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        className="cf-input"
        type="email"
        id="contact-email"
        aria-label={t("contact.email")}
        placeholder={t("contact.email")}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <textarea
        className="cf-input cf-textarea"
        id="contact-message"
        aria-label={t("contact.message")}
        placeholder={t("contact.message")}
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />
      <button
        type="submit"
        className="cta-btn cta-primary cf-submit"
        disabled={status === "sending"}
      >
        {status === "sending" ? t("misc.sending") : t("contact.send")}
      </button>
      <div
        role="status"
        aria-live="polite"
        className={`cf-status ${status === "ok" ? "success" : status === "err" ? "error" : ""}`}
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
