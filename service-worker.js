// GitHub Pages Service Worker
const APP_VERSION = '1.0.1';
const CACHE_NAME = `hayneko-${APP_VERSION}`;
const OFFLINE_URL = './offline.html';

// 缓存策略
const CACHE_POLICY = {
	fonts: {
		cacheName: 'fonts',
		maxEntries: 10,
		maxAgeSeconds: 60 * 60 * 24 * 30 // 30天
	},
	images: {
		cacheName: 'images',
		maxEntries: 50,
		maxAgeSeconds: 60 * 60 * 24 * 7 // 7天
	},
	static: {
		cacheName: 'static',
		maxEntries: 100,
		maxAgeSeconds: 60 * 60 * 24 * 365 // 1年
	}
};

// 需要预缓存的资源（根据实际路径调整）
const PRECACHE_RESOURCES = [
	OFFLINE_URL,
	// './medias/css/index.css',
	// './medias/css/dock.css',
	// './medias/scripts/LanguageSwitcher.js',
	// './medias/scripts/ThemeSwitcher.js',
	// './medias/scripts/CreateParticle.js',
	// './medias/fonts/07yasashisa.ttf',
	'./medias/fonts/WenYuanSerifSCC-Regular.ttf',
	'./medias/fonts/PatuaOne-Regular.ttf',
	'./medias/fonts/LorchinSansP0.woff2',

	'./medias/picures/background.jpg',
];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then((cache) => {
				console.log('[Service Worker] Pre-caching resources');
				return cache.addAll(PRECACHE_RESOURCES);
			})
			.then(() => self.skipWaiting())
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		Promise.all([
			// 清理旧缓存
			caches.keys().then(cacheNames => {
				return Promise.all(
					cacheNames.map(cacheName => {
						if (cacheName !== CACHE_NAME) {
							return caches.delete(cacheName);
						}
					})
				);
			}),
			// 立即控制所有页面
			self.clients.claim()
		])
	);
});

self.addEventListener('fetch', (event) => {
	const url = new URL(event.request.url);
	
	// 跳过非 HTTP 请求和浏览器扩展
	if (!event.request.url.startsWith('http')) return;
	
	// 策略：缓存优先，网络回退
	event.respondWith(
		caches.match(event.request)
			.then((cachedResponse) => {
				if (cachedResponse) {
					// 返回缓存，同时更新缓存（stale-while-revalidate）
					const fetchPromise = fetch(event.request)
						.then((networkResponse) => {
							const cacheCopy = networkResponse.clone();
							caches.open(CACHE_NAME)
								.then(cache => cache.put(event.request, cacheCopy));
						})
						.catch(() => {
							// 网络失败，保持缓存
						});
					
					return cachedResponse;
				}
				
				// 没有缓存，从网络获取
				return fetch(event.request)
					.then((response) => {
						// 检查响应是否有效
						if (!response || response.status !== 200 || response.type !== 'basic') {
							return response;
						}
						
						// 克隆响应以进行缓存
						const responseToCache = response.clone();
						
						caches.open(CACHE_NAME)
							.then((cache) => {
								cache.put(event.request, responseToCache);
							});
						
						return response;
					})
					.catch(() => {
						// 网络失败，尝试返回离线页面
						if (event.request.mode === 'navigate') {
							return caches.match(OFFLINE_URL);
						}
						
						// 对于字体，可以返回一个默认响应
						if (url.pathname.endsWith('.ttf')) {
							return new Response('', {
								status: 404,
								statusText: 'Font not available offline'
							});
						}
						
						throw new Error('Network error');
					});
			})
	);
});

// 接收消息，例如清除缓存
self.addEventListener('message', (event) => {
	if (event.data.action === 'skipWaiting') {
		self.skipWaiting();
	}
	
	if (event.data.action === 'clearCache') {
		caches.delete(CACHE_NAME);
	}
});

// clear cache for debugging
// const range = self.document ? self.document.getElementById('avatar') : null;
// if (range) {
// 	range.addEventListener('click', () => {
// 		caches.delete(CACHE_NAME);
// 		console.log('Cache cleared');
// 	});
// }