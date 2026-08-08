import { LcuRequestError } from "./lcuError";

import type { LcuConnectionInfo } from "./types";
import type {
  LcuChampSelectAction,
  LcuChampSelectSession,
  LcuTeamMember,
} from "../../types/lcu";

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
    localPlayerCellId: getNumber(source.localPlayerCellId),
    myTeam: sanitizeTeam(source.myTeam),
    theirTeam: sanitizeTeam(source.theirTeam),
    actions: sanitizeActions(source.actions),
    bans: source.bans,
    timer: source.timer,
  };
}

function getNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : undefined;
}

function getBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function sanitizeAction(action: unknown): LcuChampSelectAction | null {
  if (!action || typeof action !== "object") {
    return null;
  }

  const source = action as Record<string, unknown>;
  const sanitized: LcuChampSelectAction = {
    ...(getNumber(source.actorCellId) !== undefined && {
      actorCellId: getNumber(source.actorCellId),
    }),
    ...(getNumber(source.championId) !== undefined && {
      championId: getNumber(source.championId),
    }),
    ...(getBoolean(source.completed) !== undefined && {
      completed: getBoolean(source.completed),
    }),
    ...(getNumber(source.duration) !== undefined && {
      duration: getNumber(source.duration),
    }),
    ...(getNumber(source.id) !== undefined && {
      id: getNumber(source.id),
    }),
    ...(getBoolean(source.isAllyAction) !== undefined && {
      isAllyAction: getBoolean(source.isAllyAction),
    }),
    ...(getBoolean(source.isInProgress) !== undefined && {
      isInProgress: getBoolean(source.isInProgress),
    }),
    ...(getNumber(source.pickTurn) !== undefined && {
      pickTurn: getNumber(source.pickTurn),
    }),
    ...(typeof source.type === "string" && {
      type: source.type,
    }),
  };

  return sanitized;
}

function sanitizeActions(
  actions: unknown,
): LcuChampSelectAction[][] {
  if (!Array.isArray(actions)) {
    return [];
  }

  return actions.map((group) => {
    if (!Array.isArray(group)) {
      return [];
    }

    return group.flatMap((action) => {
      const sanitized = sanitizeAction(action);
      return sanitized ? [sanitized] : [];
    });
  });
}

function sanitizeTeam(team: unknown): LcuTeamMember[] {
  if (!Array.isArray(team)) {
    return [];
  }

  return team.flatMap((member) => {
    if (!member || typeof member !== "object") {
      return [];
    }

    const source = member as Record<string, unknown>;
    const cellId = getNumber(source.cellId);
    const championId = getNumber(source.championId);

    if (cellId === undefined || championId === undefined) {
      return [];
    }

    const sanitized: LcuTeamMember = {
      cellId,
      championId,
      ...(getNumber(source.championPickIntent) !== undefined && {
        championPickIntent: getNumber(source.championPickIntent),
      }),
      ...(typeof source.assignedPosition === "string" && {
        assignedPosition: source.assignedPosition,
      }),
      ...(getNumber(source.team) !== undefined && {
        team: getNumber(source.team),
      }),
    };

    return [sanitized];
  });
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
