import fixtureData from "../../tests/fixtures/metaRolePrototype.fixture.json";

import type { MetaRoleDataset, MetaRoleEntry } from "../../types/metaRole";

const dataset = fixtureData as MetaRoleDataset;

export function getPrototypeMetaRoleEntry(
  championId: string,
): MetaRoleEntry | undefined {
  return dataset.champions[championId];
}

export function getPrototypeMetaRoleDataset(): MetaRoleDataset {
  return dataset;
}
