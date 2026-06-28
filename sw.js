const CACHE_NAME = 'novacenter-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/shared.css',
  '/shared.js',
  '/gioi-thieu.html',
  '/phuong-phap.html',
  '/khoa-hoc.html',
  '/bai-test.html',
  '/cau-chuyen.html',
  '/lien-he.html',
  '/faq.html',
  '/vi-cong-dong.html',
  '/tuyen-dung.html',
  '/he-sinh-thai.html',
  '/sach-tai-lieu.html',
  '/privacy-policy.html',
  '/terms-of-service.html',
  '/admin.html',
  '/khao-sat-phu-huynh.html',
  '/khao-sat-hoc-vien.html',
  '/khao-sat-giao-vien.html',
  '/en/index.html',
  '/en/shared.css',
  '/en/shared.js',
  '/en/about.html',
  '/en/ecosystem.html',
  '/en/method.html',
  '/en/courses.html',
  '/en/test.html',
  '/en/materials.html',
  '/en/stories.html',
  '/en/community.html',
  '/en/careers.html',
  '/en/contact.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;
      return fetch(event.request).then(fetchResponse => {
        if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
          return fetchResponse;
        }
        const responseToCache = fetchResponse.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
        return fetchResponse;
      });
    })
  );
});
