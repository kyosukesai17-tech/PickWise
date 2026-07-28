export async function fetchChampions() {
  const response = await fetch(
    "https://ddragon.leagueoflegends.com/cdn/15.15.1/data/ja_JP/champion.json"
  );

  if (!response.ok) {
    throw new Error("チャンピオン情報の取得に失敗しました");
  }

  return response.json();
}