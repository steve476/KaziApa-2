// api/rent-submit-payment.js
// Tenant submits proof of a rent payment they already made DIRECTLY to their
// landlord's own Till/Paybill/Bank. KaziApa never touches this money — this
// endpoint only records the claim so the landlord can confirm it.
//
// Call with: { tenancyId, landlordPhone, tenantPhone, amount, mpesaCode, screenshotUrl, note }

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

  const { tenancyId, landlordPhone, tenantPhone, amount, mpesaCode, screenshotUrl, note } = req.body;

  if (!tenancyId || !landlordPhone || !tenantPhone || !amount || !mpesaCode) {
    return res.status(400).json({ error: "tenancyId, landlordPhone, tenantPhone, amount, and mpesaCode are required" });
  }

  const cleanCode = String(mpesaCode).trim().toUpperCase();
  if (cleanCode.length < 6) {
    return res.status(400).json({ error: "That doesn't look like a valid M-Pesa code" });
  }

  try {
    // The unique index on rt_ledger.mpesa_code is the real guard against
    // reuse — but check first here too, so we can return a clear message
    // instead of a raw DB constraint error.
    const existingRes = await supabaseFetch(`rt_ledger?mpesa_code=eq.${encodeURIComponent(cleanCode)}&select=id`);
    const existing = await existingRes.json();
    if (existing?.length) {
      return res.status(409).json({ error: "This M-Pesa code has already been submitted before" });
    }

    const insertRes = await supabaseFetch(`rt_ledger`, {
      method: "POST",
      body: JSON.stringify({
        tenancy_id: tenancyId,
        landlord_phone: landlordPhone,
        tenant_phone: tenantPhone,
        entry_type: "payment_submission",
        amount,
        mpesa_code: cleanCode,
        screenshot_url: screenshotUrl || null,
        note: note || null,
        status: "pending",
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

    // Notify the landlord a payment is awaiting confirmation — reuses the
    // same WhatsApp template used for chat messages, just repurposed text.
    try {
      await fetch(`https://${req.headers.host}/api/notify-whatsapp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: landlordPhone, senderName: `Rent payment submitted (Ksh ${amount}) — open KaziApa to confirm` }),
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
