// api/mpesa-callback.js
// Safaricom calls THIS endpoint automatically after the customer enters their PIN
// (or cancels/times out). Set MPESA_CALLBACK_URL to this route's public URL,
// e.g. https://kaziapa.co.ke/api/mpesa-callback

const SUPABASE_URL = "https://dalaawxoiecrmfwxwrdn.supabase.co";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const callback = req.body?.Body?.stkCallback;
    if (!callback) {
      return res.status(400).json({ error: "Invalid callback payload" });
    }

    const {
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata,
    } = callback;

    let mpesaReceiptNumber = null;
    let amount = null;
    let phoneNumber = null;

    if (ResultCode === 0 && CallbackMetadata?.Item) {
      for (const item of CallbackMetadata.Item) {
        if (item.Name === "MpesaReceiptNumber") mpesaReceiptNumber = item.Value;
        if (item.Name === "Amount") amount = item.Value;
        if (item.Name === "PhoneNumber") phoneNumber = item.Value;
      }
    }

    // Update the matching order in Supabase using CheckoutRequestID
    const updatePayload =
      ResultCode === 0
        ? {
            payment_method: "mpesa",
            mpesa_receipt_number: mpesaReceiptNumber,
            paid_at: new Date().toISOString(),
          }
        : {
            payment_method: "mpesa_failed",
          };

    await fetch(
      `${SUPABASE_URL}/rest/v1/orders?checkout_request_id=eq.${CheckoutRequestID}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.SUPABASE_ANON_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify(updatePayload),
      }
    );

    // Safaricom just needs a 200 OK acknowledging receipt — it doesn't read the body.
    return res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (err) {
    // Still return 200 so Safaricom doesn't keep retrying, but log the error server-side
    console.error("M-Pesa callback error:", err);
    return res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
  }
}
