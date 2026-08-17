import type { Role } from "./champion";

export type LcuFailureReason =
  | "LEAGUE_CLIENT_NOT_FOUND"
  | "LOCKFILE_NOT_FOUND"
  | "CONNECTION_FAILED"
  | "AUTHENTICATION_FAILED"
  | "UNSUPPORTED_PLATFORM"
  | "UNKNOWN_ERROR";

export type LcuStatusResponse = Readonly<{
  connected: boolean;
  clientRunning: boolean;
  reason?: LcuFailureReason;
}>;

export type LcuTeamMember = Readonly<{
  cellId: number;
  championId: number;
  championPickIntent?: number;
  assignedPosition?: string;
  team?: number;
}>;

export type LcuChampSelectAction = Readonly<{
  actorCellId?: number;
  championId?: number;
  completed?: boolean;
  duration?: number;
  id?: number;
  isAllyAction?: boolean;
  isInProgress?: boolean;
  pickTurn?: number;
  type?: string;
}>;

export type LcuChampSelectSession = Readonly<{
  localPlayerCellId?: number;
  myTeam: readonly LcuTeamMember[];
  theirTeam: readonly LcuTeamMember[];
  actions: readonly (readonly LcuChampSelectAction[])[];
  bans?: unknown;
  timer?: unknown;
}>;

export type LcuRecommendedPositions = Readonly<
  Record<string, readonly Role[]>
>;

export type LcuChampSelectResponse = Readonly<{
  connected: boolean;
  inChampSelect: boolean;
  session: LcuChampSelectSession | null;
  recommendedPositions?: LcuRecommendedPositions;
  reason?: LcuFailureReason;
}>;
