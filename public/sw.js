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

// Web Push — shows the native Android notification when a chat message
// (or other notify-message.js call) arrives while the app isn't open.
self.addEventListener("push", e => {
  let data = { title: "KaziApa", body: "You have a new message.", url: "/" };
  try { data = { ...data, ...e.data.json() }; } catch (err) {}

  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      data: { url: data.url || "/" },
    })
  );
});

// Tapping the notification focuses an existing KaziApa tab if one's open,
// otherwise opens a new one straight to the app.
self.addEventListener("notificationclick", e => {
  e.notification.close();
  const url = e.notification.data?.url || "/";
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(clientsList => {
      for (const client of clientsList) {
        if (client.url.includes(self.location.origin) && "focus" in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
