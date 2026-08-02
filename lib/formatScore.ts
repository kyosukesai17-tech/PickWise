export function formatTotalScore(score: number): string {
  return String(Math.round(score));
}

export function formatScoreModifier(score: number): string {
  const roundedScore = Math.round(score);

  return roundedScore > 0
    ? `+${roundedScore}`
    : String(roundedScore);
}
