// api/delete-account.js
// Deletes the logged-in person's account and data. Needs a valid login token (their own) and confirm:"DELETE".
// Safe to run again if a step failed: every step only touches what is left.
import { checkLoginToken } from "./_login-token.js";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://dalaawxoiecrmfwxwrdn.supabase.co";
const DB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const PROTECTED = ["768761424", "700000000"]; // admin and Google Play reviewer (last 9 digits)

const headers = (extra = {}) => ({
  "Content-Type": "application/json",
  apikey: DB_KEY,
  ...(String(DB_KEY || "").startsWith("sb_") ? {} : { Authorization: `Bearer ${DB_KEY}` }),
  ...extra,
});

async function sel(path) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers: headers() });
  if (!r.ok) throw new Error(`select ${path.split("?")[0]} ${r.status}`);
  return r.json();
}
async function mutate(method, path, body) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: headers({ Prefer: "return=minimal" }),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!r.ok) {
    const t = await r.text().catch(() => "");
    throw new Error(`${method} ${path.split("?")[0]} ${r.status} ${t.slice(0, 160)}`);
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ success: false, error: "Method not allowed" });
  const body = req.body || {};
  const claims = checkLoginToken(body.token);
  if (!claims) return res.status(401).json({ success: false, error: "Please log in again, then try again." });
  if (body.confirm !== "DELETE") return res.status(400).json({ success: false, error: "Confirmation missing." });

  const d9 = String(claims.phone).replace(/\D/g, "").slice(-9);
  if (d9.length !== 9) return res.status(400).json({ success: false, error: "Bad phone." });
  if (PROTECTED.includes(d9)) return res.status(403).json({ success: false, error: "This account cannot be deleted." });

  const variants = ["+254" + d9, "254" + d9, "0" + d9];
  const V = variants.map(encodeURIComponent).join(",");
  const IN = (col) => `${col}=in.(${V})`;

  try {
    // 1. A landlord with active tenants must end the tenancies first
    const active = await sel(`rt_tenancies?${IN("landlord_phone")}&status=eq.active&select=id&limit=1`);
    if (active.length) {
      return res.status(409).json({ success: false, error: "You still have active tenants in Rent Tracker. Move them out (end their tenancies) first, then delete your account." });
    }

    // 2. Collect photo files (before the rows are deleted)
    const files = new Set();
    const scan = (rows) => {
      for (const m of JSON.stringify(rows || []).matchAll(/\/kaziapa-photos\/([^"?\\\s]+)/g)) {
        try { files.add(decodeURIComponent(m[1])); } catch (e) { files.add(m[1]); }
      }
    };
    for (const [t, col] of [["users", "phone"], ["listings", "seller_phone"], ["statuses", "seller_phone"], ["kiosks", "phone"], ["properties", "agent_phone"], ["requests", "buyer_phone"]]) {
      try { scan(await sel(`${t}?${IN(col)}&select=*`)); } catch (e) { console.error("delete-account scan", t, e.message); }
    }

    const failed = [];
    const step = async (name, fn) => { try { await fn(); } catch (e) { failed.push(name); console.error("delete-account step failed:", name, e.message); } };
    const del = (t, col) => step(`delete ${t}`, () => mutate("DELETE", `${t}?${IN(col)}`));
    const anon = (t, col, val = "deleted") => step(`anonymize ${t}.${col}`, () => mutate("PATCH", `${t}?${IN(col)}`, { [col]: val }));

    // 3. Landlord's own Rent Tracker data (children first)
    for (const t of ["rt_ledger", "rt_documents", "rt_communications", "rt_maintenance_requests", "rt_audit_log", "rt_tenant_requests", "rt_tenancies", "rt_units", "rt_properties", "rt_settings"]) await del(t, "landlord_phone");
    await del("rt_team_members", "owner_phone");
    await del("rt_team_members", "member_phone");

    // 4. As tenant / team member in someone else's records: keep their records, remove the phone
    await anon("rt_tenancies", "tenant_phone");
    await step("clear emergency contact", () => mutate("PATCH", `rt_tenancies?${IN("emergency_contact_phone")}`, { emergency_contact_phone: null }));
    await anon("rt_ledger", "tenant_phone");
    await anon("rt_maintenance_requests", "tenant_phone");
    await anon("rt_tenant_requests", "tenant_phone");
    await anon("rt_documents", "uploaded_by_phone");
    await anon("rt_communications", "logged_by_phone");
    await anon("rt_audit_log", "actor_phone");

    // 5. Marketplace and community
    for (const col of ["buyer_phone", "seller_phone", "sender_phone"]) await del("chats", col);
    await del("kiosk_markets", "kiosk_phone");
    await del("kiosks", "phone");
    await del("statuses", "seller_phone");
    await del("listing_reports", "reporter_phone");
    await del("listing_unlocks", "tenant_phone");
    await del("request_replies", "seller_phone");
    await del("requests", "buyer_phone");
    await del("viewings", "agent_phone");
    await del("viewings", "tenant_phone");
    await del("properties", "agent_phone");
    await del("listings", "seller_phone");
    await del("listings", "created_by_phone");
    await del("market_members", "phone");
    await del("market_notice_reports", "reporter_phone");
    await del("market_notices", "phone");
    await del("market_spaces", "phone");
    await del("nitume_guide_markets", "phone");
    await del("notifications", "recipient_phone");
    await del("push_subscriptions", "phone");
    await del("blocked_users", "blocker_phone");
    await del("blocked_users", "blocked_phone");
    await del("otp_codes", "phone");

    // 6. Records other people or the law still need: keep, without the phone number
    await anon("orders", "buyer_phone");
    await anon("orders", "seller_phone");
    await anon("purchases", "phone");
    await anon("nitume_requests", "customer_phone");
    await anon("nitume_requests", "provider_phone");
    await step("clear nitume target", () => mutate("PATCH", `nitume_requests?${IN("target_provider_phone")}`, { target_provider_phone: null }));
    await step("clear suggested hood phone", () => mutate("PATCH", `markets?${IN("suggested_by_phone")}`, { suggested_by_phone: null }));

    // 7. Files: photos (avatar, statuses, listings) and the private rent-docs folder
    await step("delete photos", async () => {
      const list = [...files];
      for (let i = 0; i < list.length; i += 50) {
        await fetch(`${SUPABASE_URL}/storage/v1/object/kaziapa-photos`, { method: "DELETE", headers: headers(), body: JSON.stringify({ prefixes: list.slice(i, i + 50) }) });
      }
    });
    await step("delete rent documents", async () => {
      for (const folder of [...new Set(["254" + d9, "0" + d9, "+254" + d9])]) {
        const r = await fetch(`${SUPABASE_URL}/storage/v1/object/list/rent-docs`, { method: "POST", headers: headers(), body: JSON.stringify({ prefix: folder, limit: 1000 }) });
        const items = r.ok ? await r.json() : [];
        const paths = (Array.isArray(items) ? items : []).filter((x) => x && x.name).map((x) => `${folder}/${x.name}`);
        if (paths.length) await fetch(`${SUPABASE_URL}/storage/v1/object/rent-docs`, { method: "DELETE", headers: headers(), body: JSON.stringify({ prefixes: paths }) });
      }
    });

    // 8. The account itself, only when everything above worked
    if (failed.length) {
      return res.status(500).json({ success: false, error: "We could not finish deleting everything. Please email hello@kaziapa.co.ke and we will complete it.", failed });
    }
    await mutate("DELETE", `users?${IN("phone")}`);
    return res.status(200).json({ success: true });
  } catch (e) {
    console.error("delete-account error:", e.message);
    return res.status(500).json({ success: false, error: "Something went wrong. Please try again or email hello@kaziapa.co.ke." });
  }
}
