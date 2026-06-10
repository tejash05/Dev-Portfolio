// Vercel serverless function: POST /api/contact
// Sends recruiter/visitor messages through Resend without exposing API keys
// to the frontend.

const RESEND_URL = "https://api.resend.com/emails";
const DEFAULT_TO_EMAIL = "tejashtarunofficial@gmail.com";
const DEFAULT_FROM_EMAIL = "Portfolio Agent <onboarding@resend.dev>";
const VALID_SOURCES = new Set(["portfolio-agent", "contact-section"]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SPAM_PATTERNS = [
  /\bcasino\b/i,
  /\bcrypto\b/i,
  /\bforex\b/i,
  /\bviagra\b/i,
  /\bseo backlinks?\b/i,
];

const parseBody = (body) => {
  if (typeof body !== "string") return body || {};
  try {
    return JSON.parse(body);
  } catch {
    return {};
  }
};

const cleanString = (value, max = 2000) =>
  (value || "").toString().replace(/\s+/g, " ").trim().slice(0, max);

const looksSpammy = ({ name, email, message }) => {
  const combined = `${name} ${email} ${message}`;
  const linkCount = (message.match(/https?:\/\//gi) || []).length;
  const repeatedChars = /(.)\1{12,}/.test(message);
  return linkCount > 3 || repeatedChars || SPAM_PATTERNS.some((pattern) => pattern.test(combined));
};

const escapeHtml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const buildEmailHtml = ({ name, email, company, message, source, timestamp }) => `
  <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
    <h2>New Portfolio Message</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Company/Role:</strong> ${escapeHtml(company || "Not provided")}</p>
    <p><strong>Source:</strong> ${escapeHtml(source)}</p>
    <p><strong>Timestamp:</strong> ${escapeHtml(timestamp)}</p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0" />
    <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
  </div>
`;

const buildEmailText = ({ name, email, company, message, source, timestamp }) =>
  [
    "New Portfolio Message",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Company/Role: ${company || "Not provided"}`,
    `Source: ${source}`,
    `Timestamp: ${timestamp}`,
    "",
    "Message:",
    message,
  ].join("\n");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = parseBody(req.body);

  // Honeypot: silently accept bots without sending email.
  if (cleanString(body.website, 200)) {
    res.status(200).json({ ok: true });
    return;
  }

  const name = cleanString(body.name, 120);
  const email = cleanString(body.email, 180).toLowerCase();
  const company = cleanString(body.company, 180);
  const rawMessage = (body.message || "").toString().trim();
  const message = cleanString(rawMessage, 2000);
  const source = VALID_SOURCES.has(body.source) ? body.source : "contact-section";

  if (!name || !email || !message) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  if (!EMAIL_RE.test(email)) {
    res.status(400).json({ error: "Invalid email" });
    return;
  }

  if (rawMessage.length > 2000) {
    res.status(400).json({ error: "Message is too long" });
    return;
  }

  if (looksSpammy({ name, email, message })) {
    res.status(400).json({ error: "Invalid submission" });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || DEFAULT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM_EMAIL;

  if (!apiKey) {
    res.status(500).json({ error: "Contact email service is not configured" });
    return;
  }

  const timestamp = new Date().toISOString();
  const payload = {
    from: fromEmail,
    to: [toEmail],
    reply_to: email,
    subject: `New Portfolio Message from ${name}`,
    html: buildEmailHtml({ name, email, company, message, source, timestamp }),
    text: buildEmailText({ name, email, company, message, source, timestamp }),
  };

  try {
    const response = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      res.status(502).json({ error: "Email provider failed" });
      return;
    }

    res.status(200).json({ ok: true });
  } catch {
    res.status(500).json({ error: "Could not send message" });
  }
}
