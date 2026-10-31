// api/mpesa-callback.js
// Safaricom calls this after the customer enters their PIN (or cancels/times out).
// Looks up the matching purchase record by CheckoutRequestID and, on success,
// activates whichever feature was bought.

const SUPABASE_URL = "https://dalaawxoiecrmfwxwrdn.supabase.co";

const enc = (v) => encodeURIComponent(String(v ?? ""));

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

  // 1) Only accept calls that carry our secret. The secret is part of the callback URL we give
  //    Safaricom (MPESA_CALLBACK_URL = .../api/mpesa-callback?key=<MPESA_CALLBACK_SECRET>).
  //    If MPESA_CALLBACK_SECRET is not set yet, the check is skipped so deploying this file first is safe.
  const expectedKey = process.env.MPESA_CALLBACK_SECRET;
  if (expectedKey) {
    const given = Array.isArray(req.query?.key) ? req.query.key[0] : req.query?.key;
    if (given !== expectedKey) {
      console.error("mpesa-callback: rejected a call with a missing or wrong key");
      return res.status(403).json({ error: "Forbidden" });
    }
  }

  try {
    const callback = req.body?.Body?.stkCallback;
    if (!callback) return res.status(400).json({ error: "Invalid callback payload" });

    const { CheckoutRequestID, ResultCode, CallbackMetadata } = callback;
    if (!CheckoutRequestID || !/^[A-Za-z0-9_\-]+$/.test(String(CheckoutRequestID))) {
      return res.status(400).json({ error: "Invalid callback payload" });
    }

    let mpesaReceiptNumber = null;
    let paidAmount = null;
    if (ResultCode === 0 && CallbackMetadata?.Item) {
      for (const item of CallbackMetadata.Item) {
        if (item.Name === "MpesaReceiptNumber") mpesaReceiptNumber = item.Value;
        if (item.Name === "Amount") paidAmount = Number(item.Value);
      }
    }

    // 2) Only purchases that are still "pending" can change. A repeated or replayed callback
    //    therefore cannot activate the same purchase twice.
    if (ResultCode !== 0) {
      await supabaseFetch(`purchases?checkout_request_id=eq.${enc(CheckoutRequestID)}&status=eq.pending`, {
        method: "PATCH",
        body: JSON.stringify({ status: "failed" }),
      });
      return res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    const findRes = await supabaseFetch(
      `purchases?checkout_request_id=eq.${enc(CheckoutRequestID)}&select=*`
    );
    const found = await findRes.json();
    const existing = Array.isArray(found) ? found[0] : null;

    if (!existing) {
      console.error("No matching purchase found for", CheckoutRequestID);
      return res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
    }
    if (existing.status !== "pending") {
      console.log("mpesa-callback: purchase already processed, ignoring repeat", CheckoutRequestID, existing.status);
      return res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    // 3) The amount M-Pesa reports must match the price we recorded for this purchase.
    if (paidAmount !== null && Number(existing.amount) > 0 && paidAmount !== Number(existing.amount)) {
      console.error(`mpesa-callback: AMOUNT MISMATCH for ${CheckoutRequestID}: paid ${paidAmount}, expected ${existing.amount}`);
      await supabaseFetch(`purchases?checkout_request_id=eq.${enc(CheckoutRequestID)}&status=eq.pending`, {
        method: "PATCH",
        body: JSON.stringify({ status: "amount_mismatch", mpesa_receipt_number: mpesaReceiptNumber }),
      });
      return res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    // 4) Claim the purchase: only one call can move it from "pending" to "paid".
    const claimRes = await supabaseFetch(`purchases?checkout_request_id=eq.${enc(CheckoutRequestID)}&status=eq.pending`, {
      method: "PATCH",
      body: JSON.stringify({ status: "paid", mpesa_receipt_number: mpesaReceiptNumber }),
    });
    const claimed = claimRes.ok ? await claimRes.json().catch(() => []) : [];
    const purchase = Array.isArray(claimed) ? claimed[0] : null;
    if (!purchase) {
      console.log("mpesa-callback: purchase was claimed by another call, ignoring", CheckoutRequestID);
      return res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    // Every activation call below is checked for success now — previously these
    // PATCH/POST calls were fired without checking res.ok, so a silent failure
    // (bad listing_id, RLS block, missing column, etc.) meant M-Pesa charged the
    // customer but the feature never activated, with zero trace in the logs.
    async function logIfFailed(res, label) {
      if (!res.ok) {
        const body = await res.text().catch(() => "(no body)");
        console.error(`ACTIVATION FAILED [${label}] for purchase ${purchase.id} (type=${purchase.type}, checkout=${CheckoutRequestID}):`, res.status, body);
      }
      return res.ok;
    }

    switch (purchase.type) {
      case "boost": {
        const boostRes = await supabaseFetch(`listings?id=eq.${enc(purchase.listing_id)}`, {
          method: "PATCH",
          body: JSON.stringify({
            featured: true,
            featured_expires_at: purchase.expires_at,
          }),
        });
        await logIfFailed(boostRes, "boost");
        break;
      }

      case "verified_badge": {
        const vbRes = await supabaseFetch(`users?phone=eq.${enc(purchase.user_id)}`, {
          method: "PATCH",
          body: JSON.stringify({
            is_verified: true,
            verified_expires_at: purchase.expires_at,
          }),
        });
        await logIfFailed(vbRes, "verified_badge");
        break;
      }

      case "subscription": {
        const subRes = await supabaseFetch(`users?phone=eq.${enc(purchase.user_id)}`, {
          method: "PATCH",
          body: JSON.stringify({
            subscription_tier: purchase.tier,
            subscription_expires_at: purchase.expires_at,
          }),
        });
        await logIfFailed(subRes, "subscription");
        break;
      }

      case "chat_pass": {
        // daily, week, or month — all grant unlimited chat until the purchase's expiry
        const update = {
          chat_unlimited_until: purchase.expires_at,
          chat_plan_tier: purchase.tier,
        };
        if (purchase.tier === "week") {
          // Weekly Plan includes 1 free boost — add to whatever balance they already have.
          const userRes = await supabaseFetch(`users?phone=eq.${enc(purchase.user_id)}&select=free_boosts_remaining`);
          if (await logIfFailed(userRes, "chat_pass:lookup")) {
            const userData = await userRes.json();
            const currentBoosts = userData?.[0]?.free_boosts_remaining || 0;
            update.free_boosts_remaining = currentBoosts + 1;
          }
        }
        const cpRes = await supabaseFetch(`users?phone=eq.${enc(purchase.user_id)}`, {
          method: "PATCH",
          body: JSON.stringify(update),
        });
        await logIfFailed(cpRes, "chat_pass");
        break;
      }

      case "contact_unlock": {
        // Insert into listing_unlocks so the Housing screen's unlock-check
        // (which queries this table directly, not `purchases`) picks it up.
        const cuRes = await supabaseFetch(`listing_unlocks`, {
          method: "POST",
          body: JSON.stringify({
            property_id: purchase.listing_id,
            tenant_phone: purchase.user_id,
          }),
        });
        await logIfFailed(cuRes, "contact_unlock");
        break;
      }

      case "nitume_unlock": {
        // Look up the request first — if the payer IS the customer (paying
        // upfront to guarantee a targeted Nudge), assign the pre-agreed
        // target provider instead of the payer themselves.
        const reqRes = await supabaseFetch(
          `nitume_requests?id=eq.${enc(purchase.listing_id)}&select=customer_phone,target_provider_phone,target_provider_name`
        );
        if (!(await logIfFailed(reqRes, "nitume_unlock:lookup"))) break;
        const reqRows = await reqRes.json();
        const reqRow = reqRows?.[0];

        const customerPrePaid = reqRow && reqRow.customer_phone === purchase.user_id;

        const nuRes = await supabaseFetch(`nitume_requests?id=eq.${enc(purchase.listing_id)}`, {
          method: "PATCH",
          body: JSON.stringify(
            customerPrePaid
              ? {
                  status: "accepted",
                  provider_phone: reqRow.target_provider_phone,
                  provider_name: reqRow.target_provider_name,
                  accepted_at: new Date().toISOString(),
                  unlock_paid_by: "customer",
                }
              : {
                  status: "accepted",
                  provider_phone: purchase.user_id,
                  accepted_at: new Date().toISOString(),
                  unlock_paid_by: "provider",
                }
          ),
        });
        await logIfFailed(nuRes, "nitume_unlock");
        break;
      }

      case "rent_pro": {
        const rpRes = await supabaseFetch(`users?phone=eq.${enc(purchase.user_id)}`, {
          method: "PATCH",
          body: JSON.stringify({
            rent_pro_until: purchase.expires_at,
          }),
        });
        await logIfFailed(rpRes, "rent_pro");
        break;
      }

      default:
        console.error("Unknown purchase type:", purchase.type);
    }

    return res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (err) {
    console.error("M-Pesa callback error:", err);
    return res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
  }
}
