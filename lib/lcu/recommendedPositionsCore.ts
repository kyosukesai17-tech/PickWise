import { LcuRequestError } from "./lcuError";

import type { Role } from "../../types/champion";
import type { LcuRecommendedPositions } from "../../types/lcu";
import type { LcuRequester } from "./champSelectSessionCore";
import type { LcuConnectionInfo } from "./types";

export const RECOMMENDED_POSITIONS_PATH =
  "/lol-perks/v1/recommended-champion-positions";

const POSITION_TO_ROLE: Readonly<Record<string, Role>> = {
  TOP: "TOP",
  JUNGLE: "JG",
  MIDDLE: "MID",
  BOTTOM: "ADC",
  UTILITY: "SUP",
};

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

export function normalizeRecommendedPosition(value: unknown): Role | null {
  if (typeof value !== "string") {
    return null;
  }

  return POSITION_TO_ROLE[value.trim().toUpperCase()] ?? null;
}

export function sanitizeRecommendedPositions(
  response: unknown,
): LcuRecommendedPositions {
  if (!isRecord(response)) {
    throw new LcuRequestError("INVALID_RESPONSE");
  }

  const sanitized: Record<string, readonly Role[]> = {};

  Object.entries(response).forEach(([championId, value]) => {
    if (!/^\d+$/.test(championId) || !isRecord(value)) {
      return;
    }

    const positions = value.recommendedPositions;

    if (!Array.isArray(positions)) {
      return;
    }

    const roles = [...new Set(
      positions
        .map(normalizeRecommendedPosition)
        .filter((role): role is Role => role !== null),
    )];

    if (roles.length > 0) {
      sanitized[championId] = roles;
    }
  });

  return sanitized;
}

export async function requestRecommendedPositions(
  connection: LcuConnectionInfo,
  request: LcuRequester,
): Promise<LcuRecommendedPositions> {
  const response = await request<unknown>(
    connection,
    RECOMMENDED_POSITIONS_PATH,
  );

  return sanitizeRecommendedPositions(response);
}
