"use client";

// Generate a unique cache key for this build/session
export const CACHE_VERSION =
  process.env.NEXT_PUBLIC_APP_VERSION ||
  (typeof window !== "undefined"
    ? localStorage.getItem("cache_version") || `v${Date.now()}`
    : "v1");

// Function to force refresh all cached resources
export function bustAllCaches() {
  if (typeof window === "undefined") return;

  // 1. Clear localStorage cache
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (
      key &&
      (key.includes("cache") ||
        key.includes("tsla_") ||
        key.includes("user_") ||
        key.includes("auth_") ||
        key.match(/cars|images|inventory/i))
    ) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => localStorage.removeItem(key));

  // 2. Generate new cache version
  const newVersion = `v${Date.now()}`;
  localStorage.setItem("cache_version", newVersion);

  // 3. Clear service worker cache
  if ("caches" in window) {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        caches.delete(cacheName);
      });
    });
  }

  // 4. Clear session storage
  sessionStorage.clear();

  // 5. Force reload with cache busting
  window.location.href =
    window.location.pathname + "?v=" + newVersion + "&_=" + Date.now();
}

// Function to add cache-busting query params to URLs
export function getCacheBustedUrl(url: string): string {
  if (typeof window === "undefined") return url;

  // If it's already a data URL or has query params, leave it alone
  if (url.startsWith("data:") || url.startsWith("blob:")) return url;

  const version = localStorage.getItem("cache_version") || CACHE_VERSION;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}_v=${version}&_=${Date.now()}`;
}

// Hook for components
export function useCacheBuster() {
  const bustCache = () => {
    bustAllCaches();
  };

  return { bustCache, CACHE_VERSION };
}
