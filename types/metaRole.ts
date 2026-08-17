import type { Role } from "./champion";

export type RolePickShare = Partial<Record<Role, number>>;

export type MetaRoleEntry = Readonly<{
  rolePickShare: RolePickShare;
}>;

export type MetaRoleDataset = Readonly<{
  metadata: Readonly<{
    dataKind: "SYNTHETIC_TEST_FIXTURE" | "PUBLIC_STATISTICS";
    patch: string;
    region: string;
    rankBand: string;
    retrievedAt: string | null;
    createdAt: string;
    source: string;
    notForProduction: boolean;
  }>;
  champions: Readonly<Record<string, MetaRoleEntry>>;
}>;

export type MetaRoleWeights = Readonly<{
  suitability: number;
  meta: number;
}>;
