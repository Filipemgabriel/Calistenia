const C='cal-v2';
const F='https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600&family=Barlow+Condensed:wght@600;700&display=swap';
self.addEventListener('install',e=>{
  e.waitUntil((async()=>{
    const c=await caches.open(C);
    await c.addAll(['./','index.html','manifest.webmanifest','icon-192.png']);
    try{
      const r=await fetch(F);
      await c.put(F,r.clone());
      const t=await r.text();
      const u=[...new Set([...t.matchAll(/url\((https:[^)]+)\)/g)].map(m=>m[1]))];
      await Promise.all(u.map(x=>c.add(x).catch(()=>{})));
    }catch(err){}
  })());
  self.skipWaiting();
});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request).then(m=>m||caches.match('index.html'))));
});
