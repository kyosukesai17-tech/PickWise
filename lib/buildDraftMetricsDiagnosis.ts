import type { ObjectiveNeedAnalysis } from "./analyzeObjectiveNeed";
import type { PickPotentialNeedAnalysis } from "./analyzePickPotentialNeed";
import type { RoamNeedAnalysis } from "./analyzeRoamNeed";
import type { SideLaneNeedAnalysis } from "./analyzeSideLaneNeed";
import type { TeamfightNeedAnalysis } from "./analyzeTeamfightNeed";
import type { Role } from "../types/champion";
import type { DraftDiagnosisItem } from "../types/draftDiagnosis";

type DraftMetricsDiagnosisAnalysis = Readonly<{
  teamfight: TeamfightNeedAnalysis;
  roam: RoamNeedAnalysis;
  sideLane: SideLaneNeedAnalysis;
  pickPotential: PickPotentialNeedAnalysis;
  objective: ObjectiveNeedAnalysis;
  selectedRole: Role;
}>;

const MIN_STANDARD_SAMPLE_SIZE = 2;
const MIN_OBJECTIVE_SAMPLE_SIZE = 3;

export function buildDraftMetricsDiagnosis(
  analysis: DraftMetricsDiagnosisAnalysis,
): DraftDiagnosisItem[] {
  const items: DraftDiagnosisItem[] = [];

  if (
    analysis.teamfight.selectedCount >= MIN_STANDARD_SAMPLE_SIZE &&
    analysis.teamfight.averageTeamfight !== null
  ) {
    items.push(
      analysis.teamfight.needsTeamfight
        ? analysis.teamfight.averageTeamfight < 3
          ? {
              id: "teamfight",
              label: "集団戦性能不足",
              description:
                "集団戦で影響力を出せる構成が大きく不足しています",
              status: "WARNING",
            }
          : {
              id: "teamfight",
              label: "集団戦性能がやや低め",
              description: "5対5では少し不安が残る構成です",
              status: "CAUTION",
            }
        : {
          id: "teamfight",
          label: "集団戦性能は十分",
          description: "5対5で戦える構成です",
          status: "GOOD",
        },
    );
  }

  if (
    analysis.roam.selectedCount >= MIN_STANDARD_SAMPLE_SIZE &&
    analysis.roam.averageRoam !== null
  ) {
    items.push(
      analysis.roam.needsRoam
        ? analysis.roam.averageRoam < 2.5
          ? {
              id: "roam",
              label: "ローム性能不足",
              description:
                "レーン間の合流や人数有利を作る能力が大きく不足しています",
              status: "WARNING",
            }
          : {
              id: "roam",
              label: "ローム性能がやや低め",
              description: "レーン間の合流に少し不安が残る構成です",
              status: "CAUTION",
            }
        : {
          id: "roam",
          label: "ローム性能は十分",
          description: "マップ全体へ圧力をかけられる構成です",
          status: "GOOD",
        },
    );
  }

  const isSideLaneRole =
    analysis.selectedRole === "TOP" || analysis.selectedRole === "MID";

  if (
    isSideLaneRole &&
    analysis.sideLane.selectedCount >= MIN_STANDARD_SAMPLE_SIZE &&
    analysis.sideLane.averageSideLane !== null
  ) {
    items.push(
      analysis.sideLane.needsSideLane
        ? analysis.sideLane.averageSideLane < 2
          ? {
              id: "side-lane",
              label: "サイドレーン性能不足",
              description:
                "サイドレーンで継続的に圧力をかける能力が大きく不足しています",
              status: "WARNING",
            }
          : {
              id: "side-lane",
              label: "サイドレーン性能がやや低め",
              description: "サイドレーン運用に少し不安が残る構成です",
              status: "CAUTION",
            }
        : {
          id: "side-lane",
          label: "サイドレーン性能は十分",
          description: "サイドレーンで圧力を維持できます",
          status: "GOOD",
        },
    );
  }

  if (
    analysis.pickPotential.selectedCount >= MIN_STANDARD_SAMPLE_SIZE &&
    analysis.pickPotential.averagePickPotential !== null
  ) {
    items.push(
      analysis.pickPotential.hasStrongPicker ||
        !analysis.pickPotential.needsPickPotential
        ? {
            id: "pick-potential",
            label: "捕獲性能は十分",
            description: "単体捕獲から展開を作れる構成です",
            status: "GOOD",
          }
        : analysis.pickPotential.averagePickPotential < 2.5
          ? {
              id: "pick-potential",
              label: "捕獲性能不足",
              description:
                "単体を捕まえて有利を作る能力が大きく不足しています",
              status: "WARNING",
            }
          : {
              id: "pick-potential",
              label: "捕獲性能がやや低め",
              description: "単体捕獲に少し不安が残る構成です",
              status: "CAUTION",
            },
    );
  }

  if (
    analysis.objective.selectedCount >= MIN_OBJECTIVE_SAMPLE_SIZE &&
    analysis.objective.averageObjective !== null
  ) {
    items.push(
      analysis.objective.needsObjective
        ? analysis.objective.averageObjective < 3.5
          ? {
              id: "objective-control",
              label: "オブジェクト性能不足",
              description:
                "ドラゴンやバロン周辺での主導権が大きく不足しています",
              status: "WARNING",
            }
          : {
              id: "objective-control",
              label: "オブジェクト性能がやや低め",
              description:
                "オブジェクト周辺の主導権に少し不安が残る構成です",
              status: "CAUTION",
            }
        : {
            id: "objective-control",
            label: "オブジェクト性能は十分",
            description:
              "オブジェクト周辺で優位を取りやすい構成です",
            status: "GOOD",
          },
    );
  }

  return items;
}
