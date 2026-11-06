// api/rent-confirm-payment.js
// Landlord confirms or disputes a tenant's payment submission. Confirming
// does NOT move any money — it just marks the ledger entry, since KaziApa
// never holds or processes rent. This is purely record-keeping.
//
// Call with: { token, ledgerId, action, disputeReason? }
// action: 'confirm' | 'dispute'

import { checkLoginToken } from "./_login-token.js";

// Requires the login token (body.token). Only the landlord of the payment, or an active team member of
// that landlord, may confirm or dispute. "respondedBy" is taken from the token, not from the app.
const SUPABASE_URL = "https://dalaawxoiecrmfwxwrdn.supabase.co";
const d9 = (p) => String(p || "").replace(/\D/g, "").slice(-9);

async function supabaseFetch(path, options = {}) {
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      apikey: DB_KEY,
      ...DB_AUTH,
      Prefer: "return=representation",
      ...options.headers,
    },
  });
}

// Server-side files use the secret key (SUPABASE_SERVICE_ROLE_KEY); the public key is only a fallback so nothing breaks if it is missing.
const DB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const DB_AUTH = String(DB_KEY || "").startsWith("sb_") ? {} : { Authorization: `Bearer ${DB_KEY}` };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const body = req.body || {};
  const claims = checkLoginToken(body.token);
  if (!claims) return res.status(401).json({ success: false, error: "Please log in again to continue." });

  const { ledgerId, action, disputeReason } = body;
  const respondedBy = claims.phone;

  if (!ledgerId || !action) {
    return res.status(400).json({ error: "ledgerId and action are required" });
  }
  if (action !== "confirm" && action !== "dispute") {
    return res.status(400).json({ error: "action must be 'confirm' or 'dispute'" });
  }
  if (action === "dispute" && !disputeReason) {
    return res.status(400).json({ error: "disputeReason is required when disputing a payment" });
  }

  try {
    const findRes = await supabaseFetch(`rt_ledger?id=eq.${encodeURIComponent(ledgerId)}&select=*`);
    const rows = await findRes.json();
    const entry = rows?.[0];
    if (!entry) return res.status(404).json({ error: "Payment submission not found" });

    // Who may respond: the landlord, or an active team member of that landlord
    const me = d9(claims.phone);
    let allowed = me.length === 9 && d9(entry.landlord_phone) === me;
    if (!allowed && me.length === 9) {
      const teamRes = await supabaseFetch(`rt_team_members?status=eq.active&member_phone=like.*${me}&select=owner_phone,member_phone`);
      const team = await teamRes.json();
      allowed = Array.isArray(team) && team.some(m => d9(m.member_phone) === me && d9(m.owner_phone) === d9(entry.landlord_phone));
    }
    if (!allowed) return res.status(403).json({ error: "You cannot respond to this payment" });
    if (entry.status !== "pending") {
      return res.status(409).json({ error: `This payment was already ${entry.status}` });
    }

    const updateRes = await supabaseFetch(`rt_ledger?id=eq.${encodeURIComponent(ledgerId)}&status=eq.pending`, {
      method: "PATCH",
      body: JSON.stringify({
        status: action === "confirm" ? "confirmed" : "disputed",
        dispute_reason: action === "dispute" ? disputeReason : null,
        responded_at: new Date().toISOString(),
        responded_by: respondedBy,
      }),
    });

    if (!updateRes.ok) {
      const err = await updateRes.text();
      console.error("RT_LEDGER UPDATE FAILED:", updateRes.status, err);
      return res.status(500).json({ error: "Failed to update payment status", details: err });
    }

    const [updated] = await updateRes.json();
    if (!updated) return res.status(409).json({ error: "This payment was already answered" });

    // Notify the tenant of the outcome either way — silence is exactly what
    // this whole design is trying to avoid.
    try {
      const msg = action === "confirm"
        ? `Your rent payment of Ksh ${entry.amount} has been confirmed`
        : `Your rent payment of Ksh ${entry.amount} was disputed: ${disputeReason}. Open KaziApa for details`;
      await fetch(`${process.env.APP_URL || "https://kaziapa.co.ke"}/api/notify-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: entry.tenant_phone, body: msg }),
      });
    } catch (notifyErr) {
      console.error("Notify tenant failed (non-fatal):", notifyErr.message);
    }

    return res.status(200).json({ success: true, entry: updated });
  } catch (err) {
    console.error("RENT-CONFIRM-PAYMENT CRASHED:", err.message, err.stack);
    return res.status(500).json({ success: false, error: err.message });
  }
}
