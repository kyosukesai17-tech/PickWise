import type { Champion } from "./champion";

export const REASON = {
  FRONTLINE: "FRONTLINE",
  AP: "AP",
  AD: "AD",
  CC: "CC",
  SCALING: "SCALING",
} as const;

export type RecommendationReasonType =
  (typeof REASON)[keyof typeof REASON];

export interface RecommendationReason {
  type: RecommendationReasonType;
  score: number;
  text: string;
}

export interface Recommendation {
  champion: Champion;
  score: number;
  reasons: RecommendationReason[];
}