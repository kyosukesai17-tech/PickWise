"use client";

import {
  useEffect,
  useState,
} from "react";

import { getChampions } from "../lib/getChampions";

import type {
  Champion,
  Role,
} from "../types/champion";

import type {
  Dispatch,
  SetStateAction,
} from "react";

const STORAGE_KEY =
  "pickwise:draft:v1";

const roles: Role[] = [
  "TOP",
  "JG",
  "MID",
  "ADC",
  "SUP",
];

type ChampionSlot =
  string | null;

type StoredDraft = {
  selectedRole: Role;
  allyTeam: ChampionSlot[];
  enemyTeam: ChampionSlot[];
  allyBans: ChampionSlot[];
  enemyBans: ChampionSlot[];
};

type UseDraftPersistenceProps = {
  selectedRole: Role;
  allyTeam: (Champion | null)[];
  enemyTeam: (Champion | null)[];
  allyBans: (Champion | null)[];
  enemyBans: (Champion | null)[];

  setSelectedRole: Dispatch<
    SetStateAction<Role>
  >;

  setAllyTeam: Dispatch<
    SetStateAction<(Champion | null)[]>
  >;

  setEnemyTeam: Dispatch<
    SetStateAction<(Champion | null)[]>
  >;

  setAllyBans: Dispatch<
    SetStateAction<(Champion | null)[]>
  >;

  setEnemyBans: Dispatch<
    SetStateAction<(Champion | null)[]>
  >;
};

export function useDraftPersistence({
  selectedRole,
  allyTeam,
  enemyTeam,
  allyBans,
  enemyBans,
  setSelectedRole,
  setAllyTeam,
  setEnemyTeam,
  setAllyBans,
  setEnemyBans,
}: UseDraftPersistenceProps) {
  const [isLoaded, setIsLoaded] =
    useState(false);

  useEffect(() => {
    try {
      const savedDraft =
        window.localStorage.getItem(
          STORAGE_KEY,
        );

      if (!savedDraft) {
        return;
      }

      const parsedDraft: unknown =
        JSON.parse(savedDraft);

      if (!isStoredDraft(parsedDraft)) {
        window.localStorage.removeItem(
          STORAGE_KEY,
        );

        return;
      }

      const champions =
        getChampions();

      const championMap =
        new Map(
          champions.map((champion) => [
            champion.id,
            champion,
          ]),
        );

      setSelectedRole(
        parsedDraft.selectedRole,
      );

      setAllyTeam(
        restoreTeam(
          parsedDraft.allyTeam,
          championMap,
        ),
      );

      setEnemyTeam(
        restoreTeam(
          parsedDraft.enemyTeam,
          championMap,
        ),
      );

      setAllyBans(
        restoreTeam(
          parsedDraft.allyBans,
          championMap,
        ),
      );

      setEnemyBans(
        restoreTeam(
          parsedDraft.enemyBans,
          championMap,
        ),
      );
    } catch {
      window.localStorage.removeItem(
        STORAGE_KEY,
      );
    } finally {
      setIsLoaded(true);
    }
  }, [
    setSelectedRole,
    setAllyTeam,
    setEnemyTeam,
    setAllyBans,
    setEnemyBans,
  ]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const draft: StoredDraft = {
      selectedRole,
      allyTeam: getChampionIds(
        allyTeam,
      ),
      enemyTeam: getChampionIds(
        enemyTeam,
      ),
      allyBans: getChampionIds(
        allyBans,
      ),
      enemyBans: getChampionIds(
        enemyBans,
      ),
    };

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(draft),
      );
    } catch {
      return;
    }
  }, [
    isLoaded,
    selectedRole,
    allyTeam,
    enemyTeam,
    allyBans,
    enemyBans,
  ]);

  return {
    isDraftLoaded: isLoaded,
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
  return Array.from(
    { length: 5 },
    (_, index) => {
      const championId =
        storedTeam[index];

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

function isStoredDraft(
  value: unknown,
): value is StoredDraft {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const draft =
    value as Partial<StoredDraft>;

  return (
    isRole(draft.selectedRole) &&
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
    roles.includes(value as Role)
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