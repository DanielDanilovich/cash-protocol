'use strict';
var CACHE = 'cash-v1';
var ASSETS = ['./', './index.html', './styles.css', './wallet.js', './crypto.js'];
self.addEventListener('install', (e) => e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))));
self.addEventListener('fetch', (e) => { if (e.request.method !== 'GET') return; e.respondWith(caches.match(e.request).then(c => c || fetch(e.request))); });
