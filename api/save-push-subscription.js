// api/save-push-subscription.js
// Called once per device after the browser grants notification permission.
// Stores the push subscription (endpoint + encryption keys) against the
// user's phone number so notify-message.js can target it later.

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { phone, subscription } = req.body;
  if (!phone || !subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
    return res.status(400).json({ error: "phone and a full subscription object are required" });
  }

  let fp = phone.trim();
  if (fp.startsWith("0")) fp = "+254" + fp.slice(1);
  else if (!fp.startsWith("+")) fp = "+254" + fp;

  const SUPABASE_URL = "https://dalaawxoiecrmfwxwrdn.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhbGFhd3hvaWVjcm1md3h3cmRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MTg1NjksImV4cCI6MjA5NzA5NDU2OX0.vl3NdmbF4suNoSeDXLwksYIhx8V-TddrKT0ZShHZwws";

  try {
    // Upsert on endpoint — same device re-subscribing (e.g. after clearing
    // site data) just updates its row instead of creating a duplicate.
    const upsertRes = await fetch(
      `${SUPABASE_URL}/rest/v1/push_subscriptions?on_conflict=endpoint`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Prefer": "resolution=merge-duplicates,return=minimal",
        },
        body: JSON.stringify({
          phone: fp,
          endpoint: subscription.endpoint,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
        }),
      }
    );

    if (!upsertRes.ok) {
      const err = await upsertRes.text();
      return res.status(500).json({ success: false, error: "Failed to save subscription", details: err });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
