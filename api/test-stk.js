// api/test-stk.js
// TEMPORARY test helper — visit this URL directly in your browser to trigger
// a sandbox STK Push and see the raw response. Delete this file once M-Pesa
// is confirmed working; it's not meant to stay in production.

const BASE_URL = "https://sandbox.safaricom.co.ke";

async function getAccessToken() {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  const res = await fetch(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    method: "GET",
    headers: { Authorization: `Basic ${auth}` },
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Token request failed (${res.status}): ${text}`);
  }
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
  const debug = {};
  const testPhone = req.query.phone; // pass your own number: /api/test-stk?phone=2547XXXXXXXX

  if (!testPhone) {
    return res.status(400).json({
      error: "Add your phone number to the URL, e.g. /api/test-stk?phone=254712345678",
    });
  }

  try {
    debug.step = "checking env vars";
    debug.hasConsumerKey = !!process.env.MPESA_CONSUMER_KEY;
    debug.hasConsumerSecret = !!process.env.MPESA_CONSUMER_SECRET;
    debug.hasShortcode = !!process.env.MPESA_SHORTCODE;
    debug.hasPasskey = !!process.env.MPESA_PASSKEY;
    debug.hasCallbackUrl = !!process.env.MPESA_CALLBACK_URL;
    debug.callbackUrlValue = process.env.MPESA_CALLBACK_URL;

    debug.step = "getting access token";
    const accessToken = await getAccessToken();
    debug.gotAccessToken = true;

    const shortcode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
    const callbackUrl = process.env.MPESA_CALLBACK_URL;
    const timestamp = getTimestamp();
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

    debug.step = "sending STK push";
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
        Amount: 1,
        PartyA: testPhone,
        PartyB: shortcode,
        PhoneNumber: testPhone,
        CallBackURL: callbackUrl,
        AccountReference: "LIVE-TEST-001",
        TransactionDesc: "Live STK Push test - Ksh 1",
      }),
    });

    const stkText = await stkRes.text();
    debug.step = "done";
    debug.stkStatus = stkRes.status;
    debug.stkResponse = JSON.parse(stkText);

    return res.status(200).json(debug);
  } catch (err) {
    debug.error = err.message;
    return res.status(200).json(debug);
  }
}
