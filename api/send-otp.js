export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: "Phone required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  let fp = phone.trim();
  if (fp.startsWith("0")) fp = "+254" + fp.slice(1);
  else if (!fp.startsWith("+")) fp = "+254" + fp;

  const message = `Your KaziApa verification code is: ${otp}. Valid for 10 minutes.`;

  try {
    const saveRes = await fetch(
      "https://dalaawxoiecrmfwxwrdn.supabase.co/rest/v1/otp_codes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhbGFhd3hvaWVjcm1md3h3cmRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MTg1NjksImV4cCI6MjA5NzA5NDU2OX0.vl3NdmbF4suNoSeDXLwksYIhx8V-TddrKT0ZShHZwws",
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhbGFhd3hvaWVjcm1md3h3cmRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MTg1NjksImV4cCI6MjA5NzA5NDU2OX0.vl3NdmbF4suNoSeDXLwksYIhx8V-TddrKT0ZShHZwws",
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({
          phone: fp,
          otp,
          expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        }),
      }
    );

    if (!saveRes.ok) {
      const err = await saveRes.text();
      return res.status(500).json({ success:false, error: "Failed to save OTP", details: err });
    }

    const params = new URLSearchParams();
    params.append("username", "Kaziapa");
    params.append("to", fp);
    params.append("message", message);

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

    if (recipient && recipient.status === "Success") {
      // Real SMS delivered successfully
      return res.status(200).json({ success: true, smsDelivered: true });
    } else {
      // SMS gateway issue — fallback: return OTP directly so user isn't blocked
      return res.status(200).json({
        success: true,
        smsDelivered: false,
        fallbackOtp: otp,
        note: "SMS service temporarily unavailable",
      });
    }

  } catch (err) {
    return res.status(500).json({ success:false, error: err.message });
  }
}
