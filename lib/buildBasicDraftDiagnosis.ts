import type { TeamAnalysis } from "./analyzeTeam";
import type { DraftDiagnosisItem } from "../types/draftDiagnosis";

export function buildBasicDraftDiagnosis(
  analysis: TeamAnalysis,
): DraftDiagnosisItem[] {
  return [
    analysis.needTank
      ? {
          id: "frontline",
          label: "フロントライン不足",
          description:
            "前衛として攻撃を受けられるチャンピオンが不足しています",
          status: "WARNING",
        }
      : {
          id: "frontline",
          label: "フロントラインは十分",
          description: "前衛役を担える構成です",
          status: "GOOD",
        },
    analysis.needAD
      ? {
          id: "ad-damage",
          label: "ADダメージ不足",
          description:
            "物理ダメージを出せるチャンピオンが不足しています",
          status: "WARNING",
        }
      : {
          id: "ad-damage",
          label: "ADダメージは十分",
          description: "物理ダメージ源を確保できています",
          status: "GOOD",
        },
    analysis.needAP
      ? {
          id: "ap-damage",
          label: "APダメージ不足",
          description:
            "魔法ダメージを出せるチャンピオンが不足しています",
          status: "WARNING",
        }
      : {
          id: "ap-damage",
          label: "APダメージは十分",
          description: "魔法ダメージ源を確保できています",
          status: "GOOD",
        },
    analysis.needCC
      ? {
          id: "cc",
          label: "CC不足",
          description: "敵の行動を止める手段が不足しています",
          status: "WARNING",
        }
      : {
          id: "cc",
          label: "CCは十分",
          description: "敵を止める手段を確保できています",
          status: "GOOD",
        },
  ];
}
