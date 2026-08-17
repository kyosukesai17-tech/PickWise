import "server-only";

import { lcuRequest } from "./lcuRequest";
import { requestRecommendedPositions } from "./recommendedPositionsCore";

import type { LcuRecommendedPositions } from "../../types/lcu";
import type { LcuConnectionInfo } from "./types";

const FAILURE_RETRY_MS = 30_000;

type CacheEntry = Readonly<{
  value: LcuRecommendedPositions | null;
  retryAfter: number;
}>;

let cacheKey: string | null = null;
let cacheEntry: CacheEntry | null = null;
let pendingRequest: Promise<LcuRecommendedPositions | null> | null = null;

function getConnectionKey(connection: LcuConnectionInfo): string {
  return `${connection.address}:${connection.port}`;
}

export async function getRecommendedPositions(
  connection: LcuConnectionInfo,
): Promise<LcuRecommendedPositions | null> {
  const nextCacheKey = getConnectionKey(connection);

  if (cacheKey !== nextCacheKey) {
    cacheKey = nextCacheKey;
    cacheEntry = null;
    pendingRequest = null;
  }

  if (cacheEntry?.value) {
    return cacheEntry.value;
  }

  if (cacheEntry && Date.now() < cacheEntry.retryAfter) {
    return null;
  }

  if (!pendingRequest) {
    pendingRequest = requestRecommendedPositions(connection, lcuRequest)
      .then((value) => {
        const usableValue = Object.keys(value).length > 0 ? value : null;

        cacheEntry = {
          value: usableValue,
          retryAfter: usableValue ? Number.POSITIVE_INFINITY : Date.now() + FAILURE_RETRY_MS,
        };

        return usableValue;
      })
      .catch(() => {
        cacheEntry = {
          value: null,
          retryAfter: Date.now() + FAILURE_RETRY_MS,
        };

        return null;
      })
      .finally(() => {
        pendingRequest = null;
      });
  }

  return pendingRequest;
}
