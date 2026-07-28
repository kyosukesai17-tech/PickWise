export function addScore(
  scores: Record<string, number>,
  champion: string,
  value: number
) {
  scores[champion] = (scores[champion] ?? 0) + value;
}