// api/mpesa-stk-push.js
// Initiates an M-Pesa STK Push (payment prompt on the customer's phone).
// Call this with { phone, amount, accountReference, transactionDesc }
// once you've decided what triggers a payment (order, boost, subscription, etc.)

// PRODUCTION base URL — live transactions, real money moves
const BASE_URL = "https://api.safaricom.co.ke";

async function getAccessToken() {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  const res = await fetch(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    method: "GET",
    headers: { Authorization: `Basic ${auth}` },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to get access token: ${err}`);
  }

  const data = await res.json();
  return data.access_token;
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

  const { phone, amount, accountReference, transactionDesc } = req.body;

  if (!phone || !amount || !accountReference) {
    return res.status(400).json({ error: "phone, amount, and accountReference are required" });
  }

  // Normalize phone to 2547XXXXXXXX format (no + for Daraja)
  let fp = phone.trim();
  if (fp.startsWith("+")) fp = fp.slice(1);
  else if (fp.startsWith("0")) fp = "254" + fp.slice(1);
  else if (!fp.startsWith("254")) fp = "254" + fp;

  const shortcode = process.env.MPESA_SHORTCODE; // 174379 for sandbox
  const passkey = process.env.MPESA_PASSKEY;
  const callbackUrl = process.env.MPESA_CALLBACK_URL; // must be a public HTTPS URL

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
        Amount: Math.round(amount),
        PartyA: fp,
        PartyB: shortcode,
        PhoneNumber: fp,
        CallBackURL: callbackUrl,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc || "KaziApa payment",
      }),
    });

    const stkData = await stkRes.json();

    if (stkData.ResponseCode === "0") {
      // Prompt sent successfully — customer will see it on their phone.
      // CheckoutRequestID is what ties this to the callback later.
      return res.status(200).json({
        success: true,
        checkoutRequestId: stkData.CheckoutRequestID,
        merchantRequestId: stkData.MerchantRequestID,
        customerMessage: stkData.CustomerMessage,
      });
    } else {
      return res.status(400).json({ success: false, error: stkData });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
