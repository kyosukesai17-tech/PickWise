import type {
  DraftSide,
  DraftTurn,
  PlayerTeamSide,
} from "../types/draftPhase";

export const STANDARD_PICK_TURN_COUNT = 10;

export const STANDARD_SOLO_QUEUE_PICK_ORDER = [
  "BLUE",
  "RED",
  "RED",
  "BLUE",
  "BLUE",
  "RED",
  "RED",
  "BLUE",
  "BLUE",
  "RED",
] as const satisfies readonly PlayerTeamSide[];

export function clampDraftTurn(turn: number): number {
  return Math.min(
    STANDARD_PICK_TURN_COUNT,
    Math.max(1, turn),
  );
}

export function getDraftTurn(
  currentTurn: number,
  playerTeamSide: PlayerTeamSide,
): DraftTurn {
  const order = clampDraftTurn(currentTurn);
  const actingTeamSide = STANDARD_SOLO_QUEUE_PICK_ORDER[order - 1];
  const side: DraftSide = actingTeamSide === playerTeamSide
    ? "ALLY"
    : "ENEMY";

  return {
    order,
    side,
    action: "PICK",
  };
}

export function getPreviousDraftTurn(currentTurn: number): number {
  return clampDraftTurn(currentTurn - 1);
}

export function getNextDraftTurn(currentTurn: number): number {
  return clampDraftTurn(currentTurn + 1);
}
