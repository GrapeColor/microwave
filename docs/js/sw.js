const addResourcesToCache = async (resources) => {
	const cache = await caches.open("v1");
	await cache.addAll(resources);
};

resources = [
	'/',
	'index.html',
	'/js/index.js',
	'/style/main.css',
];

this.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open('v1')
			.then((cache) => cache.addAll(resources)),
	);
});

this.addEventListener('fetch', (event) => {
	event.respondWith(
		caches
			.match(event.request)
			.then((response) => {
				if (response) {
					return response;
				}
				return fetch(event.request);
			}),
	);
});
