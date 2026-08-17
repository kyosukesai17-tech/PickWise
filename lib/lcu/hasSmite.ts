import type { LcuTeamMember } from "../../types/lcu";

// Data Dragon's SummonerSmite numeric key for standard Summoner's Rift.
const SUMMONER_SMITE_ID = 11;

export function hasSmite(member: LcuTeamMember): boolean {
  return (
    member.spell1Id === SUMMONER_SMITE_ID ||
    member.spell2Id === SUMMONER_SMITE_ID
  );
}
