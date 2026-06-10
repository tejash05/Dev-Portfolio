# Tejash Tarun — Developer Portfolio

Live site: https://dev-portfolio-khaki-seven.vercel.app/

A React + Vite portfolio featuring an **Agentic Portfolio Assistant** with two modes:

- **Local Mode** — rule-based assistant that runs entirely in the browser. No API key required.
- **Groq RAG Lite Mode** — deeper, AI-assisted answers via a secure serverless function (`/api/agent`). Requires `GROQ_API_KEY`.

The assistant uses local deterministic answers for common portfolio questions and Groq RAG Lite only for complex/JD-based questions. The 10-prompt daily AI limit applies only to Groq requests, not local answers.

The portfolio also includes a secure contact automation flow: the Contact section and Portfolio Agent can submit messages to `/api/contact`, which sends email from a Vercel serverless function. Email provider secrets stay server-only.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173

This runs the Vite frontend only, so the assistant uses **Local Mode**.

## Agentic Portfolio Assistant — Groq RAG Lite Setup

### 1. Run modes

**Local Mode (no API key):**

```bash
npm run dev
```

Open http://localhost:5173. The `/api/agent` endpoint does not run on the Vite dev server, so the assistant uses the local fallback.

**Groq AI Mode (with API key):**

```bash
npm i -g vercel   # once, if not installed
vercel dev
```

Open the URL Vercel prints (usually http://localhost:3000). This runs both the React app and the serverless `/api/agent`, so Groq RAG Lite works locally.

### 2. Get a Groq API key

1. Go to the [Groq Console](https://console.groq.com/).
2. Sign in or create an account (Google, GitHub, email, or SSO).
3. Open the **API Keys** section.
4. Create a new API key.
5. Copy the key immediately and keep it private.

**Security:** Never paste the key into React/frontend files, never commit `.env.local`, and never share the key publicly.

### 3. Where to store the key (local)

In the project root, create a `.env.local` file:

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

- `GROQ_API_KEY` is required for Groq RAG Lite.
- `GROQ_MODEL` is optional; if omitted, the backend uses the default model (`llama-3.3-70b-versatile`).
- `.env.local` is already ignored by `.gitignore`.
- Use `.env.example` as a placeholder-only template.

### 4. Deploy on Vercel

1. Open your project in [Vercel](https://vercel.com/).
2. Go to **Settings → Environment Variables**.
3. Add:

   ```env
   GROQ_API_KEY=your_groq_api_key_here
   GROQ_MODEL=llama-3.3-70b-versatile
   ```

4. Redeploy so the new variables take effect.

### 5. Troubleshooting

- **`/api/agent` returns 404 with `npm run dev`** — The Vite dev server does not run Vercel serverless functions. Use `vercel dev` for full local API testing (or deploy to Vercel).
- **Assistant says "Using local portfolio mode"** — Usually a missing `GROQ_API_KEY`, running with `npm run dev`, a Groq API error, the daily AI limit, or a network issue. Local Mode still works.
- **AI prompts show 0/10** — The demo daily limit (10 prompts per visitor per day, stored in localStorage per browser/device) was reached. Wait until the next day or clear localStorage for testing.

## Contact Form Automation

The portfolio contact flow works like this:

```text
Contact section / Portfolio Agent contact form
→ POST /api/contact
→ Vercel serverless function
→ Resend API
→ Tejash receives the message in Gmail
```

The frontend never receives `RESEND_API_KEY`. The key is read only inside `api/contact.js` through `process.env`.

### Required Environment Variables

Add these locally in `.env.local` and in Vercel production environment variables:

```env
RESEND_API_KEY=your_resend_api_key_here
CONTACT_TO_EMAIL=tejashtarunofficial@gmail.com
CONTACT_FROM_EMAIL="Portfolio Agent <onboarding@resend.dev>"
```

- `RESEND_API_KEY` is required for `/api/contact` to send email.
- `CONTACT_TO_EMAIL` is where messages are delivered.
- `CONTACT_FROM_EMAIL` must be a valid Resend sender. For production, use a verified domain sender if available.
- `.env.local` must stay private and is ignored by Git.

### Local Testing

Use `vercel dev` so the serverless `/api/contact` route runs locally:

```bash
set -a
source .env.local
set +a
vercel dev
```

Then open the Vercel local URL (usually http://localhost:3000) and test either:

- The Contact section form.
- The Portfolio Agent by asking: `send message` or `contact Tejash`.

You can also test the API directly:

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Recruiter","email":"recruiter@example.com","company":"Example Co","message":"Testing the contact form.","source":"contact-section"}'
```

### Vercel Production Setup

1. Open the project in Vercel.
2. Go to **Settings → Environment Variables**.
3. Add `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and `CONTACT_FROM_EMAIL`.
4. Redeploy so the serverless function receives the variables.

### Anti-Spam Notes

- The form includes a honeypot field.
- The frontend applies a basic per-browser cooldown before another message can be sent.
- The server validates required fields, email shape, message length, and basic spam patterns.
- WhatsApp auto-send is intentionally not implemented. A click-to-chat button can be enabled later by setting `WHATSAPP_NUMBER` in `src/utils/contactApiClient.js`.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite dev server (Local Mode assistant) |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build |
| `vercel dev` | Frontend + serverless APIs (`/api/agent`, `/api/contact`) |

## Tech stack

React, Vite, Tailwind CSS, Framer Motion, Vercel Serverless Functions, Groq (optional), Resend (optional contact email).
