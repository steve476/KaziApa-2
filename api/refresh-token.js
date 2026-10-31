// api/refresh-token.js
// Swaps a still-valid login token for a fresh one so people are not asked for an SMS code every 30 days.
// Refused when: the token is fake or expired, the account is banned, or it is more than
// MAX_SESSION_DAYS since the last SMS code.
import { signLoginToken, checkLoginToken, MAX_SESSION_DAYS } from "./_login-token.js";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://dalaawxoiecrmfwxwrdn.supabase.co";
const DB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

function db(path) {
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      "Content-Type": "application/json",
      apikey: DB_KEY,
      ...(String(DB_KEY || "").startsWith("sb_") ? {} : { Authorization: `Bearer ${DB_KEY}` }),
    },
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ success: false, error: "Method not allowed" });

  const claims = checkLoginToken((req.body || {}).token);
  if (!claims) return res.status(401).json({ success: false, error: "Please log in again." });

  const now = Math.floor(Date.now() / 1000);
  const authAt = claims.auth_at || claims.iat || now;
  if (now - authAt > MAX_SESSION_DAYS * 24 * 60 * 60) {
    return res.status(401).json({ success: false, error: "Please log in again." });
  }

  try {
    // Banned accounts do not get a fresh token (same phone written as 07..., 2547... or +2547...)
    const fp = claims.phone;
    const variants = [fp, "0" + fp.slice(4), fp.slice(1)].map(encodeURIComponent).join(",");
    const r = await db(`users?phone=in.(${variants})&select=banned`);
    const rows = r.ok ? await r.json() : [];
    if (Array.isArray(rows) && rows.some((u) => u.banned)) {
      return res.status(403).json({ success: false, error: "Account suspended." });
    }
  } catch (e) {
    console.error("refresh-token: ban check failed:", e.message);
    // If the check itself fails, do not extend the session.
    return res.status(503).json({ success: false, error: "Try again shortly." });
  }

  const fresh = signLoginToken(claims.phone, authAt);
  if (!fresh) return res.status(500).json({ success: false, error: "Could not refresh." });
  return res.status(200).json({ success: true, token: fresh.token, tokenExpiresAt: fresh.expiresAt });
}
