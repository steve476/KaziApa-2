// api/notify-message.js
// Replaces notify-whatsapp.js as the "someone messaged you on KaziApa"
// notifier. Tries Web Push first (free, works for anyone who installed the
// app and granted notification permission). If that user has no saved
// subscription, or every saved subscription fails to deliver, falls back
// to a plain SMS via Africa's Talking pointing them back to the app.
//
// Deliberately does NOT include a wa.me link or expose any phone number —
// the app already blocks sharing numbers inside chat, and a WhatsApp deep
// link would just hand out exactly what that rule exists to prevent.

import webpush from "web-push";

const SUPABASE_URL = "https://dalaawxoiecrmfwxwrdn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhbGFhd3hvaWVjcm1md3h3cmRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MTg1NjksImV4cCI6MjA5NzA5NDU2OX0.vl3NdmbF4suNoSeDXLwksYIhx8V-TddrKT0ZShHZwws";

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || "mailto:hello@kaziapa.co.ke",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

async function supabaseFetch(path, opts = {}) {
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Prefer": "return=representation",
      ...(opts.headers || {}),
    },
  });
}

async function sendSms(fp, text) {
  const params = new URLSearchParams();
  params.append("username", "Kaziapa");
  params.append("to", fp);
  params.append("message", text);
  params.append("from", "KaziApa");

  const smsRes = await fetch("https://api.africastalking.com/version1/messaging", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      "apiKey": "atsk_eb6d986f3797752b0e034785b5ec3d99e18d377304f6c7a5565ae4c303c88b6481b42860",
    },
    body: params,
  });
  const smsData = await smsRes.json();
  const recipient = smsData?.SMSMessageData?.Recipients?.[0];
  return recipient?.status === "Success";
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Either pass { senderName, message? } for a normal chat-style notification
  // ("Name on KaziApa: '...'"), or pass a pre-composed { body } directly for
  // system-style notifications (rent updates, maintenance reports) that
  // don't have a person "sender" in the usual sense.
  const { phone, senderName, message, body: rawBody } = req.body;
  if (!phone || (!senderName && !rawBody)) {
    return res.status(400).json({ error: "phone and either senderName or body are required" });
  }

  let fp = phone.trim();
  if (fp.startsWith("0")) fp = "+254" + fp.slice(1);
  else if (!fp.startsWith("+")) fp = "+254" + fp;

  const body = rawBody
    ? rawBody
    : message
    ? `${senderName} on KaziApa: "${message}"`
    : `${senderName} sent you a new message on KaziApa.`;

  try {
    const subsRes = await supabaseFetch(`push_subscriptions?phone=eq.${encodeURIComponent(fp)}`);
    const subs = subsRes.ok ? await subsRes.json() : [];

    let pushDelivered = false;
    const deadEndpoints = [];

    if (subs.length > 0) {
      const payload = JSON.stringify({
        title: "KaziApa",
        body,
        url: "/",
      });

      const results = await Promise.allSettled(
        subs.map((s) =>
          webpush.sendNotification(
            { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
            payload
          )
        )
      );

      results.forEach((r, i) => {
        if (r.status === "fulfilled") {
          pushDelivered = true;
        } else if (r.reason?.statusCode === 404 || r.reason?.statusCode === 410) {
          // Subscription is gone (uninstalled, cleared data, expired) — clean it up.
          deadEndpoints.push(subs[i].endpoint);
        }
      });

      if (deadEndpoints.length > 0) {
        await supabaseFetch(`push_subscriptions?endpoint=in.(${deadEndpoints.map((e) => `"${e}"`).join(",")})`, {
          method: "DELETE",
        }).catch(() => {});
      }
    }

    if (pushDelivered) {
      return res.status(200).json({ success: true, channel: "push" });
    }

    // No subscription, or every push attempt failed — fall back to SMS.
    const smsOk = await sendSms(fp, body);
    return res.status(200).json({ success: smsOk, channel: "sms" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
