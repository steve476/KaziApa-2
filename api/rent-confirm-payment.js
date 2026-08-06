// api/rent-confirm-payment.js
// Landlord confirms or disputes a tenant's payment submission. Confirming
// does NOT move any money — it just marks the ledger entry, since KaziApa
// never holds or processes rent. This is purely record-keeping.
//
// Call with: { ledgerId, action, disputeReason?, respondedBy }
// action: 'confirm' | 'dispute'

const SUPABASE_URL = "https://dalaawxoiecrmfwxwrdn.supabase.co";

async function supabaseFetch(path, options = {}) {
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      apikey: process.env.SUPABASE_ANON_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
      Prefer: "return=representation",
      ...options.headers,
    },
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { ledgerId, action, disputeReason, respondedBy } = req.body;

  if (!ledgerId || !action || !respondedBy) {
    return res.status(400).json({ error: "ledgerId, action, and respondedBy are required" });
  }
  if (action !== "confirm" && action !== "dispute") {
    return res.status(400).json({ error: "action must be 'confirm' or 'dispute'" });
  }
  if (action === "dispute" && !disputeReason) {
    return res.status(400).json({ error: "disputeReason is required when disputing a payment" });
  }

  try {
    const findRes = await supabaseFetch(`rt_ledger?id=eq.${ledgerId}&select=*`);
    const rows = await findRes.json();
    const entry = rows?.[0];
    if (!entry) return res.status(404).json({ error: "Payment submission not found" });
    if (entry.status !== "pending") {
      return res.status(409).json({ error: `This payment was already ${entry.status}` });
    }

    const updateRes = await supabaseFetch(`rt_ledger?id=eq.${ledgerId}`, {
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

    // Notify the tenant of the outcome either way — silence is exactly what
    // this whole design is trying to avoid.
    try {
      const msg = action === "confirm"
        ? `Your rent payment of Ksh ${entry.amount} has been confirmed`
        : `Your rent payment of Ksh ${entry.amount} was disputed: ${disputeReason}. Open KaziApa for details`;
      await fetch(`https://${req.headers.host}/api/notify-whatsapp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: entry.tenant_phone, senderName: msg }),
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
