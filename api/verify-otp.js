// api/verify-otp.js
import crypto from "crypto";
import { signLoginToken } from "./_login-token.js";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://dalaawxoiecrmfwxwrdn.supabase.co";
// Private service key once SUPABASE_SERVICE_ROLE_KEY is set in Vercel; public key until then.
const DB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

const enc = encodeURIComponent;
const MAX_ATTEMPTS = 5;

function db(path, options = {}) {
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      apikey: DB_KEY,
      // New-style secret keys (sb_secret_...) go in "apikey" only; the older service_role key is also sent as a Bearer token
      ...(String(DB_KEY || "").startsWith("sb_") ? {} : { Authorization: `Bearer ${DB_KEY}` }),
      ...options.headers,
    },
  });
}

function normalizePhone(raw) {
  const d = String(raw || "").replace(/[^\d+]/g, "");
  if (d.startsWith("+")) return d;
  if (d.startsWith("254")) return "+" + d;
  if (d.startsWith("0")) return "+254" + d.slice(1);
  return "+254" + d;
}

function sameCode(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { phone, otp } = req.body || {};
  if (!phone || !otp) return res.status(400).json({ success: false, error: "Phone and OTP required" });

  const code = String(otp).trim();
  if (!/^\d{6}$/.test(code)) return res.status(400).json({ success: false, error: "Enter the 6-digit code." });

  const fp = normalizePhone(phone);
  const isReviewer = fp === "+254700000000";

  try {
    // Latest code for this number
    const response = await db(`otp_codes?phone=eq.${enc(fp)}&order=created_at.desc&limit=1&select=*`);
    const data = response.ok ? await response.json() : [];
    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ success: false, error: "No OTP found. Request a new code." });
    }
    const record = data[0];

    if (new Date() > new Date(record.expires_at)) {
      return res.status(400).json({ success: false, error: "Code expired. Request a new one." });
    }

    // Too many wrong guesses on this code? (needs the "attempts" column; skipped if it isn't added yet)
    const attempts = typeof record.attempts === "number" ? record.attempts : null;
    if (!isReviewer && attempts !== null && attempts >= MAX_ATTEMPTS) {
      await db(`otp_codes?phone=eq.${enc(fp)}`, { method: "DELETE" }).catch(() => {});
      return res.status(429).json({ success: false, error: "Too many wrong attempts. Request a new code." });
    }

    if (!sameCode(record.otp, code)) {
      if (!isReviewer && attempts !== null) {
        const next = attempts + 1;
        if (next >= MAX_ATTEMPTS) {
          await db(`otp_codes?phone=eq.${enc(fp)}`, { method: "DELETE" }).catch(() => {});
          return res.status(429).json({ success: false, error: "Too many wrong attempts. Request a new code." });
        }
        await db(`otp_codes?phone=eq.${enc(fp)}&otp=eq.${enc(record.otp)}`, {
          method: "PATCH",
          body: JSON.stringify({ attempts: next }),
        }).catch(() => {});
      }
      return res.status(400).json({ success: false, error: "Wrong code. Try again." });
    }

    // Correct: remove all codes for this number so none can be reused
    await db(`otp_codes?phone=eq.${enc(fp)}`, { method: "DELETE" }).catch(() => {});
    const login = signLoginToken(fp, Math.floor(Date.now() / 1000));
    return res.status(200).json({ success: true, token: login ? login.token : null, tokenExpiresAt: login ? login.expiresAt : null });
  } catch (err) {
    console.error("verify-otp error:", err);
    return res.status(500).json({ success: false, error: "Something went wrong. Please try again." });
  }
}
