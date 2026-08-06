import { LcuRequestError } from "./lcuError";

import type { LcuConnectionInfo } from "./types";
import type { LcuChampSelectSession } from "../../types/lcu";

export const CHAMP_SELECT_PATH = "/lol-champ-select/v1/session";

export type LcuRequester = <T>(
  connection: LcuConnectionInfo,
  path: string,
) => Promise<T>;

function sanitizeSession(session: unknown): LcuChampSelectSession {
  if (!session || typeof session !== "object") {
    throw new LcuRequestError("INVALID_RESPONSE");
  }

  const source = session as Record<string, unknown>;

  return {
    localPlayerCellId: source.localPlayerCellId,
    myTeam: source.myTeam,
    theirTeam: source.theirTeam,
    actions: source.actions,
    bans: source.bans,
    timer: source.timer,
  };
}

export async function requestChampSelectSession(
  connection: LcuConnectionInfo,
  request: LcuRequester,
): Promise<LcuChampSelectSession | null> {
  try {
    const session = await request<unknown>(connection, CHAMP_SELECT_PATH);

    return sanitizeSession(session);
  } catch (error) {
    if (error instanceof LcuRequestError && error.code === "NOT_FOUND") {
      return null;
    }

    throw error;
  }
}
