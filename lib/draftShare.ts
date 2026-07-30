import { getChampions } from "./getChampions";

import type {
  Champion,
  Role,
} from "../types/champion";

const SHARE_CODE_PREFIX = "PW1:";

const ROLES: readonly Role[] = [
  "TOP",
  "JG",
  "MID",
  "ADC",
  "SUP",
];

type ChampionSlot =
  string | null;

type EncodedDraft = {
  version: 1;
  selectedRole: Role;
  allyTeam: ChampionSlot[];
  enemyTeam: ChampionSlot[];
  allyBans: ChampionSlot[];
  enemyBans: ChampionSlot[];
};

export type DraftSnapshot = {
  selectedRole: Role;
  allyTeam: (Champion | null)[];
  enemyTeam: (Champion | null)[];
  allyBans: (Champion | null)[];
  enemyBans: (Champion | null)[];
};

export function createDraftShareCode(
  draft: DraftSnapshot,
): string {
  const encodedDraft: EncodedDraft = {
    version: 1,
    selectedRole: draft.selectedRole,
    allyTeam: getChampionIds(
      draft.allyTeam,
    ),
    enemyTeam: getChampionIds(
      draft.enemyTeam,
    ),
    allyBans: getChampionIds(
      draft.allyBans,
    ),
    enemyBans: getChampionIds(
      draft.enemyBans,
    ),
  };

  const json =
    JSON.stringify(encodedDraft);

  return (
    SHARE_CODE_PREFIX +
    encodeBase64(json)
  );
}

export function parseDraftShareCode(
  shareCode: string,
): DraftSnapshot {
  const normalizedCode =
    shareCode.trim();

  if (
    !normalizedCode.startsWith(
      SHARE_CODE_PREFIX,
    )
  ) {
    throw new Error(
      "共有コードの形式が正しくありません。",
    );
  }

  const encodedValue =
    normalizedCode.slice(
      SHARE_CODE_PREFIX.length,
    );

  let parsedValue: unknown;

  try {
    const json =
      decodeBase64(encodedValue);

    parsedValue =
      JSON.parse(json);
  } catch {
    throw new Error(
      "共有コードを読み取れませんでした。",
    );
  }

  if (
    !isEncodedDraft(parsedValue)
  ) {
    throw new Error(
      "共有コードの内容が正しくありません。",
    );
  }

  const allChampionIds = [
    ...parsedValue.allyTeam,
    ...parsedValue.enemyTeam,
    ...parsedValue.allyBans,
    ...parsedValue.enemyBans,
  ].filter(
    (
      championId,
    ): championId is string =>
      championId !== null,
  );

  const uniqueChampionIds =
    new Set(allChampionIds);

  if (
    uniqueChampionIds.size !==
    allChampionIds.length
  ) {
    throw new Error(
      "同じチャンピオンが複数登録されています。",
    );
  }

  const championMap =
    new Map(
      getChampions().map(
        (champion) => [
          champion.id,
          champion,
        ],
      ),
    );

  for (
    const championId
    of uniqueChampionIds
  ) {
    if (
      !championMap.has(
        championId,
      )
    ) {
      throw new Error(
        `チャンピオン「${championId}」を確認できませんでした。`,
      );
    }
  }

  return {
    selectedRole:
      parsedValue.selectedRole,

    allyTeam: restoreTeam(
      parsedValue.allyTeam,
      championMap,
    ),

    enemyTeam: restoreTeam(
      parsedValue.enemyTeam,
      championMap,
    ),

    allyBans: restoreTeam(
      parsedValue.allyBans,
      championMap,
    ),

    enemyBans: restoreTeam(
      parsedValue.enemyBans,
      championMap,
    ),
  };
}

function getChampionIds(
  team: (Champion | null)[],
): ChampionSlot[] {
  return team.map(
    (champion) =>
      champion?.id ?? null,
  );
}

function restoreTeam(
  storedTeam: ChampionSlot[],
  championMap: Map<
    string,
    Champion
  >,
): (Champion | null)[] {
  return storedTeam.map(
    (championId) => {
      if (!championId) {
        return null;
      }

      return (
        championMap.get(
          championId,
        ) ?? null
      );
    },
  );
}

function isEncodedDraft(
  value: unknown,
): value is EncodedDraft {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const draft =
    value as Partial<EncodedDraft>;

  return (
    draft.version === 1 &&
    isRole(
      draft.selectedRole,
    ) &&
    isChampionSlotArray(
      draft.allyTeam,
    ) &&
    isChampionSlotArray(
      draft.enemyTeam,
    ) &&
    isChampionSlotArray(
      draft.allyBans,
    ) &&
    isChampionSlotArray(
      draft.enemyBans,
    )
  );
}

function isRole(
  value: unknown,
): value is Role {
  return (
    typeof value === "string" &&
    ROLES.includes(
      value as Role,
    )
  );
}

function isChampionSlotArray(
  value: unknown,
): value is ChampionSlot[] {
  return (
    Array.isArray(value) &&
    value.length === 5 &&
    value.every(
      (championId) =>
        championId === null ||
        typeof championId ===
          "string",
    )
  );
}

function encodeBase64(
  value: string,
): string {
  const bytes =
    new TextEncoder().encode(
      value,
    );

  let binary = "";

  for (const byte of bytes) {
    binary +=
      String.fromCharCode(byte);
  }

  return window.btoa(binary);
}

function decodeBase64(
  value: string,
): string {
  const binary =
    window.atob(value);

  const bytes =
    Uint8Array.from(
      binary,
      (character) =>
        character.charCodeAt(0),
    );

  return new TextDecoder().decode(
    bytes,
  );
}