// api/notify-whatsapp.js
// Sends a WhatsApp notification when someone gets a new chat message.
// Call this with { phone, senderName } whenever a new chat message is inserted.
//
// Requires an approved message template called "new_chat_message" with one
// named body parameter {{sender_name}}, e.g.: "You have a new message on
// KaziApa from {{sender_name}}. Open the app to reply."

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { phone, senderName } = req.body;
  if (!phone || !senderName) {
    return res.status(400).json({ error: "phone and senderName are required" });
  }

  // Normalize to international format without '+' (Meta expects e.g. 2547XXXXXXXX)
  let fp = phone.trim().replace(/\D/g, "");
  if (fp.startsWith("0")) fp = "254" + fp.slice(1);
  else if (!fp.startsWith("254")) fp = "254" + fp;

  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  try {
    const waRes = await fetch(
      `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: fp,
          type: "template",
          template: {
            name: "new_chat_message",
            language: { code: "en" },
            components: [
              {
                type: "body",
                parameters: [{ type: "text", parameter_name: "sender_name", text: senderName }],
              },
            ],
          },
        }),
      }
    );

    const waData = await waRes.json();

    if (waRes.ok) {
      return res.status(200).json({ success: true, messageId: waData.messages?.[0]?.id });
    } else {
      // Common failure while template is pending approval, or number not in
      // allowed test list yet (before you go through Business Verification).
      return res.status(200).json({ success: false, whatsappError: waData });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
