# PickWise

League of Legendsのドラフトアシスタント。

---

# 開発目的

ドラフト中に最適なチャンピオンを数秒で提案する。

最終目標はLCU APIを利用して自動入力を行う。

---

# 技術スタック

- Next.js
- React
- TypeScript
- Tailwind CSS
- Riot Data Dragon
- Riot API（予定）
- LCU API（予定）

---

# 開発ルール

- 1コミット = 1機能
- ビルドが通る状態でコミット
- コンポーネントは責務を分ける
- TypeScriptの型を必ず付ける

---

# 現在実装済み

- Header
- RoleSelector
- ChampionSearch
- ChampionDropdown
- ChampionCard
- TeamInput
- RecommendationSection
- Riot Data Dragon

---

# 未実装

- BAN選択
- BAN重複禁止
- ドラフト順
- おすすめロジック
- スコア計算
- 理由表示
- Riot API
- LCU API
- Electron化

---

# コミット履歴

## feat: Riot Data Dragon対応

Data Dragonへ移行。

---

## feat: Pick/BAN UI

BAN欄追加。

---

## 次の作業

BAN検索機能
---

# AI開発ルール

- 1コミット = 1機能
- ビルドが通る状態でコミットする
- コードは全文で受け取る
- 不要なリファクタリングは行わない
- 必要になった時だけ設計変更する
- コンポーネントの責務を分離する
- TODOを更新してから次の機能へ進む

## ChatGPTとの開発ルール

変更するファイルはコミット単位でまとめる。

例

Commit3
- TeamInput.tsx
- ChampionSearch.tsx

Commit4
- RecommendationSection.tsx

ChatGPTは変更対象ファイルを全文で返す。