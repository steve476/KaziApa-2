// api/mpesa-callback.js
// Safaricom calls this after the customer enters their PIN (or cancels/times out).
// Looks up the matching purchase record by CheckoutRequestID and, on success,
// activates whichever feature was bought.

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

  try {
    const callback = req.body?.Body?.stkCallback;
    if (!callback) return res.status(400).json({ error: "Invalid callback payload" });

    const { CheckoutRequestID, ResultCode, CallbackMetadata } = callback;

    let mpesaReceiptNumber = null;
    if (ResultCode === 0 && CallbackMetadata?.Item) {
      for (const item of CallbackMetadata.Item) {
        if (item.Name === "MpesaReceiptNumber") mpesaReceiptNumber = item.Value;
      }
    }

    if (ResultCode !== 0) {
      await supabaseFetch(`purchases?checkout_request_id=eq.${CheckoutRequestID}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "failed" }),
      });
      return res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    const findRes = await supabaseFetch(
      `purchases?checkout_request_id=eq.${CheckoutRequestID}&select=*`
    );
    const purchases = await findRes.json();
    const purchase = purchases?.[0];

    if (!purchase) {
      console.error("No matching purchase found for", CheckoutRequestID);
      return res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    await supabaseFetch(`purchases?checkout_request_id=eq.${CheckoutRequestID}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "paid", mpesa_receipt_number: mpesaReceiptNumber }),
    });

    switch (purchase.type) {
      case "boost":
        await supabaseFetch(`listings?id=eq.${purchase.listing_id}`, {
          method: "PATCH",
          body: JSON.stringify({
            featured: true,
            featured_expires_at: purchase.expires_at,
          }),
        });
        break;

      case "verified_badge":
        await supabaseFetch(`users?phone=eq.${purchase.user_id}`, {
          method: "PATCH",
          body: JSON.stringify({
            is_verified: true,
            verified_expires_at: purchase.expires_at,
          }),
        });
        break;

      case "subscription":
        await supabaseFetch(`users?phone=eq.${purchase.user_id}`, {
          method: "PATCH",
          body: JSON.stringify({
            subscription_tier: purchase.tier,
            subscription_expires_at: purchase.expires_at,
          }),
        });
        break;

      case "chat_pass": {
        // daily, week, or month — all grant unlimited chat until the purchase's expiry
        const update = {
          chat_unlimited_until: purchase.expires_at,
          chat_plan_tier: purchase.tier,
        };
        if (purchase.tier === "week") {
          // Weekly Plan includes 1 free boost — add to whatever balance they already have.
          const userRes = await supabaseFetch(`users?phone=eq.${purchase.user_id}&select=free_boosts_remaining`);
          const userData = await userRes.json();
          const currentBoosts = userData?.[0]?.free_boosts_remaining || 0;
          update.free_boosts_remaining = currentBoosts + 1;
        }
        await supabaseFetch(`users?phone=eq.${purchase.user_id}`, {
          method: "PATCH",
          body: JSON.stringify(update),
        });
        break;
      }

      case "contact_unlock":
        // Insert into listing_unlocks so the Housing screen's unlock-check
        // (which queries this table directly, not `purchases`) picks it up.
        await supabaseFetch(`listing_unlocks`, {
          method: "POST",
          body: JSON.stringify({
            property_id: purchase.listing_id,
            tenant_phone: purchase.user_id,
          }),
        });
        break;

      case "nitume_unlock":
        await supabaseFetch(`nitume_requests?id=eq.${purchase.listing_id}`, {
          method: "PATCH",
          body: JSON.stringify({
            status: "accepted",
            provider_phone: purchase.user_id,
            accepted_at: new Date().toISOString(),
          }),
        });
        break;

      default:
        console.error("Unknown purchase type:", purchase.type);
    }

    return res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (err) {
    console.error("M-Pesa callback error:", err);
    return res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
  }
}
