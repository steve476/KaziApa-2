// api/kiosk-page.js
// Public, search-engine-readable pages for kiosks (one file on purpose: the free Vercel plan allows only 12 functions):
//   /kiosk/<slug>        one kiosk (title, about, track record, work, testimonials, items)
//   /kiosks              list of kiosks
//   /sitemap-kiosks.xml  sitemap of kiosks that are good enough to index
// All data comes from the database functions kiosk_public / kiosk_public_list, which return public fields only
// (never phone numbers). Text is also cleaned here and escaped before it goes into the page.

const SUPABASE_URL = "https://dalaawxoiecrmfwxwrdn.supabase.co";
// The public (anon) key is the same one every visitor's browser already uses.
const ANON_KEY = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhbGFhd3hvaWVjcm1md3h3cmRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MTg1NjksImV4cCI6MjA5NzA5NDU2OX0.vl3NdmbF4suNoSeDXLwksYIhx8V-TddrKT0ZShHZwws";
const SITE = "https://kaziapa.co.ke";
const PLAY = "https://play.google.com/store/apps/details?id=co.ke.kaziapa.app";
const TYPE_LABEL = { shop: "Shop", transport: "Transport", worker: "Worker", service: "Service" };

async function rpc(name, body) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`rpc ${name} failed: ${r.status}`);
  return r.json();
}

const esc = (v) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
// Second line of defence: remove phone numbers and emails again before anything is printed
function clean(t) {
  return String(t ?? "")
    .replace(/\+?\d(?:[\s().-]?\d){8,}/g, "[number removed]")
    .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, "[email removed]")
    .replace(/\s+/g, " ").trim();
}
const safeUrl = (u) => (typeof u === "string" && /^https:\/\/[^\s"'<>]+$/.test(u)) ? u : null;
const cut = (t, n) => { t = clean(t); return t.length > n ? t.slice(0, n - 1).trimEnd() + "…" : t; };
const when = (iso) => { try { return new Date(iso).toLocaleDateString("en-GB", { month: "short", year: "numeric" }); } catch (e) { return ""; } };

const CSS = `*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',system-ui,-apple-system,Roboto,Arial,sans-serif;color:#0A1628;background:#F4F8FF;line-height:1.6}a{color:#0066CC}.wrap{max-width:860px;margin:0 auto;padding:0 20px}header.top{background:#0066CC;color:#fff}.nav{display:flex;align-items:center;justify-content:space-between;padding:14px 0}.brand{display:flex;align-items:center;gap:10px;font-weight:900;font-size:22px;color:#fff;text-decoration:none}.logo{width:38px;height:38px;border-radius:10px;background:#F5A623;color:#0066CC;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900}.btn{display:inline-block;background:#F5A623;color:#0A1628;font-weight:800;text-decoration:none;padding:12px 20px;border-radius:14px;font-size:15px}.btn.blue{background:#0066CC;color:#fff}.crumbs{font-size:13px;padding-bottom:8px}.crumbs a{color:#fff}.cover{height:190px;background:#003F8A center/cover no-repeat}.cover img{width:100%;height:100%;object-fit:cover;display:block}.profile{display:flex;gap:14px;align-items:flex-end;margin-top:-38px;position:relative}.avatar{width:84px;height:84px;border-radius:20px;background:#fff;border:3px solid #fff;box-shadow:0 4px 14px rgba(0,0,0,.18);overflow:hidden;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:900;color:#0066CC;flex-shrink:0}.avatar img{width:100%;height:100%;object-fit:cover}h1{font-size:clamp(24px,5vw,32px);line-height:1.2;margin-top:14px}.meta{color:#415A77;font-size:14px;margin:4px 0 10px}.pill{display:inline-block;background:#E8F2FF;color:#0066CC;border-radius:20px;padding:3px 12px;font-size:12px;font-weight:700;margin-right:6px}section{padding:22px 0 4px}h2{font-size:21px;font-weight:900;margin-bottom:10px}p{margin-bottom:10px;color:#243B55}.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px}.tile{background:#fff;border:1px solid #DCE7F5;border-radius:12px;padding:12px 8px;text-align:center}.tile b{display:block;font-size:20px;color:#0066CC}.tile span{font-size:12px;color:#5B7391}.card{background:#fff;border:1px solid #DCE7F5;border-radius:14px;padding:14px;margin-bottom:10px}.card h3{font-size:16px;margin-bottom:4px}.card small{color:#5B7391}.imgs{display:flex;gap:6px;overflow-x:auto;margin-top:8px}.imgs img{width:120px;height:120px;object-fit:cover;border-radius:10px;flex-shrink:0}.items{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px}.item{background:#fff;border:1px solid #DCE7F5;border-radius:14px;overflow:hidden}.item img{width:100%;height:130px;object-fit:cover;display:block}.item div{padding:10px}.item b{display:block;font-size:14px}.stars{color:#F5A623;letter-spacing:1px}.band{background:linear-gradient(130deg,#0066CC,#003F8A);color:#fff;border-radius:18px;padding:22px;margin:24px 0}.band h2{color:#fff}.band p{color:#E8F2FF}footer{background:#0A1628;color:#B7C6DB;padding:24px 0;font-size:14px;margin-top:28px}footer a{color:#fff}footer p{margin:4px 0;color:#B7C6DB}.row{display:flex;gap:12px;align-items:center}.row img{width:56px;height:56px;border-radius:14px;object-fit:cover}`;

function shell({ title, desc, canonical, image, robots, jsonld, body }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}" />
<link rel="canonical" href="${esc(canonical)}" />
<meta name="robots" content="${robots}" />
<meta name="theme-color" content="#0066CC" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="KaziApa" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(desc)}" />
<meta property="og:url" content="${esc(canonical)}" />
<meta property="og:image" content="${esc(image)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:description" content="${esc(desc)}" />
<meta name="twitter:image" content="${esc(image)}" />
<link rel="apple-touch-icon" href="/icon-192.png" />
<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, "\\u003c")}</script>
<style>${CSS}</style>
</head>
<body>
${body}
<footer><div class="wrap"><p><b style="color:#fff">KaziApa</b> by Kazinasi Technologies, Kenya &middot; Soko lako la karibu</p><p><a href="/kiosks">All kiosks</a> &middot; <a href="/welcome.html">About KaziApa</a> &middot; <a href="/features.html">Features</a> &middot; <a href="/kiosk.html">Open a free kiosk</a> &middot; <a href="${PLAY}">Google Play</a></p></div></footer>
</body>
</html>`;
}

const header = (crumbs) => `<header class="top"><div class="wrap"><div class="nav"><a class="brand" href="/welcome.html"><span class="logo">K</span> KaziApa</a><a class="btn" href="${PLAY}">Get the app</a></div><div class="crumbs">${crumbs}</div></div></header>`;

function notFound(res) {
  res.statusCode = 404;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=300");
  res.setHeader("X-Robots-Tag", "noindex");
  res.end(shell({
    title: "Kiosk not found | KaziApa", desc: "This kiosk was not found on KaziApa.", canonical: `${SITE}/kiosks`, image: `${SITE}/og-image.png`, robots: "noindex,follow",
    jsonld: { "@context": "https://schema.org", "@type": "WebPage", name: "Kiosk not found" },
    body: `${header(`<a href="/welcome.html">KaziApa</a> &rsaquo; Kiosk not found`)}<main class="wrap"><section><h1>We could not find that kiosk</h1><p>It may have been renamed or removed.</p><p><a class="btn" href="/kiosks">See all kiosks</a> <a class="btn blue" href="/">Open KaziApa</a></p></section></main>`,
  }));
}

function renderKiosk(data) {
  const k = data.kiosk || {};
  const rec = data.record || {};
  const listings = Array.isArray(data.listings) ? data.listings : [];
  const work = Array.isArray(data.work) ? data.work : [];
  const tests = Array.isArray(data.testimonials) ? data.testimonials : [];
  const name = cut(k.name, 70) || "KaziApa kiosk";
  const about = clean(k.description);
  const typeName = TYPE_LABEL[k.kiosk_type] || "";
  const place = cut(k.location, 60);
  const url = `${SITE}/kiosk/${k.slug}`;
  const indexable = name.length >= 2 && (about.length >= 30 || listings.length > 0 || work.length > 0);

  const titleBits = [name];
  const sub = [cut(k.category, 40), place].filter(Boolean).join(" in ");
  if (sub) titleBits.push(sub);
  const title = `${titleBits.join(" – ")} | KaziApa`.slice(0, 120);
  const descSrc = about || [typeName, cut(k.category, 40), place && `in ${place}`].filter(Boolean).join(" ") || `${name} on KaziApa`;
  const desc = cut(`${name}${place ? ", " + place : ""}. ${descSrc}`, 158);

  const banner = safeUrl(k.banner_url), logo = safeUrl(k.logo_url);
  const firstWork = work.map(w => (Array.isArray(w.after_photos) ? w.after_photos[0] : null)).find(safeUrl);
  const image = banner || logo || safeUrl(firstWork) || `${SITE}/og-image.png`;

  const tiles = [];
  if (rec.completed_orders > 0) tiles.push([rec.completed_orders, "Orders completed"]);
  if (rec.items_sold > 0) tiles.push([rec.items_sold, "Items sold"]);
  if (rec.rating_count > 0 && rec.rating_avg != null) tiles.push(["★ " + rec.rating_avg, `${rec.rating_count} rating${rec.rating_count === 1 ? "" : "s"}`]);
  if (rec.nitume_completed > 0) tiles.push([rec.nitume_completed, "Nitume jobs done"]);
  if (k.years_experience != null) tiles.push([k.years_experience, `Year${Number(k.years_experience) === 1 ? "" : "s"} of experience`]);
  if (rec.member_since) tiles.push([when(rec.member_since), "On KaziApa since"]);

  const facts = [];
  if (typeName) facts.push(["I am a", typeName]);
  if (k.areas_covered) facts.push(["Areas I cover", cut(k.areas_covered, 200)]);
  if (k.charges) facts.push(["My charges", cut(k.charges, 300)]);

  const sections = [];
  if (about) sections.push(`<section><h2>About ${esc(name)}</h2><p>${esc(about)}</p></section>`);
  if (tiles.length) sections.push(`<section><h2>Track record</h2><div class="tiles">${tiles.map(t => `<div class="tile"><b>${esc(t[0])}</b><span>${esc(t[1])}</span></div>`).join("")}</div><p style="font-size:13px;margin-top:8px">Built automatically from real orders, ratings and jobs on KaziApa.</p></section>`);
  if (facts.length) sections.push(`<section><h2>Services and areas</h2>${facts.map(f => `<div class="card"><small>${esc(f[0])}</small><div>${esc(f[1])}</div></div>`).join("")}</section>`);
  if (work.length) sections.push(`<section><h2>Work done</h2>${work.map(w => {
    const imgs = [];
    const b = safeUrl(w.before_photo); if (b) imgs.push(`<img loading="lazy" width="120" height="120" src="${esc(b)}" alt="Before: ${esc(cut(w.title, 60))}" />`);
    (Array.isArray(w.after_photos) ? w.after_photos : []).filter(safeUrl).slice(0, 4).forEach((u, i) => imgs.push(`<img loading="lazy" width="120" height="120" src="${esc(u)}" alt="${b && i === 0 ? "After" : "Finished work"}: ${esc(cut(w.title, 60))}" />`));
    const line = [w.area && "📍 " + cut(w.area, 60), w.price_note && cut(w.price_note, 80), w.done_on && when(w.done_on)].filter(Boolean).join(" · ");
    return `<div class="card"><h3>${esc(cut(w.title, 90))}</h3>${line ? `<small>${esc(line)}</small>` : ""}${w.description ? `<p style="margin-top:6px">${esc(cut(w.description, 400))}</p>` : ""}${imgs.length ? `<div class="imgs">${imgs.join("")}</div>` : ""}</div>`;
  }).join("")}</section>`);
  if (tests.length) sections.push(`<section><h2>What customers say</h2>${tests.map(t => `<div class="card"><b>${esc(cut(t.author_first, 20) || "Customer")}</b>${t.rating ? ` <span class="stars">${"★".repeat(Math.max(0, Math.min(5, t.rating)))}</span>` : ""}<p style="margin-top:6px">${esc(cut(t.message, 300))}</p></div>`).join("")}<p style="font-size:13px">Only people who chatted or traded with this kiosk on KaziApa can leave a testimonial.</p></section>`);
  if (listings.length) sections.push(`<section><h2>Items and services</h2><div class="items">${listings.map(l => {
    const ph = safeUrl(l.photo);
    const price = l.price_label ? cut(l.price_label, 30) : (l.price ? "Ksh " + Number(l.price).toLocaleString("en-KE") : "");
    return `<div class="item">${ph ? `<img loading="lazy" width="180" height="130" src="${esc(ph)}" alt="${esc(cut(l.title, 70))}" />` : ""}<div><b>${esc(cut(l.title, 70))}</b><small>${esc([price, cut(l.town, 30)].filter(Boolean).join(" · "))}</small></div></div>`;
  }).join("")}</div><p style="margin-top:10px">Open the KaziApa app to chat with this seller about any item.</p></section>`);

  const initial = esc((name[0] || "K").toUpperCase());
  const body = `${header(`<a href="/welcome.html">KaziApa</a> &rsaquo; <a href="/kiosks">Kiosks</a> &rsaquo; ${esc(name)}`)}
<div class="cover">${banner ? `<img src="${esc(banner)}" width="860" height="190" alt="${esc(name)}" fetchpriority="high" />` : ""}</div>
<main class="wrap">
<div class="profile"><div class="avatar">${logo ? `<img src="${esc(logo)}" width="84" height="84" alt="${esc(name)} logo" />` : initial}</div></div>
<h1>${esc(name)}</h1>
<div class="meta">${typeName ? `<span class="pill">${esc(typeName)}</span>` : ""}${k.category ? `<span class="pill">${esc(cut(k.category, 40))}</span>` : ""}${place ? `📍 ${esc(place)}` : ""}</div>
<p><a class="btn" href="/?kiosk=${esc(k.slug)}">Chat or leave a testimonial in the app</a></p>
${sections.join("\n")}
<div class="band"><h2>Want a kiosk like this?</h2><p>Open a free KaziApa kiosk with your photo, your work and your own track record. Share the link on WhatsApp.</p><a class="btn" href="${PLAY}">Download KaziApa</a> <a class="btn" style="background:#fff;color:#0066CC" href="/kiosk.html">How kiosks work</a></div>
</main>`;

  const business = { "@type": "LocalBusiness", name, url, image };
  if (about) business.description = cut(about, 300);
  if (k.areas_covered) business.areaServed = cut(k.areas_covered, 200);
  const jsonld = { "@context": "https://schema.org", "@graph": [
    business,
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "KaziApa", item: `${SITE}/welcome.html` },
      { "@type": "ListItem", position: 2, name: "Kiosks", item: `${SITE}/kiosks` },
      { "@type": "ListItem", position: 3, name, item: url } ] } ] };

  return shell({ title, desc, canonical: url, image, robots: indexable ? "index,follow" : "noindex,follow", jsonld, body });
}

function renderList(rows, opts = {}) {
  const list = Array.isArray(rows) ? rows : [];
  const groups = {};
  list.forEach(r => { const g = TYPE_LABEL[r.kiosk_type] || "Other"; (groups[g] = groups[g] || []).push(r); });
  const order = ["Shop", "Service", "Worker", "Transport", "Other"].filter(g => groups[g]);
  const body = `${header(`<a href="/welcome.html">KaziApa</a> &rsaquo; Kiosks`)}
<main class="wrap"><section><h1>${esc(opts.h1 || "KaziApa kiosks")}</h1><p>${opts.intro || "Shops, fundis, riders and service providers on KaziApa. Each kiosk shows real work, ratings and what customers say."}</p></section>
${list.length === 0 ? `<section><p>No kiosks to show yet. Be the first: <a href="/kiosk.html">open a free kiosk</a>.</p></section>` : order.map(g => `<section><h2>${esc(g)}s</h2>${groups[g].map(r => `<a href="/kiosk/${esc(r.slug)}" style="text-decoration:none;color:inherit"><div class="card"><h3>${esc(cut(r.name, 70))}</h3><small>${esc([cut(r.category, 40), cut(r.location, 50)].filter(Boolean).join(" · "))}</small>${r.about ? `<p style="margin-top:6px">${esc(cut(r.about, 140))}</p>` : ""}</div></a>`).join("")}</section>`).join("")}
<div class="band"><h2>Get your own kiosk</h2><p>It is free. Add your photo, your work and share the link.</p><a class="btn" href="${PLAY}">Download KaziApa</a> <a class="btn" style="background:#fff;color:#0066CC" href="/kiosk.html">How kiosks work</a></div></main>`;
  const jsonld = { "@context": "https://schema.org", "@graph": [
    { "@type": "CollectionPage", name: "KaziApa kiosks", url: `${SITE}/kiosks` },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "KaziApa", item: `${SITE}/welcome.html` },
      { "@type": "ListItem", position: 2, name: "Kiosks", item: `${SITE}/kiosks` } ] } ] };
  return shell({ title: opts.title || "KaziApa Kiosks: Shops, Fundis and Services in Kenya", desc: "Browse KaziApa kiosks: shops, fundis, riders and service providers in Kenya with work photos, ratings and customer testimonials.", canonical: `${SITE}/kiosks`, image: `${SITE}/og-image.png`, robots: (opts.noindex || !list.length) ? "noindex,follow" : "index,follow", jsonld, body });
}

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") { res.statusCode = 405; return res.end("Method not allowed"); }
  try {
    const q = req.query || {};
    if (q.sitemap) {
      // Sitemap of kiosks that are good enough to index (served at /sitemap-kiosks.xml)
      const rows = await rpc("kiosk_public_list", { p_limit: 5000 });
      const urls = (Array.isArray(rows) ? rows : [])
        .filter(k => /^[a-z0-9-]{1,60}$/.test(String(k.slug || "")))
        .map(k => {
          const d = k.lastmod ? new Date(k.lastmod) : null;
          const lm = d && !isNaN(d) ? `<lastmod>${d.toISOString().slice(0, 10)}</lastmod>` : "";
          return `  <url><loc>${SITE}/kiosk/${k.slug}</loc>${lm}</url>`;
        }).join("\n");
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/xml; charset=utf-8");
      res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
      return res.end(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
    }
    if (q.list) {
      const rows = await rpc("kiosk_public_list", { p_limit: 300 });
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "public, s-maxage=900, stale-while-revalidate=86400");
      return res.end(renderList(rows));
    }
    let raw = String(q.slug || "");
    try { raw = decodeURIComponent(raw); } catch (e) {}
    const slug = raw.toLowerCase().trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    if (!/^[a-z0-9-]{1,60}$/.test(slug)) return notFound(res);
    const data = await rpc("kiosk_public", { p_slug: slug });
    if (!data || !data.kiosk) {
      // The address is usually the kiosk name plus a few digits (for example stephen-1424).
      // If someone types only the name, find kiosks that start with it.
      const all = await rpc("kiosk_public_list", { p_limit: 300 });
      const matches = (Array.isArray(all) ? all : []).filter(r => String(r.slug || "").startsWith(slug + "-") || String(r.name || "").toLowerCase() === slug.replace(/-/g, " "));
      if (matches.length === 1) {
        res.statusCode = 302;
        res.setHeader("Location", `/kiosk/${matches[0].slug}`);
        res.setHeader("Cache-Control", "public, s-maxage=300");
        return res.end();
      }
      if (matches.length > 1) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("Cache-Control", "public, s-maxage=300");
        res.setHeader("X-Robots-Tag", "noindex");
        return res.end(renderList(matches, { h1: `Kiosks named ${slug.replace(/-/g, " ")}`, intro: "More than one kiosk matches. Pick the one you want.", title: "Kiosks matching your search | KaziApa", noindex: true }));
      }
      return notFound(res);
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=900, stale-while-revalidate=86400");
    return res.end(renderKiosk(data));
  } catch (e) {
    console.error("kiosk-page error:", e && e.message);
    res.statusCode = 503;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    return res.end("Temporarily unavailable. Please try again.");
  }
}
