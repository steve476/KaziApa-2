// api/rent-submit-payment.js
// Tenant submits proof of a rent payment they already made DIRECTLY to their
// landlord's own Till/Paybill/Bank/Cash. KaziApa never touches this money —
// this endpoint only records the claim so the landlord can confirm it.
//
// Call with: { tenancyId, landlordPhone, tenantPhone, amount, paymentMethod,
//              mpesaCode?, bankName?, reference?, paymentDate?, screenshotUrl?, note? }
// paymentMethod: 'mpesa' | 'bank' | 'cash' | 'other'

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

  const {
    tenancyId, landlordPhone, tenantPhone, amount,
    paymentMethod = "mpesa", mpesaCode, bankName, reference, paymentDate,
    screenshotUrl, note,
  } = req.body;

  if (!tenancyId || !landlordPhone || !tenantPhone || !amount) {
    return res.status(400).json({ error: "tenancyId, landlordPhone, tenantPhone, and amount are required" });
  }
  if (!["mpesa", "bank", "cash", "other"].includes(paymentMethod)) {
    return res.status(400).json({ error: "Invalid payment method" });
  }
  if (paymentMethod === "mpesa" && !mpesaCode) {
    return res.status(400).json({ error: "M-Pesa transaction code is required" });
  }
  if (paymentMethod === "bank" && (!bankName || !reference)) {
    return res.status(400).json({ error: "Bank name and transaction reference are required" });
  }

  let cleanCode = null;
  if (paymentMethod === "mpesa") {
    cleanCode = String(mpesaCode).trim().toUpperCase();
    // Real M-Pesa codes are 10 alphanumeric characters — validate the shape,
    // not just a minimum length, to catch obvious typos/garbage early.
    if (!/^[A-Z0-9]{8,12}$/.test(cleanCode)) {
      return res.status(400).json({ error: "That doesn't look like a valid M-Pesa code" });
    }
  }

  try {
    if (cleanCode) {
      // The unique index on rt_ledger.mpesa_code is the real guard against
      // reuse — but check first here too, so we can return a clear message
      // instead of a raw DB constraint error.
      const existingRes = await supabaseFetch(`rt_ledger?mpesa_code=eq.${encodeURIComponent(cleanCode)}&select=id`);
      const existing = await existingRes.json();
      if (existing?.length) {
        return res.status(409).json({ error: "This M-Pesa code has already been submitted before" });
      }
    }

    // Compare against expected rent so obvious mismatches get flagged for
    // the landlord's attention rather than silently accepted or rejected.
    let flagged = false;
    let flagReason = null;
    const tenancyRes = await supabaseFetch(`rt_tenancies?id=eq.${tenancyId}&select=rent_amount`);
    const tenancyRows = await tenancyRes.json();
    const expectedRent = tenancyRows?.[0]?.rent_amount;
    if (expectedRent != null && Number(amount) !== Number(expectedRent)) {
      flagged = true;
      flagReason = `Amount Ksh ${amount} differs from expected rent Ksh ${expectedRent}`;
    }

    const insertRes = await supabaseFetch(`rt_ledger`, {
      method: "POST",
      body: JSON.stringify({
        tenancy_id: tenancyId,
        landlord_phone: landlordPhone,
        tenant_phone: tenantPhone,
        entry_type: "payment_submission",
        amount,
        payment_method: paymentMethod,
        mpesa_code: cleanCode,
        bank_name: paymentMethod === "bank" ? bankName : null,
        reference: paymentMethod !== "mpesa" ? (reference || null) : null,
        payment_date: paymentDate || null,
        screenshot_url: screenshotUrl || null,
        note: note || null,
        status: "pending",
        flagged,
        flag_reason: flagReason,
        recorded_by: tenantPhone,
      }),
    });

    if (!insertRes.ok) {
      const err = await insertRes.text();
      console.error("RT_LEDGER INSERT FAILED:", insertRes.status, err);
      if (err.includes("rt_ledger_mpesa_code_unique")) {
        return res.status(409).json({ error: "This M-Pesa code has already been submitted before" });
      }
      return res.status(500).json({ error: "Failed to record payment submission", details: err });
    }

    const [entry] = await insertRes.json();

    // Best-effort audit trail entry — never blocks the actual submission.
    try {
      await supabaseFetch(`rt_audit_log`, {
        method: "POST",
        body: JSON.stringify({
          landlord_phone: landlordPhone,
          actor_phone: tenantPhone,
          action_type: "payment_submission",
          description: `Tenant submitted a payment of Ksh ${amount} (${paymentMethod})`,
          tenancy_id: tenancyId,
        }),
      });
    } catch (auditErr) {
      console.error("Audit log failed (non-fatal):", auditErr.message);
    }

    // Notify the landlord a payment is awaiting confirmation — reuses the
    // same WhatsApp template used for chat messages, just repurposed text.
    try {
      const flagNote = flagged ? " ⚠️ needs review" : "";
      await fetch(`https://${req.headers.host}/api/notify-whatsapp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: landlordPhone, senderName: `Rent payment submitted (Ksh ${amount})${flagNote} — open KaziApa to confirm` }),
      });
    } catch (notifyErr) {
      console.error("Notify landlord failed (non-fatal):", notifyErr.message);
    }

    return res.status(200).json({ success: true, entry });
  } catch (err) {
    console.error("RENT-SUBMIT-PAYMENT CRASHED:", err.message, err.stack);
    return res.status(500).json({ success: false, error: err.message });
  }
}
