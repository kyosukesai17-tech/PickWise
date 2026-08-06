import { getChampionDetail } from "./analyzeTraits";
import { ROLE_INDEX } from "./role";
import { TRAITS } from "../src/constants/traits";

import type { Champion, Role } from "../types/champion";

export type AllyCompositionType =
  | "DIVE"
  | "POKE"
  | "FRONT_TO_BACK"
  | "CATCH"
  | "SIDE_LANE";

export type AllyCompositionAnalysis = Readonly<{
  types: AllyCompositionType[];
  selectedCount: number;
}>;

const MIN_COMPOSITION_SAMPLE_SIZE = 2;
const MIN_FRONT_TO_BACK_SAMPLE_SIZE = 3;

export function analyzeAllyComposition(
  allyTeam: (Champion | null)[],
  selectedRole: Role,
): AllyCompositionAnalysis {
  const selectedRoleIndex = ROLE_INDEX[selectedRole];
  let selectedCount = 0;
  let assassinCount = 0;
  let engageCount = 0;
  let mobilityCount = 0;
  let pokeCount = 0;
  let frontlineCount = 0;
  let carryCount = 0;
  let catchCount = 0;
  let strongPickerCount = 0;
  let strongSideLanerCount = 0;
  let roamTotal = 0;
  let roamCount = 0;
  let sideLaneTotal = 0;
  let sideLaneCount = 0;

  allyTeam.forEach((champion, index) => {
    if (!champion || index === selectedRoleIndex) {
      return;
    }

    const detail = getChampionDetail(champion.id);

    if (!detail) {
      return;
    }

    selectedCount++;

    if (detail.archetypes.includes("ASSASSIN")) assassinCount++;
    if (detail.traits.includes(TRAITS.ENGAGE)) engageCount++;
    if (detail.traits.includes(TRAITS.MOBILITY)) mobilityCount++;
    if (detail.traits.includes(TRAITS.POKE)) pokeCount++;
    if (detail.archetypes.includes("FRONTLINE")) frontlineCount++;
    if (detail.archetypes.includes("CARRY")) carryCount++;
    if (detail.archetypes.includes("CATCH")) catchCount++;

    const draftMetrics = detail.draftMetrics;

    if (!draftMetrics) {
      return;
    }

    roamTotal += draftMetrics.roam;
    roamCount++;
    sideLaneTotal += draftMetrics.sideLane;
    sideLaneCount++;

    if (draftMetrics.pickPotential === 5) strongPickerCount++;
    if (draftMetrics.sideLane === 5) strongSideLanerCount++;
  });

  if (selectedCount < MIN_COMPOSITION_SAMPLE_SIZE) {
    return { types: [], selectedCount };
  }

  const averageRoam = roamCount > 0 ? roamTotal / roamCount : null;
  const averageSideLane =
    sideLaneCount > 0 ? sideLaneTotal / sideLaneCount : null;
  const types: AllyCompositionType[] = [];

  if (
    assassinCount + engageCount >= 2 &&
    ((averageRoam !== null && averageRoam >= 3.5) ||
      mobilityCount >= 2)
  ) {
    types.push("DIVE");
  }

  if (pokeCount >= 2) {
    types.push("POKE");
  }

  if (
    selectedCount >= MIN_FRONT_TO_BACK_SAMPLE_SIZE &&
    frontlineCount >= 1 &&
    carryCount >= 1
  ) {
    types.push("FRONT_TO_BACK");
  }

  if (catchCount >= 2 || strongPickerCount >= 2) {
    types.push("CATCH");
  }

  if (
    strongSideLanerCount >= 1 ||
    (averageSideLane !== null && averageSideLane >= 4)
  ) {
    types.push("SIDE_LANE");
  }

  return { types, selectedCount };
}
