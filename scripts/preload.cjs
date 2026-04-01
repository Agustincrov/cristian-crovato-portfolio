// Node.js 20 ships undici v5 as a global. When Payload loads undici v7,
// the CacheStorage constructor check fails due to the conflicting global.
// Deleting it here lets undici v7 set up its own caches properly.
delete globalThis.caches
