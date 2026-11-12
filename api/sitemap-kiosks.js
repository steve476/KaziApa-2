// api/sitemap-kiosks.js
// Sitemap of kiosks that are good enough to index (real content, not banned). Built live from the database.
const SUPABASE_URL = "https://dalaawxoiecrmfwxwrdn.supabase.co";
const ANON_KEY = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhbGFhd3hvaWVjcm1md3h3cmRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MTg1NjksImV4cCI6MjA5NzA5NDU2OX0.vl3NdmbF4suNoSeDXLwksYIhx8V-TddrKT0ZShHZwws";

export default async function handler(req, res) {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/kiosk_public_list`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
      body: JSON.stringify({ p_limit: 5000 }),
    });
    if (!r.ok) throw new Error("list failed " + r.status);
    const rows = await r.json();
    const urls = (Array.isArray(rows) ? rows : [])
      .filter(k => /^[a-z0-9-]{1,60}$/.test(String(k.slug || "")))
      .map(k => {
        const d = k.lastmod ? new Date(k.lastmod) : null;
        const lm = d && !isNaN(d) ? `<lastmod>${d.toISOString().slice(0, 10)}</lastmod>` : "";
        return `  <url><loc>https://kaziapa.co.ke/kiosk/${k.slug}</loc>${lm}</url>`;
      }).join("\n");
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.end(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  } catch (e) {
    console.error("sitemap-kiosks error:", e && e.message);
    res.statusCode = 503;
    res.setHeader("Cache-Control", "no-store");
    res.end("Temporarily unavailable");
  }
}
