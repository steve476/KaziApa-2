export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { phone, otp } = req.body;
  if (!phone || !otp) {
    return res.status(400).json({ error: "Phone and OTP required" });
  }

  let formattedPhone = phone.trim();
  if (formattedPhone.startsWith("0")) {
    formattedPhone = "+254" + formattedPhone.slice(1);
  } else if (!formattedPhone.startsWith("+")) {
    formattedPhone = "+254" + formattedPhone;
  }

  try {
    // Check OTP in Supabase
    const response = await fetch(
      `https://dalaawxoiecrmfwxwrdn.supabase.co/rest/v1/otp_codes?phone=eq.${encodeURIComponent(formattedPhone)}&otp=eq.${otp}&order=created_at.desc&limit=1`,
      {
        headers: {
          "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhbGFhd3hvaWVjcm1md3h3cmRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MTg1NjksImV4cCI6MjA5NzA5NDU2OX0.vl3NdmbF4suNoSeDXLwksYIhx8V-TddrKT0ZShHZwws",
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhbGFhd3hvaWVjcm1md3h3cmRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MTg1NjksImV4cCI6MjA5NzA5NDU2OX0.vl3NdmbF4suNoSeDXLwksYIhx8V-TddrKT0ZShHZwws",
        },
      }
    );

    const data = await response.json();

    if (!data || data.length === 0) {
      return res.status(400).json({ success: false, error: "Invalid or expired OTP" });
    }

    const record = data[0];
    const now = new Date();
    const expiresAt = new Date(record.expires_at);

    if (now > expiresAt) {
      return res.status(400).json({ success: false, error: "OTP has expired. Request a new one." });
    }

    // Delete used OTP
    await fetch(
      `https://dalaawxoiecrmfwxwrdn.supabase.co/rest/v1/otp_codes?phone=eq.${encodeURIComponent(formattedPhone)}`,
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
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}
