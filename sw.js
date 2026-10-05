const CACHE_NAME = "kegelstatistik-pwa-2026-10-05-v45-games-tile";
const CORE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});

self.addEventListener("fetch", event => {
  const req=event.request;
  if(req.method!=="GET") return;
  const url=new URL(req.url);

  if(url.pathname.endsWith("/Kegelstatistik_Daten.json")){
    event.respondWith(
      fetch(req).then(res=>{
        if(res && res.ok){const copy=res.clone();caches.open(CACHE_NAME).then(c=>c.put("./Kegelstatistik_Daten.json",copy));}
        return res;
      }).catch(()=>caches.match("./Kegelstatistik_Daten.json"))
    );
    return;
  }

  if(req.mode==="navigate"){
    event.respondWith(fetch(req).then(res=>{const copy=res.clone();caches.open(CACHE_NAME).then(c=>c.put("./index.html",copy));return res;}).catch(()=>caches.match("./index.html").then(r=>r||caches.match("./"))));
    return;
  }

  event.respondWith(caches.match(req).then(cached=>{
    const network=fetch(req).then(res=>{if(res&&res.ok){const copy=res.clone();caches.open(CACHE_NAME).then(c=>c.put(req,copy));}return res;}).catch(()=>cached);
    return cached||network;
  }));
});
