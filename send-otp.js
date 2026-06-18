export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ error: "Phone number required" });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Format phone for Kenya — convert 07XX to +2547XX
  let formattedPhone = phone.trim();
  if (formattedPhone.startsWith("0")) {
    formattedPhone = "+254" + formattedPhone.slice(1);
  } else if (!formattedPhone.startsWith("+")) {
    formattedPhone = "+254" + formattedPhone;
  }

  const message = `Your KaziApa verification code is: ${otp}. Valid for 10 minutes. Do not share this code.`;

  try {
    // Send SMS via Africa's Talking
    const params = new URLSearchParams();
    params.append("username", "sandbox");
    params.append("to", formattedPhone);
    params.append("message", message);
    params.append("from", "");

    const response = await fetch("https://api.sandbox.africastalking.com/version1/messaging", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "apiKey": "atsk_91b66cc3d2b04b91716c77f7148fe7f28622bb47b575eab5d1e8010fe6202ca30473c366",
      },
      body: params,
    });

    const data = await response.json();

    if (data.SMSMessageData?.Recipients?.[0]?.status === "Success" ||
        data.SMSMessageData?.Message?.includes("Sent")) {
      // Store OTP in Supabase for verification
      const supabaseRes = await fetch(
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
            phone: formattedPhone,
            otp,
            expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
          }),
        }
      );
      return res.status(200).json({ success: true, message: "OTP sent successfully" });
    } else {
      console.error("AT Error:", data);
      return res.status(500).json({ error: "Failed to send SMS", details: data });
    }
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}
