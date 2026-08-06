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

export type LcuChampSelectSession = Readonly<{
  localPlayerCellId?: unknown;
  myTeam?: unknown;
  theirTeam?: unknown;
  actions?: unknown;
  bans?: unknown;
  timer?: unknown;
}>;

export type LcuChampSelectResponse = Readonly<{
  connected: boolean;
  inChampSelect: boolean;
  session: LcuChampSelectSession | null;
  reason?: LcuFailureReason;
}>;
