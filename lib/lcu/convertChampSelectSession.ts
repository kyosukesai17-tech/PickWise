import { getChampions } from "../getChampions";

import type { Champion } from "../../types/champion";
import type { LcuChampSelectSession } from "../../types/lcu";

const TEAM_SIZE = 5;
const PICK_TURN_COUNT = 10;

export type ConvertedDraftState = Readonly<{
  allyTeam: (Champion | null)[];
  enemyTeam: (Champion | null)[];
  currentTurn: number | null;
}>;

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function getChampionId(value: unknown): number | null {
  if (!isRecord(value)) {
    return null;
  }

  const championId = value.championId;

  return typeof championId === "number"
    && Number.isInteger(championId)
    && championId > 0
    ? championId
    : null;
}

function convertTeam(
  team: unknown,
  championsByKey: ReadonlyMap<number, Champion>,
): (Champion | null)[] {
  const members = Array.isArray(team) ? team.slice(0, TEAM_SIZE) : [];
  const converted = members.map((member) => {
    const championId = getChampionId(member);

    return championId === null
      ? null
      : championsByKey.get(championId) ?? null;
  });

  return [
    ...converted,
    ...Array<Champion | null>(TEAM_SIZE - converted.length).fill(null),
  ];
}

function getCurrentPickTurn(actions: unknown): number | null {
  if (!Array.isArray(actions)) {
    return null;
  }

  const pickActions = actions
    .flatMap((actionGroup) => Array.isArray(actionGroup) ? actionGroup : [])
    .filter((action) => isRecord(action) && action.type === "pick");

  if (pickActions.length === 0) {
    return null;
  }

  const activePickIndex = pickActions.findIndex(
    (action) => action.isInProgress === true && action.completed !== true,
  );

  if (activePickIndex >= 0) {
    return Math.min(activePickIndex + 1, PICK_TURN_COUNT);
  }

  const completedPickCount = pickActions.filter(
    (action) => action.completed === true,
  ).length;

  return Math.min(completedPickCount + 1, PICK_TURN_COUNT);
}

export function convertChampSelectSession(
  session: LcuChampSelectSession,
): ConvertedDraftState {
  const championsByKey = new Map(
    getChampions().map((champion) => [Number(champion.key), champion]),
  );

  return {
    allyTeam: convertTeam(session.myTeam, championsByKey),
    enemyTeam: convertTeam(session.theirTeam, championsByKey),
    currentTurn: getCurrentPickTurn(session.actions),
  };
}
