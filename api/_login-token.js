// api/_login-token.js
// Shared helper (the leading underscore keeps Vercel from exposing it as a web address).
// Signs and checks KaziApa login tokens (ES256). The matching public key is also registered in
// Supabase as a standby signing key, so the database accepts these tokens as "authenticated".
import crypto from "crypto";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://dalaawxoiecrmfwxwrdn.supabase.co";
export const LOGIN_KID = "1bb7fc08-665c-48ad-a80c-3525eeb8c793";
export const TOKEN_DAYS = 30;        // one token lasts 30 days
export const MAX_SESSION_DAYS = 180; // after 180 days since the last SMS code, a new code is needed

const b64url = (x) => Buffer.from(x).toString("base64url");

function privateKey() {
  const raw = process.env.LOGIN_PRIVATE_JWK;
  if (!raw) return null;
  return crypto.createPrivateKey({ key: JSON.parse(raw), format: "jwk" });
}

// authAt = when the person last typed a correct SMS code (unix seconds)
export function signLoginToken(fp, authAt) {
  try {
    const key = privateKey();
    if (!key) return null;
    const now = Math.floor(Date.now() / 1000);
    const exp = now + TOKEN_DAYS * 24 * 60 * 60;
    const header = { alg: "ES256", typ: "JWT", kid: LOGIN_KID };
    const payload = {
      iss: `${SUPABASE_URL}/auth/v1`,
      aud: "authenticated",
      role: "authenticated",
      sub: fp,
      phone: fp,
      auth_at: authAt || now,
      iat: now,
      exp,
    };
    const input = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(payload))}`;
    const sig = crypto.sign("sha256", Buffer.from(input), { key, dsaEncoding: "ieee-p1363" });
    return { token: `${input}.${sig.toString("base64url")}`, expiresAt: exp };
  } catch (e) {
    console.error("login-token: could not sign:", e.message);
    return null;
  }
}

// Returns the token's claims if it is genuine and not expired, otherwise null.
export function checkLoginToken(token) {
  try {
    const key = privateKey();
    if (!key || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const header = JSON.parse(Buffer.from(parts[0], "base64url").toString());
    if (header.alg !== "ES256" || header.kid !== LOGIN_KID) return null;
    const ok = crypto.verify(
      "sha256",
      Buffer.from(`${parts[0]}.${parts[1]}`),
      { key: crypto.createPublicKey(key), dsaEncoding: "ieee-p1363" },
      Buffer.from(parts[2], "base64url")
    );
    if (!ok) return null;
    const claims = JSON.parse(Buffer.from(parts[1], "base64url").toString());
    const now = Math.floor(Date.now() / 1000);
    if (!claims.exp || claims.exp <= now || claims.role !== "authenticated" || !claims.phone) return null;
    return claims;
  } catch (e) {
    return null;
  }
}
