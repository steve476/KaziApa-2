export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { phone, otp } = req.body;
  if (!phone || !otp) return res.status(400).json({ error: "Phone and OTP required" });

  // Format phone
  let fp = phone.trim();
  if (fp.startsWith("0")) fp = "+254" + fp.slice(1);
  else if (!fp.startsWith("+")) fp = "+254" + fp;

  try {
    // Get latest OTP for this phone
    const response = await fetch(
      `https://dalaawxoiecrmfwxwrdn.supabase.co/rest/v1/otp_codes?phone=eq.${encodeURIComponent(fp)}&order=created_at.desc&limit=1`,
      {
        headers: {
          "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhbGFhd3hvaWVjcm1md3h3cmRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MTg1NjksImV4cCI6MjA5NzA5NDU2OX0.vl3NdmbF4suNoSeDXLwksYIhx8V-TddrKT0ZShHZwws",
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhbGFhd3hvaWVjcm1md3h3cmRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MTg1NjksImV4cCI6MjA5NzA5NDU2OX0.vl3NdmbF4suNoSeDXLwksYIhx8V-TddrKT0ZShHZwws",
        },
      }
    );

    const data = await response.json();
    console.log("OTP lookup:", JSON.stringify(data));

    if (!data || data.length === 0) {
      return res.status(400).json({ success: false, error: "No OTP found. Request a new code." });
    }

    const record = data[0];

    // Check if OTP matches
    if (record.otp !== otp) {
      return res.status(400).json({ success: false, error: "Wrong code. Try again." });
    }

    // Check expiry
    if (new Date() > new Date(record.expires_at)) {
      return res.status(400).json({ success: false, error: "Code expired. Request a new one." });
    }

    // Delete used OTP
    await fetch(
      `https://dalaawxoiecrmfwxwrdn.supabase.co/rest/v1/otp_codes?phone=eq.${encodeURIComponent(fp)}`,
      {
        method: "DELETE",
        headers: {
          "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhbGFhd3hvaWVjcm1md3h3cmRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MTg1NjksImV4cCI6MjA5NzA5NDU2OX0.vl3NdmbF4suNoSeDXLwksYIhx8V-TddrKT0ZShHZwws",
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhbGFhd3hvaWVjcm1md3h3cmRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MTg1NjksImV4cCI6MjA5NzA5NDU2OX0.vl3NdmbF4suNoSeDXLwksYIhx8V-TddrKT0ZShHZwws",
        },
      }
    );

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("Verify error:", err);
    return res.status(500).json({ error: err.message });
  }
}
