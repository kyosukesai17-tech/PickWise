import { findLeagueClient } from "../../../../lib/lcu/findLeagueClient";
import { getChampSelectSession } from "../../../../lib/lcu/getChampSelectSession";
import {
  getRecommendedPositions,
} from "../../../../lib/lcu/getRecommendedPositions";
import {
  getLcuFailureReason,
  jsonNoStore,
} from "../../../../lib/lcu/response";

import type { LcuChampSelectResponse } from "../../../../types/lcu";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(): Promise<Response> {
  const detection = await findLeagueClient();

  if (!detection.connection) {
    return jsonNoStore({
      connected: false,
      inChampSelect: false,
      session: null,
      reason: detection.reason,
    } satisfies LcuChampSelectResponse);
  }

  try {
    const [session, recommendedPositions] = await Promise.all([
      getChampSelectSession(detection.connection),
      getRecommendedPositions(detection.connection),
    ]);

    return jsonNoStore({
      connected: true,
      inChampSelect: session !== null,
      session,
      ...(recommendedPositions && { recommendedPositions }),
    } satisfies LcuChampSelectResponse);
  } catch (error) {
    return jsonNoStore({
      connected: false,
      inChampSelect: false,
      session: null,
      reason: getLcuFailureReason(error),
    } satisfies LcuChampSelectResponse);
  }
}
