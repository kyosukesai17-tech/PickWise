import type { ObjectiveNeedAnalysis } from "./analyzeObjectiveNeed";
import type { PickPotentialNeedAnalysis } from "./analyzePickPotentialNeed";
import type { RoamNeedAnalysis } from "./analyzeRoamNeed";
import type { SideLaneNeedAnalysis } from "./analyzeSideLaneNeed";
import type { TeamfightNeedAnalysis } from "./analyzeTeamfightNeed";
import type { DraftDiagnosisItem } from "../types/draftDiagnosis";

type DraftMetricsDiagnosisAnalysis = Readonly<{
  teamfight: TeamfightNeedAnalysis;
  roam: RoamNeedAnalysis;
  sideLane: SideLaneNeedAnalysis;
  pickPotential: PickPotentialNeedAnalysis;
  objective: ObjectiveNeedAnalysis;
}>;

export function buildDraftMetricsDiagnosis(
  analysis: DraftMetricsDiagnosisAnalysis,
): DraftDiagnosisItem[] {
  return [
    analysis.teamfight.needsTeamfight
      ? {
          id: "teamfight",
          label: "集団戦性能不足",
          description:
            "5対5の集団戦で影響力を出せる構成が不足しています",
          status: "WARNING",
        }
      : {
          id: "teamfight",
          label: "集団戦性能は十分",
          description: "5対5で戦える構成です",
          status: "GOOD",
        },
    analysis.roam.needsRoam
      ? {
          id: "roam",
          label: "ローム性能不足",
          description:
            "レーン間の合流や人数有利を作りにくい構成です",
          status: "WARNING",
        }
      : {
          id: "roam",
          label: "ローム性能は十分",
          description: "マップ全体へ圧力をかけられる構成です",
          status: "GOOD",
        },
    analysis.sideLane.needsSideLane
      ? {
          id: "side-lane",
          label: "サイドレーン性能不足",
          description:
            "サイドレーンで継続的に圧力をかけられる構成ではありません",
          status: "WARNING",
        }
      : {
          id: "side-lane",
          label: "サイドレーン性能は十分",
          description: "サイドレーンで圧力を維持できます",
          status: "GOOD",
        },
    analysis.pickPotential.needsPickPotential
      ? {
          id: "pick-potential",
          label: "捕獲性能不足",
          description:
            "単体を捕まえて有利を作る能力が不足しています",
          status: "WARNING",
        }
      : {
          id: "pick-potential",
          label: "捕獲性能は十分",
          description: "単体捕獲から展開を作れる構成です",
          status: "GOOD",
        },
    analysis.objective.needsObjective
      ? {
          id: "objective-control",
          label: "オブジェクト性能不足",
          description:
            "ドラゴンやバロン周辺での主導権が不足しています",
          status: "WARNING",
        }
      : {
          id: "objective-control",
          label: "オブジェクト性能は十分",
          description:
            "オブジェクト周辺で優位を取りやすい構成です",
          status: "GOOD",
        },
  ];
}
