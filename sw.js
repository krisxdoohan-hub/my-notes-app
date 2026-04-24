const CACHE_NAME = 'pwa-notes-cache-v1';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    // 空白的 fetch 監聽器即可滿足 Chrome 的 WebAPK 生成條件
    event.respondWith(fetch(event.request).catch(() => new Response("離線模式")));
});