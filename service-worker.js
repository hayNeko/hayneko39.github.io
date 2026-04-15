// GitHub Pages Service Worker
const APP_VERSION = '1.0.2';
const CACHE_NAME = `hayneko-${APP_VERSION}`;
const OFFLINE_URL = '/offline.html';

// 多层缓存策略配置
const CACHE_POLICIES = {
	fonts: {
		cacheName: 'hayneko-fonts-v1',
		maxEntries: 20,
		maxAgeSeconds: 60 * 60 * 24 * 30 // 30天
	},
	images: {
		cacheName: 'hayneko-images-v1',
		maxEntries: 100,
		maxAgeSeconds: 60 * 60 * 24 * 7 // 7天
	},
	static: {
		cacheName: 'hayneko-static-v1',
		maxEntries: 150,
		maxAgeSeconds: 60 * 60 * 24 * 365 // 1年
	},
	api: {
		cacheName: 'hayneko-api-v1',
		maxEntries: 50,
		maxAgeSeconds: 60 * 60 // 1小时
	}
};

// 需要预缓存的资源（关键资源）
const PRECACHE_RESOURCES = [
	OFFLINE_URL,
	'/index.html',
	'/medias/css/root.css',
	'/medias/css/index.css',
	'/medias/css/main-page.css',
	'/medias/fonts/WenYuanSerifSCC-Regular.ttf',
	'/medias/fonts/PatuaOne-Regular.ttf',
	'/medias/fonts/LorchinSansP0.woff2',
	'/medias/picures/background.jpg',
];

// 资源类型判断规则
const RESOURCE_PATTERNS = {
	fonts: /\.(ttf|woff|woff2|otf)$/i,
	images: /\.(jpg|jpeg|png|gif|webp|svg)$/i,
	static: /\.(js|css|json|ico|xml|txt)$/i,
	api: /\/api\//i
};

// 工具函数：根据URL获取缓存策略
function getCachePolicy(url) {
	const pathname = new URL(url).pathname;
	if (RESOURCE_PATTERNS.fonts.test(pathname)) return CACHE_POLICIES.fonts;
	if (RESOURCE_PATTERNS.images.test(pathname)) return CACHE_POLICIES.images;
	if (RESOURCE_PATTERNS.api.test(url)) return CACHE_POLICIES.api;
	if (RESOURCE_PATTERNS.static.test(pathname)) return CACHE_POLICIES.static;
	return CACHE_POLICIES.static;
}

// 工具函数：清理过期缓存
async function cleanExpiredCache(cacheName, maxAgeSeconds) {
	const cache = await caches.open(cacheName);
	const keys = await cache.keys();
	
	for (const request of keys) {
		const response = await cache.match(request);
		if (!response) continue;
		
		const dateHeader = response.headers.get('date');
		if (dateHeader) {
			const cacheTime = new Date(dateHeader).getTime();
			const now = Date.now();
			if (now - cacheTime > maxAgeSeconds * 1000) {
				await cache.delete(request);
			}
		}
	}
}

// 工具函数：限制缓存条目数量
async function limitCacheSize(cacheName, maxEntries) {
	const cache = await caches.open(cacheName);
	const keys = await cache.keys();
	
	if (keys.length > maxEntries) {
		const keysToDelete = keys.slice(0, keys.length - maxEntries);
		for (const key of keysToDelete) {
			await cache.delete(key);
		}
	}
}

self.addEventListener('install', (event) => {
	console.log('[Service Worker] Installing version:', APP_VERSION);
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then((cache) => {
				console.log('[Service Worker] Pre-caching critical resources');
				return cache.addAll(PRECACHE_RESOURCES)
					.catch(err => {
						console.error('[Service Worker] Pre-cache failed:', err);
						// 继续执行，即使某些资源缓存失败
					});
			})
			.then(() => self.skipWaiting())
	);
});

self.addEventListener('activate', (event) => {
	console.log('[Service Worker] Activating version:', APP_VERSION);
	event.waitUntil(
		Promise.all([
			// 清理旧缓存
			caches.keys().then(cacheNames => {
				return Promise.all(
					cacheNames.map(cacheName => {
						// 保留当前版本的所有缓存
						const isCurrentVersion = cacheName.startsWith('hayneko-');
						if (!isCurrentVersion) {
							console.log('[Service Worker] Deleting old cache:', cacheName);
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
	const { request } = event;
	const url = new URL(request.url);
	
	// 跳过非 HTTP(S) 请求
	if (!request.url.startsWith('http')) return;
	
	// 跳过浏览器扩展请求
	if (url.hostname === 'extensions' || url.protocol === 'chrome-extension:') return;
	
	// 获取该资源的缓存策略
	const cachePolicy = getCachePolicy(request.url);
	
	// 针对不同类型的资源使用不同策略
	if (cachePolicy === CACHE_POLICIES.fonts) {
		// 字体：缓存优先，长期有效
		event.respondWith(cacheThenNetwork(request, cachePolicy));
	} else if (cachePolicy === CACHE_POLICIES.static) {
		// 静态资源（JS/CSS）：缓存优先，同时检查更新
		event.respondWith(cacheThenNetworkWithUpdate(request, cachePolicy));
	} else if (cachePolicy === CACHE_POLICIES.images) {
		// 图片：缓存优先，后台更新
		event.respondWith(cacheThenNetwork(request, cachePolicy));
	} else if (cachePolicy === CACHE_POLICIES.api) {
		// API：网络优先，缓存备用
		event.respondWith(networkThenCache(request, cachePolicy));
	} else {
		// 默认：缓存优先
		event.respondWith(cacheThenNetwork(request, cachePolicy));
	}
});

// 缓存优先策略
async function cacheThenNetwork(request, cachePolicy) {
	try {
		const cachedResponse = await caches.match(request);
		if (cachedResponse) {
			return cachedResponse;
		}
		
		// 网络获取
		const networkResponse = await fetch(request);
		if (networkResponse && networkResponse.status === 200) {
			// 存入缓存
			const cacheCopy = networkResponse.clone();
			const cache = await caches.open(cachePolicy.cacheName);
			cache.put(request, cacheCopy).then(() => {
				limitCacheSize(cachePolicy.cacheName, cachePolicy.maxEntries);
			});
		}
		return networkResponse;
	} catch (error) {
		// 离线或网络错误
		const cached = await caches.match(request);
		if (cached) {
			return cached;
		}
		
		// 返回离线页面或错误响应
		if (request.mode === 'navigate') {
			return caches.match(OFFLINE_URL);
		}
		
		return new Response('Offline - Resource not available', {
			status: 503,
			statusText: 'Service Unavailable'
		});
	}
}

// 缓存优先 + 后台更新策略（Stale-While-Revalidate）
async function cacheThenNetworkWithUpdate(request, cachePolicy) {
	try {
		const cachedResponse = await caches.match(request);
		
		// 异步更新缓存
		fetch(request)
			.then(networkResponse => {
				if (networkResponse && networkResponse.status === 200) {
					const cacheCopy = networkResponse.clone();
					caches.open(cachePolicy.cacheName).then(cache => {
						cache.put(request, cacheCopy).then(() => {
							limitCacheSize(cachePolicy.cacheName, cachePolicy.maxEntries);
						});
					});
				}
			})
			.catch(() => {
				// 网络失败，保留缓存
			});
		
		// 立即返回缓存
		if (cachedResponse) {
			return cachedResponse;
		}
		
		// 如果没有缓存，等待网络响应
		return await fetch(request);
	} catch (error) {
		const cached = await caches.match(request);
		return cached || new Response('Resource not available', { status: 503 });
	}
}

// 网络优先策略
async function networkThenCache(request, cachePolicy) {
	try {
		const networkResponse = await fetch(request);
		if (networkResponse && networkResponse.status === 200) {
			// 存入缓存
			const cacheCopy = networkResponse.clone();
			caches.open(cachePolicy.cacheName).then(cache => {
				cache.put(request, cacheCopy).then(() => {
					limitCacheSize(cachePolicy.cacheName, cachePolicy.maxEntries);
				});
			});
		}
		return networkResponse;
	} catch (error) {
		// 网络失败，使用缓存
		const cached = await caches.match(request);
		if (cached) {
			return cached;
		}
		
		if (request.mode === 'navigate') {
			return caches.match(OFFLINE_URL);
		}
		
		return new Response('Network error', { status: 503 });
	}
}

// 接收来自客户端的消息，例如清除缓存、更新检查等
self.addEventListener('message', (event) => {
	if (event.data.action === 'skipWaiting') {
		console.log('[Service Worker] Skipping waiting period');
		self.skipWaiting();
	}
	
	if (event.data.action === 'clearCache') {
		console.log('[Service Worker] Clearing all caches');
		caches.keys().then(cacheNames => {
			Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
		});
	}
	
	if (event.data.action === 'clearSpecificCache') {
		const cacheName = event.data.cacheName;
		console.log('[Service Worker] Clearing cache:', cacheName);
		caches.delete(cacheName).then(success => {
			event.ports[0]?.postMessage({ cleared: success });
		});
	}
	
	if (event.data.action === 'getCacheStats') {
		// 获取缓存统计信息
		caches.keys().then(cacheNames => {
			const stats = {};
			Promise.all(cacheNames.map(cacheName => 
				caches.open(cacheName).then(cache => 
					cache.keys().then(keys => {
						stats[cacheName] = keys.length;
					})
				)
			)).then(() => {
				event.ports[0]?.postMessage({ stats });
			});
		});
	}
});