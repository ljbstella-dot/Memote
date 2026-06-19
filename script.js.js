// Memote Service Worker
// 이 파일을 index.html(Memote.html을 index.html로 이름 변경한 파일)과
// 같은 폴더에 함께 업로드하세요.

const CACHE_NAME = 'memote-v5';

self.addEventListener('install', e => {
  self.skipWaiting(); // 즉시 활성화
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => {
        console.log('[SW] 구버전 캐시 삭제:', k);
        return caches.delete(k);
      }))
    ).then(() => self.clients.claim())
  );
});

// Network-First: 항상 네트워크 최신본 우선, 오프라인 시에만 캐시 사용
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
      return res;
    }).catch(() => caches.match(e.request))
  );
});
