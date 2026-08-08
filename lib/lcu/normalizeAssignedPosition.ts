import type { Role } from "../../types/champion";

const ASSIGNED_POSITION_TO_ROLE: Readonly<Record<string, Role>> = {
  top: "TOP",
  jungle: "JG",
  middle: "MID",
  bottom: "ADC",
  utility: "SUP",
};

export function normalizeAssignedPosition(
  assignedPosition: string | undefined,
): Role | null {
  const normalized = assignedPosition?.trim().toLowerCase();

  if (!normalized) {
    return null;
  }

  return ASSIGNED_POSITION_TO_ROLE[normalized] ?? null;
}
