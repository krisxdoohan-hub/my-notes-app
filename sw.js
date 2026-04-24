// 1. 定義對應主程式的版本號，每次更新 HTML 時，這裡也要跟著改以強制刷新快取
const CACHE_NAME = 'pwa-notes-cache-v1.4.0';

// 2. 羅列所有需要離線暫存的靜態資源 (包含外部的 CSS 與 JS 庫)
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    'https://cdn.tailwindcss.com',
    'https://cdn.quilljs.com/1.3.6/quill.snow.css',
    'https://cdn.quilljs.com/1.3.6/quill.min.js',
    'https://unpkg.com/lucide@latest'
];

// 3. 安裝階段：將所有資源寫入手機快取
self.addEventListener('install', (event) => {
    self.skipWaiting(); // 強制立即接管控制權
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// 4. 啟動階段：清除舊版無用的快取，釋放手機空間
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 5. 攔截請求：無網路時自動從快取提供檔案
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
