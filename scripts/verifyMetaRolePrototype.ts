import assert from "node:assert/strict";

import { getChampions } from "../lib/getChampions";
import { inferEnemyRoles } from "../lib/lcu/inferEnemyRoles";
import {
  inferRolesWithPrototypeMeta,
  META_ROLE_WEIGHT_PRESETS,
} from "../lib/prototype/inferRolesWithMeta";
import { getPrototypeMetaRoleDataset } from "../lib/prototype/metaRoleData";

import type { Champion } from "../types/champion";

const championsById = new Map(
  getChampions().map((champion) => [champion.id, champion]),
);

function getTeam(ids: readonly string[]): Champion[] {
  return ids.map((id) => {
    const champion = championsById.get(id);

    assert.ok(champion, `Champion not found: ${id}`);
    return champion;
  });
}

function roleMap(
  assignments: readonly { champion: Champion; role: string }[],
): Record<string, string> {
  return Object.fromEntries(
    assignments.map(({ champion, role }) => [champion.id, role]),
  );
}

const fixture = getPrototypeMetaRoleDataset();
assert.equal(fixture.metadata.dataKind, "SYNTHETIC_TEST_FIXTURE");
assert.equal(fixture.metadata.notForProduction, true);
assert.equal(Object.keys(fixture.champions).length, 10);

for (const [championId, entry] of Object.entries(fixture.champions)) {
  const shares = Object.values(entry.rolePickShare);
  assert.ok(shares.every((share) => share >= 0 && share <= 1), championId);
  assert.ok(Math.abs(shares.reduce((sum, share) => sum + share, 0) - 1) < 1e-9, championId);
}

const regressionTeam = getTeam([
  "Urgot",
  "Ekko",
  "Pantheon",
  "Varus",
  "Rakan",
]);
const currentRoles = roleMap(inferEnemyRoles(regressionTeam));
assert.equal(currentRoles.Urgot, "TOP");
assert.equal(currentRoles.Ekko, "MID");
assert.equal(currentRoles.Pantheon, "JG");
assert.equal(currentRoles.Varus, "ADC");
assert.equal(currentRoles.Rakan, "SUP");

for (const [name, weights] of Object.entries(META_ROLE_WEIGHT_PRESETS)) {
  const inferred = roleMap(inferRolesWithPrototypeMeta(regressionTeam, weights));
  assert.equal(inferred.Ekko, "JG", name);
  assert.equal(inferred.Pantheon, "MID", name);
}

const noMetaTeam = getTeam(["Ornn", "LeeSin", "Ahri", "Jinx", "Lulu"]);
const currentNoMeta = roleMap(inferEnemyRoles(noMetaTeam));

for (const weights of Object.values(META_ROLE_WEIGHT_PRESETS)) {
  assert.deepEqual(
    roleMap(inferRolesWithPrototypeMeta(noMetaTeam, weights)),
    currentNoMeta,
  );
}

const representativeTeams = {
  topJungle: getTeam(["Gragas", "Poppy", "Ahri", "Jinx", "Lulu"]),
  multiFlex: getTeam(["Gragas", "Brand", "Lux", "Vayne", "Morgana"]),
  botFlex: getTeam(["Ornn", "LeeSin", "Swain", "Seraphine", "Morgana"]),
};

console.log(JSON.stringify({
  fixture: fixture.metadata,
  regression: {
    current: currentRoles,
    prototype: Object.fromEntries(
      Object.entries(META_ROLE_WEIGHT_PRESETS).map(([name, weights]) => [
        name,
        roleMap(inferRolesWithPrototypeMeta(regressionTeam, weights)),
      ]),
    ),
  },
  representative: Object.fromEntries(
    Object.entries(representativeTeams).map(([teamName, team]) => [
      teamName,
      {
        current: roleMap(inferEnemyRoles(team)),
        prototype: Object.fromEntries(
          Object.entries(META_ROLE_WEIGHT_PRESETS).map(([name, weights]) => [
            name,
            roleMap(inferRolesWithPrototypeMeta(team, weights)),
          ]),
        ),
      },
    ]),
  ),
}, null, 2));
