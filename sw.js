// Service worker : permet l'installation et l'usage sans connexion.
const V = "courses-v3";
const FICHIERS = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "apple-touch-icon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(FICHIERS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Réseau d'abord (pour recevoir les mises à jour), cache en secours hors connexion.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(r => {
      const copie = r.clone();
      caches.open(V).then(c => c.put(e.request, copie));
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match("index.html")))
  );
});
