export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: "Phone required" });

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Format phone
  let fp = phone.trim();
  if (fp.startsWith("0")) fp = "+254" + fp.slice(1);
  else if (!fp.startsWith("+")) fp = "+254" + fp;

  const message = `Your KaziApa code is: ${otp}. Valid for 10 minutes.`;

  try {
    // Save OTP to Supabase first
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
      return res.status(500).json({ error: "Failed to save OTP", details: err });
    }

    // Send SMS via Africa's Talking sandbox
    const params = new URLSearchParams();
    params.append("username", "sandbox");
    params.append("to", fp);
    params.append("message", message);

    const smsRes = await fetch("https://api.sandbox.africastalking.com/version1/messaging", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "apiKey": "atsk_91b66cc3d2b04b91716c77f7148fe7f28622bb47b575eab5d1e8010fe6202ca30473c366",
      },
      body: params,
    });

    const smsData = await smsRes.json();
    console.log("AT Response:", JSON.stringify(smsData));

    return res.status(200).json({ success: true, message: "OTP sent" });

  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: err.message });
  }
}
