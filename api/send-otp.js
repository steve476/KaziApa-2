// api/send-otp.js
import crypto from "crypto";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://dalaawxoiecrmfwxwrdn.supabase.co";
// Uses the private service key once SUPABASE_SERVICE_ROLE_KEY is set in Vercel.
// Until then it falls back to the public key, so deploying this file first is safe.
const DB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

const enc = encodeURIComponent;

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

// Same rules as verify-otp.js, notify-message.js and save-push-subscription.js
function normalizePhone(raw) {
  const d = String(raw || "").replace(/[^\d+]/g, "");
  if (d.startsWith("+")) return d;
  if (d.startsWith("254")) return "+" + d;
  if (d.startsWith("0")) return "+254" + d.slice(1);
  return "+254" + d;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { phone } = req.body || {};
  if (!phone) return res.status(400).json({ success: false, error: "Phone required" });

  const fp = normalizePhone(phone);
  if (!/^\+254[17]\d{8}$/.test(fp)) {
    return res.status(400).json({ success: false, error: "Enter a valid Kenyan phone number." });
  }

  // Google Play reviewer test number: fixed code, no real SMS (reviewers outside Kenya
  // cannot receive one). Given only to Google in Play Console "App access".
  const REVIEWER_PHONE = "+254700000000";
  const REVIEWER_OTP = "123456";
  const isReviewer = fp === REVIEWER_PHONE;

  try {
    // Limits (skipped for the reviewer): 1 code per 30 seconds and 5 per hour for each number.
    if (!isReviewer) {
      const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const recentRes = await db(`otp_codes?phone=eq.${enc(fp)}&created_at=gte.${enc(hourAgo)}&select=created_at&order=created_at.desc`);
      if (recentRes.ok) {
        const recent = await recentRes.json();
        if (Array.isArray(recent) && recent.length) {
          if (Date.now() - Date.parse(recent[0].created_at) < 30 * 1000) {
            return res.status(429).json({ success: false, error: "Please wait 30 seconds before asking for another code." });
          }
          if (recent.length >= 5) {
            return res.status(429).json({ success: false, error: "Too many code requests. Please try again in an hour." });
          }
        }
      }
    }

    const otp = isReviewer ? REVIEWER_OTP : String(crypto.randomInt(100000, 1000000));

    const saveRes = await db("otp_codes", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ phone: fp, otp, expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() }),
    });
    if (!saveRes.ok) {
      console.error("send-otp: could not save code:", saveRes.status, await saveRes.text().catch(() => ""));
      return res.status(500).json({ success: false, error: "We couldn't send a code right now. Please try again." });
    }

    // Clean up codes older than a day (best effort)
    db(`otp_codes?created_at=lt.${enc(new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())}`, { method: "DELETE" }).catch(() => {});

    if (isReviewer) return res.status(200).json({ success: true, smsDelivered: true });

    if (!process.env.AT_API_KEY) {
      console.error("send-otp: AT_API_KEY is not set");
      return res.status(500).json({ success: false, error: "We couldn't send the SMS right now. Please try again in a minute." });
    }

    const params = new URLSearchParams();
    params.append("username", "Kaziapa");
    params.append("to", fp);
    params.append("message", `Your KaziApa verification code is: ${otp}. Valid for 10 minutes.`);
    params.append("from", "KaziApa"); // Approved sender ID

    const smsRes = await fetch("https://api.africastalking.com/version1/messaging", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        apiKey: process.env.AT_API_KEY,
      },
      body: params,
    });
    const smsData = await smsRes.json().catch(() => ({}));
    const recipient = smsData?.SMSMessageData?.Recipients?.[0];

    if (recipient && recipient.status === "Success") {
      return res.status(200).json({ success: true, smsDelivered: true });
    }

    // SMS failed: the code is NEVER sent back to the caller. Remove it and ask them to retry.
    console.error("send-otp: SMS failed:", recipient?.status || smsData?.SMSMessageData?.Message || smsRes.status);
    db(`otp_codes?phone=eq.${enc(fp)}&otp=eq.${enc(otp)}`, { method: "DELETE" }).catch(() => {});
    return res.status(200).json({
      success: false,
      error: "We couldn't send the SMS right now. Please try again in a minute.",
    });
  } catch (err) {
    console.error("send-otp error:", err);
    return res.status(500).json({ success: false, error: "We couldn't send a code right now. Please try again." });
  }
}
