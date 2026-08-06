export type DraftSide = "ALLY" | "ENEMY";

export type DraftActionType = "PICK" | "BAN";

export type DraftTurn = Readonly<{
  order: number;
  side: DraftSide;
  action: DraftActionType;
  slot?: number;
}>;

export type DraftPhaseMode =
  | "MANUAL"
  | "STANDARD_SOLO_QUEUE";

export type DraftPhaseState = Readonly<{
  mode: DraftPhaseMode;
  currentTurn: number;
}>;

export type PlayerTeamSide = "BLUE" | "RED";
