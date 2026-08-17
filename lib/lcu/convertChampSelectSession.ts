import { getChampions } from "../getChampions";
import { ROLE_INDEX } from "../role";
import {
  inferChampionRoles,
  inferEnemyRoles,
  ROLE_ORDER,
} from "./inferEnemyRoles";
import { normalizeAssignedPosition } from "./normalizeAssignedPosition";

import type { Champion } from "../../types/champion";
import type {
  LcuChampSelectSession,
  LcuRecommendedPositions,
  LcuTeamMember,
} from "../../types/lcu";

const TEAM_SIZE = 5;
const PICK_TURN_COUNT = 10;

export type ConvertedDraftState = Readonly<{
  allyTeam: (Champion | null)[];
  enemyTeam: (Champion | null)[];
  allyRoleSources: RoleResolutionSource[];
  enemyRoleSources: RoleResolutionSource[];
  currentTurn: number | null;
}>;

export type RoleResolutionSource = "LCU" | "INFERRED" | "UNKNOWN";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function getChampion(
  member: LcuTeamMember,
  championsByKey: ReadonlyMap<number, Champion>,
): Champion | null {
  return Number.isInteger(member.championId) && member.championId > 0
    ? championsByKey.get(member.championId) ?? null
    : null;
}

function createEmptyTeam(): (Champion | null)[] {
  return Array<Champion | null>(TEAM_SIZE).fill(null);
}

function createUnknownSources(): RoleResolutionSource[] {
  return Array<RoleResolutionSource>(TEAM_SIZE).fill("UNKNOWN");
}

function placeAssignments(
  assignments: ReturnType<typeof inferChampionRoles>,
  team: (Champion | null)[],
  sources: RoleResolutionSource[],
) {
  assignments.forEach(({ champion, role }) => {
    const roleIndex = ROLE_INDEX[role];

    team[roleIndex] = champion;
    sources[roleIndex] = "INFERRED";
  });
}

function resolveAllyTeam(
  members: readonly LcuTeamMember[],
  championsByKey: ReadonlyMap<number, Champion>,
) {
  const team = createEmptyTeam();
  const sources = createUnknownSources();
  const remainingChampions: Champion[] = [];

  members.slice(0, TEAM_SIZE).forEach((member) => {
    const champion = getChampion(member, championsByKey);

    if (!champion) {
      return;
    }

    const role = normalizeAssignedPosition(member.assignedPosition);

    if (role && team[ROLE_INDEX[role]] === null) {
      team[ROLE_INDEX[role]] = champion;
      sources[ROLE_INDEX[role]] = "LCU";
      return;
    }

    remainingChampions.push(champion);
  });

  const availableRoles = ROLE_ORDER.filter(
    (role) => team[ROLE_INDEX[role]] === null,
  );

  placeAssignments(
    inferChampionRoles(remainingChampions, availableRoles),
    team,
    sources,
  );

  return { team, sources };
}

function resolveEnemyTeam(
  members: readonly LcuTeamMember[],
  championsByKey: ReadonlyMap<number, Champion>,
  recommendedPositions?: LcuRecommendedPositions,
) {
  const team = createEmptyTeam();
  const sources = createUnknownSources();
  const champions = members
    .slice(0, TEAM_SIZE)
    .map((member) => getChampion(member, championsByKey))
    .filter((champion): champion is Champion => champion !== null);

  placeAssignments(
    inferEnemyRoles(champions, recommendedPositions),
    team,
    sources,
  );

  return { team, sources };
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
  recommendedPositions?: LcuRecommendedPositions,
): ConvertedDraftState {
  const championsByKey = new Map(
    getChampions().map((champion) => [Number(champion.key), champion]),
  );
  const allyResolution = resolveAllyTeam(session.myTeam, championsByKey);
  const enemyResolution = resolveEnemyTeam(
    session.theirTeam,
    championsByKey,
    recommendedPositions,
  );

  return {
    allyTeam: allyResolution.team,
    enemyTeam: enemyResolution.team,
    allyRoleSources: allyResolution.sources,
    enemyRoleSources: enemyResolution.sources,
    currentTurn: getCurrentPickTurn(session.actions),
  };
}
