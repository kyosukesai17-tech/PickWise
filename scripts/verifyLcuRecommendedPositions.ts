import assert from "node:assert/strict";

import { getChampions } from "../lib/getChampions";
import { inferEnemyRoles } from "../lib/lcu/inferEnemyRoles";
import {
  requestRecommendedPositions,
  sanitizeRecommendedPositions,
} from "../lib/lcu/recommendedPositionsCore";

import type { Champion, Role } from "../types/champion";
import type { LcuRecommendedPositions } from "../types/lcu";

const championsById = new Map(
  getChampions().map((champion) => [champion.id, champion]),
);

function champions(ids: readonly string[]): Champion[] {
  return ids.map((id) => {
    const champion = championsById.get(id);
    assert.ok(champion, `Missing champion fixture: ${id}`);
    return champion;
  });
}

function roleMap(
  ids: readonly string[],
  recommendedPositions?: LcuRecommendedPositions,
  bonus?: number,
): Record<string, Role> {
  return Object.fromEntries(
    inferEnemyRoles(champions(ids), recommendedPositions, bonus)
      .map(({ champion, role }) => [champion.id, role]),
  );
}

const recommendedPositions = sanitizeRecommendedPositions({
  245: { recommendedPositions: ["JUNGLE", "middle", "UNKNOWN"] },
  80: { recommendedPositions: ["JUNGLE", "MIDDLE", "TOP", "UTILITY"] },
  79: { recommendedPositions: ["JUNGLE", "MIDDLE", "TOP"] },
  78: { recommendedPositions: ["JUNGLE", "TOP", "UTILITY"] },
  147: { recommendedPositions: ["BOTTOM", "UTILITY"] },
  99: { recommendedPositions: ["MIDDLE", "UTILITY"] },
  50: { recommendedPositions: ["BOTTOM", "MIDDLE", "UTILITY"] },
  63: { recommendedPositions: ["BOTTOM", "MIDDLE", "UTILITY"] },
  25: { recommendedPositions: ["UTILITY"] },
  67: { recommendedPositions: ["BOTTOM", "TOP"] },
});

assert.deepEqual(recommendedPositions["245"], ["JG", "MID"]);
assert.equal(recommendedPositions["not-a-champion"], undefined);

const regressionTeam = ["Urgot", "Ekko", "Pantheon", "Varus", "Rakan"];
const currentRegression = roleMap(regressionTeam);
const regressionComparisons = [1, 2, 3].map((bonus) => ({
  bonus,
  roles: roleMap(regressionTeam, recommendedPositions, bonus),
}));

assert.equal(currentRegression.Ekko, "MID");
assert.equal(currentRegression.Pantheon, "JG");
regressionComparisons.forEach(({ roles }) => {
  assert.equal(roles.Ekko, "MID");
  assert.equal(roles.Pantheon, "JG");
});

const standardTeam = ["Ornn", "LeeSin", "Ahri", "Jinx", "Morgana"];
const standardRoles = roleMap(standardTeam, recommendedPositions);
assert.equal(standardRoles.Morgana, "SUP");

const vayneTeam = ["Malphite", "Amumu", "Orianna", "Vayne", "Lulu"];
const vayneRoles = roleMap(vayneTeam, recommendedPositions);
assert.equal(vayneRoles.Vayne, "ADC");

const seraphineTeam = ["Ornn", "LeeSin", "Ahri", "Seraphine", "Nautilus"];
const seraphineRoles = roleMap(seraphineTeam, recommendedPositions);
assert.equal(seraphineRoles.Seraphine, "ADC");

const partialRoles = roleMap(["Morgana", "Vayne"], recommendedPositions);
assert.equal(partialRoles.Morgana, "SUP");
assert.equal(partialRoles.Vayne, "ADC");

const noLcuTeam = ["Gragas", "Poppy", "Lux", "Swain", "Brand"];
assert.deepEqual(roleMap(noLcuTeam, undefined), roleMap(noLcuTeam, {}));

const comparisonTeams = [
  ["Gragas", "Poppy", "Lux", "Swain", "Brand"],
  ["Poppy", "Ekko", "Lux", "Seraphine", "Morgana"],
  ["Vayne", "Gragas", "Pantheon", "Swain", "Brand"],
] as const;
const bonusComparisons = comparisonTeams.map((team) => ({
  team,
  current: roleMap(team),
  bonuses: [1, 2, 3].map((bonus) => ({
    bonus,
    roles: roleMap(team, recommendedPositions, bonus),
  })),
}));

const flexChampionIds = [
  "Ekko",
  "Pantheon",
  "Gragas",
  "Poppy",
  "Seraphine",
  "Lux",
  "Swain",
  "Brand",
  "Morgana",
  "Vayne",
];

function combinations<T>(values: readonly T[], size: number): T[][] {
  if (size === 0) {
    return [[]];
  }

  return values.flatMap((value, index) => combinations(
    values.slice(index + 1),
    size - 1,
  ).map((rest) => [value, ...rest]));
}

const flexComparisonSummary = [1, 2, 3].map((bonus) => {
  const changedTeams = combinations(flexChampionIds, 5).filter((team) => (
    JSON.stringify(roleMap(team))
      !== JSON.stringify(roleMap(team, recommendedPositions, bonus))
  ));

  return {
    bonus,
    changedTeamCount: changedTeams.length,
    examples: changedTeams.slice(0, 3).map((team) => ({
      team,
      current: roleMap(team),
      recommended: roleMap(team, recommendedPositions, bonus),
    })),
  };
});

async function verifyRequestSanitization() {
  let requestedPath = "";
  const requested = await requestRecommendedPositions(
  {
    protocol: "https",
    address: "127.0.0.1",
    port: 1234,
    username: "riot",
    password: "test",
  },
  async <T>(_connection: unknown, path: string): Promise<T> => {
    requestedPath = path;
    return {
      25: { recommendedPositions: ["UTILITY"] },
      ignored: { recommendedPositions: ["TOP"] },
    } as T;
  },
  );

  assert.equal(requestedPath, "/lol-perks/v1/recommended-champion-positions");
  assert.deepEqual(requested, { 25: ["SUP"] });
}

verifyRequestSanitization().then(() => {
  console.log(JSON.stringify({
    regression: {
      current: currentRegression,
      comparisons: regressionComparisons,
    },
    representativeCases: {
      morgana: standardRoles,
      vayne: vayneRoles,
      seraphine: seraphineRoles,
      partial: partialRoles,
    },
    bonusComparisons,
    flexComparisonSummary,
    fallbackMatches: true,
    unknownPositionsIgnored: true,
  }, null, 2));
});
