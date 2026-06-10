import { useMemo, useState } from "react";
import {
  CONTACT_FALLBACK_EMAIL,
  WHATSAPP_NUMBER,
  submitContactMessage,
} from "../utils/contactApiClient";

const initialForm = {
  name: "",
  email: "",
  company: "",
  message: "",
  website: "",
};

const emailLooksValid = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const ContactForm = ({ source = "contact-section", compact = false }) => {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const whatsappHref = useMemo(() => {
    if (!WHATSAPP_NUMBER) return "";
    const text = encodeURIComponent(
      "Hi Tejash, I found your portfolio and would like to connect."
    );
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  }, []);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Please enter your name.";
    if (!emailLooksValid(form.email.trim())) return "Please enter a valid email.";
    if (!form.message.trim()) return "Please enter a message.";
    if (form.message.trim().length > 2000) {
      return "Please keep your message under 2000 characters.";
    }
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const error = validate();
    if (error) {
      setStatus({ type: "error", message: error });
      return;
    }

    setSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const result = await submitContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim(),
        message: form.message.trim(),
        website: form.website,
        source,
      });

      setStatus({ type: result.ok ? "success" : "error", message: result.message });
      if (result.ok) setForm(initialForm);
    } catch {
      setStatus({
        type: "error",
        message:
          "Sorry, the message could not be sent right now. Please email Tejash directly at tejashtarunofficial@gmail.com.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass =
    "w-full rounded-xl border border-white/10 bg-stone-950/60 px-3 py-2.5 text-sm text-stone-200 placeholder:text-stone-500 transition-colors focus:border-cyan-200/40 focus:outline-none";

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-2xl border border-white/10 bg-white/[0.04] ${
        compact ? "space-y-2 p-3" : "space-y-4 p-5 shadow-2xl shadow-black/30"
      }`}
    >
      <div className={compact ? "space-y-2" : "grid gap-4 sm:grid-cols-2"}>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-stone-400">
            Name *
          </span>
          <input
            type="text"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            autoComplete="name"
            className={fieldClass}
            placeholder="Your name"
            required
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-stone-400">
            Email *
          </span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            autoComplete="email"
            className={fieldClass}
            placeholder="you@company.com"
            required
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-stone-400">
          Company / Role
        </span>
        <input
          type="text"
          value={form.company}
          onChange={(event) => updateField("company", event.target.value)}
          autoComplete="organization-title"
          className={fieldClass}
          placeholder="Recruiter, hiring manager, founder..."
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-stone-400">
          Message *
        </span>
        <textarea
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          rows={compact ? 3 : 5}
          maxLength={2000}
          className={`${fieldClass} resize-none`}
          placeholder="Tell Tejash what role, opportunity, or conversation you have in mind."
          required
        />
      </label>

      <label className="hidden" aria-hidden="true">
        Website
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(event) => updateField("website", event.target.value)}
        />
      </label>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-stone-900 transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          {submitting ? "Sending..." : "Send Message"}
        </button>

        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-stone-300 transition-colors hover:border-cyan-200/40 hover:text-white"
          >
            WhatsApp
          </a>
        )}
      </div>

      {status.message && (
        <p
          className={`text-sm ${
            status.type === "success" ? "text-cyan-200" : "text-red-300"
          }`}
        >
          {status.message.includes(CONTACT_FALLBACK_EMAIL) ? (
            <>
              Sorry, the message could not be sent right now. Please email Tejash
              directly at{" "}
              <a
                href={`mailto:${CONTACT_FALLBACK_EMAIL}`}
                className="underline underline-offset-4"
              >
                {CONTACT_FALLBACK_EMAIL}
              </a>
              .
            </>
          ) : (
            status.message
          )}
        </p>
      )}
    </form>
  );
};

export default ContactForm;
