// api/initiate-purchase.js
// Single endpoint for every paid feature. Call with:
// { phone, userId, type, tier, listingId? }
// type: 'boost' | 'verified_badge' | 'subscription' | 'chat_pass'
//
// The price is looked up server-side from PRICING below — the client can
// never set its own amount. This is what makes the paywall real instead
// of just a suggestion in the UI.

const PRICING = {
  boost: {
    "24h": { amount: 30, days: 1 },
    "3d": { amount: 80, days: 3 },
    "7d": { amount: 150, days: 7 },
    "30d": { amount: 400, days: 30 },
  },
  verified_badge: {
    individual: { amount: 500, days: 365 },
    business: { amount: 1500, days: 365 },
  },
  subscription: {
    starter: { amount: 499, days: 30 },
    business: { amount: 999, days: 30 },
    premium: { amount: 1999, days: 30 },
  },
  chat_pass: {
    daily: { amount: 20, days: 1 },     // unlimited messages for 1 day (matches "Daily Pass" in app)
    topup10: { amount: 20, days: 1 },   // +10 conversation-starts, same day only
    week: { amount: 50, days: 7 },      // unlimited for 7 days
    month: { amount: 250, days: 30 },   // unlimited for 30 days
  },
  contact_unlock: {
    standard: { amount: 150, days: 36500 }, // effectively permanent per-listing unlock for this tenant
  },
};

const BASE_URL = "https://api.safaricom.co.ke";

async function getAccessToken() {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString("base64");

  const res = await fetch(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    method: "GET",
    headers: { Authorization: `Basic ${auth}` },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Token request failed: ${text}`);
  return JSON.parse(text).access_token;
}

function getTimestamp() {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  return (
    now.getFullYear().toString() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds())
  );
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { phone, userId, type, tier, listingId } = req.body;

  if (!phone || !userId || !type || !tier) {
    return res.status(400).json({ error: "phone, userId, type, and tier are required" });
  }

  const priceEntry = PRICING[type]?.[tier];
  if (!priceEntry) {
    return res.status(400).json({ error: "Unknown type or tier" });
  }
  if ((type === "boost" || type === "contact_unlock") && !listingId) {
    return res.status(400).json({ error: "listingId is required for this purchase type" });
  }

  let fp = phone.trim().replace(/\D/g, "");
  if (fp.startsWith("0")) fp = "254" + fp.slice(1);
  else if (!fp.startsWith("254")) fp = "254" + fp;

  const shortcode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;
  const callbackUrl = process.env.MPESA_CALLBACK_URL;
  const timestamp = getTimestamp();
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

  try {
    const accessToken = await getAccessToken();

    const stkRes = await fetch(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: priceEntry.amount,
        PartyA: fp,
        PartyB: shortcode,
        PhoneNumber: fp,
        CallBackURL: callbackUrl,
        AccountReference: `${type.toUpperCase()}-${tier}`,
        TransactionDesc: `KaziApa ${type} (${tier})`,
      }),
    });

    const stkData = await stkRes.json();

    if (stkData.ResponseCode !== "0") {
      return res.status(400).json({ success: false, error: stkData });
    }

    // Record the pending purchase so the callback knows what to activate later.
    const expiresAt = new Date(Date.now() + priceEntry.days * 24 * 60 * 60 * 1000).toISOString();

    const saveRes = await fetch(`${process.env.SUPABASE_URL || "https://dalaawxoiecrmfwxwrdn.supabase.co"}/rest/v1/purchases`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.SUPABASE_ANON_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        user_id: userId,
        listing_id: listingId || null,
        type,
        tier,
        amount: priceEntry.amount,
        phone: fp,
        checkout_request_id: stkData.CheckoutRequestID,
        status: "pending",
        expires_at: expiresAt,
      }),
    });

    if (!saveRes.ok) {
      const err = await saveRes.text();
      return res.status(500).json({ success: false, error: "Failed to save purchase record", details: err });
    }

    return res.status(200).json({
      success: true,
      checkoutRequestId: stkData.CheckoutRequestID,
      amount: priceEntry.amount,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
