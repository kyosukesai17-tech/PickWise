import fs from "fs";
import path from "path";

type Champion = {
  id: string;
  key: string;
  name: string;
};

const championsPath = path.join(
  process.cwd(),
  "data",
  "champions.json"
);

const outputPath = path.join(
  process.cwd(),
  "data",
  "championData",
  "generated.ts"
);

const champions: Champion[] = JSON.parse(
  fs.readFileSync(championsPath, "utf-8")
);

const lines: string[] = [];

lines.push('import type { ChampionData } from "./types";');
lines.push('');
lines.push("export const generatedChampionData: Record<string, ChampionData> = {");

for (const champion of champions) {
  lines.push(`  ${champion.id}: {`);
  lines.push(`    attributes: {`);
  lines.push(`      damageType: "AD",`);
  lines.push(`      range: "MELEE",`);
  lines.push(`    },`);
  lines.push(`    ratings: {`);
  lines.push(`      tankiness: 3,`);
  lines.push(`      cc: 3,`);
  lines.push(`      waveClear: 3,`);
  lines.push(`      scaling: 3,`);
  lines.push(`    },`);
  lines.push(`    traits: [],`);
  lines.push(`  },`);
  lines.push("");
}

lines.push("};");

fs.writeFileSync(outputPath, lines.join("\n"));

console.log(
  `✅ Generated ${champions.length} champions`
);