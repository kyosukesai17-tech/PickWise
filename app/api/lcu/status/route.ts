import { findLeagueClient } from "../../../../lib/lcu/findLeagueClient";
import { lcuRequest } from "../../../../lib/lcu/lcuRequest";
import {
  getLcuFailureReason,
  jsonNoStore,
} from "../../../../lib/lcu/response";

import type { LcuStatusResponse } from "../../../../types/lcu";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const CONNECTION_CHECK_PATH = "/lol-summoner/v1/current-summoner";

export async function GET(): Promise<Response> {
  const detection = await findLeagueClient();

  if (!detection.connection) {
    return jsonNoStore({
      connected: false,
      clientRunning: detection.clientRunning,
      reason: detection.reason,
    } satisfies LcuStatusResponse);
  }

  try {
    await lcuRequest<unknown>(detection.connection, CONNECTION_CHECK_PATH);

    return jsonNoStore({
      connected: true,
      clientRunning: true,
    } satisfies LcuStatusResponse);
  } catch (error) {
    return jsonNoStore({
      connected: false,
      clientRunning: true,
      reason: getLcuFailureReason(error),
    } satisfies LcuStatusResponse);
  }
}
