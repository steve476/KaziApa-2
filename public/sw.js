// KaziApa needs a live connection anyway (Supabase-backed — nothing works
// offline), so opportunistically caching app files bought no real benefit
// and was the cause of blank white screens: a network hiccup would fall
// back to a stale or missing cached file for freshly-deployed JS/CSS,
// leaving the page unable to load. Cache name bumped to v2 so any old,
// mismatched cached files from earlier deploys get purged on activate.
const CACHE = "kaziapa-v2";

self.addEventListener("install", e => {
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

// No custom fetch handling — let the browser do normal networking.
self.addEventListener("fetch", e => {});
