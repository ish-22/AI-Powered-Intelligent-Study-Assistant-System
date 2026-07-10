/**
 * dashboard-cache.ts
 *
 * A module-level singleton cache for /dashboard/stats.
 * ─────────────────────────────────────────────────────
 * • Only ONE network request is ever in-flight at a time (promise dedup).
 * • Successful responses are cached for CACHE_TTL ms — navigating away and
 *   back returns instantly without hitting the API again.
 * • The cache is invalidated when the auth token changes (logout / re-login).
 */

import { api, type DashboardStatsResponse } from "@/lib/api";

const CACHE_TTL = 60_000; // 1 minute

let cachedToken = "";
let cachedData: DashboardStatsResponse | null = null;
let cachedAt = 0;
let inflightPromise: Promise<DashboardStatsResponse> | null = null;

/** Returns cached data immediately, or fetches (deduped) from the API. */
export async function fetchDashboardData(token: string): Promise<DashboardStatsResponse> {
    // Invalidate if token changed (logout / different user)
    if (token !== cachedToken) {
        cachedData = null;
        cachedAt = 0;
        inflightPromise = null;
        cachedToken = token;
    }

    // Return from cache if still fresh
    if (cachedData && Date.now() - cachedAt < CACHE_TTL) {
        return cachedData;
    }

    // Deduplicate concurrent callers — return the same in-flight promise
    if (inflightPromise) return inflightPromise;

    inflightPromise = api.dashboard.getStats(token).then((data) => {
        cachedData = data;
        cachedAt = Date.now();
        inflightPromise = null;
        return data;
    }).catch((err) => {
        inflightPromise = null;
        throw err;
    });

    return inflightPromise;
}

/** Call after a write (e.g. updateStats) to force next read to re-fetch. */
export function invalidateDashboardCache() {
    cachedData = null;
    cachedAt = 0;
    inflightPromise = null;
}

/** Reset everything on logout. */
export function clearDashboardCache() {
    cachedToken = "";
    cachedData = null;
    cachedAt = 0;
    inflightPromise = null;
}
