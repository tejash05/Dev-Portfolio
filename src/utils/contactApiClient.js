const CONTACT_COOLDOWN_MS = 45 * 1000;
const COOLDOWN_KEY = "portfolioContactLastSentAt";

export const CONTACT_FALLBACK_EMAIL = "tejashtarunofficial@gmail.com";
export const WHATSAPP_NUMBER = "";

const getLastSentAt = () => {
  try {
    return Number(localStorage.getItem(COOLDOWN_KEY) || 0);
  } catch {
    return 0;
  }
};

const setLastSentAt = () => {
  try {
    localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
  } catch {
    // Cooldown is best-effort per browser/device.
  }
};

export const getContactCooldownSeconds = () => {
  const remaining = CONTACT_COOLDOWN_MS - (Date.now() - getLastSentAt());
  return Math.max(0, Math.ceil(remaining / 1000));
};

export const submitContactMessage = async (payload) => {
  const cooldownSeconds = getContactCooldownSeconds();
  if (cooldownSeconds > 0) {
    return {
      ok: false,
      reason: "cooldown",
      message: `Please wait ${cooldownSeconds}s before sending another message.`,
    };
  }

  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return {
      ok: false,
      reason: "failed",
      message:
        "Sorry, the message could not be sent right now. Please email Tejash directly at tejashtarunofficial@gmail.com.",
    };
  }

  setLastSentAt();
  return {
    ok: true,
    message: "Thanks — your message has been sent to Tejash.",
  };
};
