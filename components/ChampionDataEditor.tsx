"use client";

import { useState } from "react";

const damageTypes = ["AD", "AP", "MIXED"] as const;
const ranges = ["MELEE", "RANGED"] as const;

export default function ChampionDataEditor() {
  const [champion, setChampion] = useState("");

  const [damageType, setDamageType] =
    useState<(typeof damageTypes)[number]>("AD");

  const [range, setRange] =
    useState<(typeof ranges)[number]>("MELEE");

  return (
    <div className="space-y-6 rounded-xl border border-slate-700 bg-slate-900 p-6">

      <div>
        <label className="mb-2 block text-sm font-medium">
          Champion
        </label>

        <input
          value={champion}
          onChange={(e) =>
            setChampion(e.target.value)
          }
          placeholder="Ahri"
          className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Damage Type
        </label>

        <select
          value={damageType}
          onChange={(e) =>
            setDamageType(
              e.target.value as (typeof damageTypes)[number]
            )
          }
          className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2"
        >
          {damageTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Range
        </label>

        <select
          value={range}
          onChange={(e) =>
            setRange(
              e.target.value as (typeof ranges)[number]
            )
          }
          className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2"
        >
          {ranges.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="rounded-lg bg-slate-950 p-4 font-mono text-sm whitespace-pre-wrap">
{`${champion || "Champion"}: {
  attributes: {
    damageType: "${damageType}",
    range: "${range}",
  },
  ratings: {
    tankiness: 3,
    cc: 3,
    waveClear: 3,
    scaling: 3,
  },
  traits: [],
},`}
      </div>

    </div>
  );
}