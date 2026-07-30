"use client";

import { useMemo, useState } from "react";

import { TRAITS } from "../data/championData/traits";
import type { ChampionTrait } from "../data/championData/traits";
import type { Champion } from "../types/champion";

import ChampionSelector from "./ChampionSelector";

const damageTypes = ["AD", "AP", "MIXED"] as const;
const ranges = ["MELEE", "RANGED"] as const;

export default function ChampionDataEditor() {
  const [selectedChampion, setSelectedChampion] =
    useState<Champion | null>(null);

  const [damageType, setDamageType] =
    useState<(typeof damageTypes)[number]>("AD");

  const [range, setRange] =
    useState<(typeof ranges)[number]>("MELEE");

  const [tankiness, setTankiness] = useState(3);
  const [cc, setCc] = useState(3);
  const [waveClear, setWaveClear] = useState(3);
  const [scaling, setScaling] = useState(3);

  const [traits, setTraits] = useState<ChampionTrait[]>([]);

  function toggleTrait(trait: ChampionTrait) {
    setTraits((prev) =>
      prev.includes(trait)
        ? prev.filter((t) => t !== trait)
        : [...prev, trait]
    );
  }

  const preview = useMemo(() => {
    const traitText =
      traits.length === 0
        ? ""
        : "\n    " +
          traits.map((trait) => `TRAITS.${trait}`).join(",\n    ") +
          "\n  ";

    return `${selectedChampion?.id ?? "Champion"}: {
  attributes: {
    damageType: "${damageType}",
    range: "${range}",
  },

  ratings: {
    tankiness: ${tankiness},
    cc: ${cc},
    waveClear: ${waveClear},
    scaling: ${scaling},
  },

  traits: [${traitText}],
},`;
  }, [
    selectedChampion,
    damageType,
    range,
    tankiness,
    cc,
    waveClear,
    scaling,
    traits,
  ]);

  return (
    <div className="space-y-6 rounded-xl border border-slate-700 bg-slate-900 p-6">
      <div>
        <label className="mb-2 block text-sm font-medium">
          Champion
        </label>

        <ChampionSelector
          value={selectedChampion}
          onSelect={setSelectedChampion}
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

      <div className="grid grid-cols-2 gap-4">
        <NumberInput
          label="Tankiness"
          value={tankiness}
          onChange={setTankiness}
        />

        <NumberInput
          label="CC"
          value={cc}
          onChange={setCc}
        />

        <NumberInput
          label="Wave Clear"
          value={waveClear}
          onChange={setWaveClear}
        />

        <NumberInput
          label="Scaling"
          value={scaling}
          onChange={setScaling}
        />
      </div>

      <div>
        <label className="mb-3 block text-sm font-medium">
          Traits
        </label>

        <div className="flex flex-wrap gap-2">
          {Object.values(TRAITS).map((trait) => {
            const active = traits.includes(trait);

            return (
              <button
                key={trait}
                type="button"
                onClick={() => toggleTrait(trait)}
                className={`rounded-md border px-3 py-2 text-sm transition ${
                  active
                    ? "border-sky-500 bg-sky-600 text-white"
                    : "border-slate-700 bg-slate-800 hover:bg-slate-700"
                }`}
              >
                {trait}
              </button>
            );
          })}
        </div>
      </div>      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">
            Preview
          </label>

          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(preview)}
            className="rounded bg-sky-600 px-3 py-2 text-sm text-white transition hover:bg-sky-500"
          >
            コピー
          </button>
        </div>

        <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 font-mono text-sm whitespace-pre-wrap">
          {preview}
        </pre>
      </div>
    </div>
  );
}

type NumberInputProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

function NumberInput({
  label,
  value,
  onChange,
}: NumberInputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        {label}
      </label>

      <input
        type="number"
        min={1}
        max={5}
        value={value}
        onChange={(e) => {
          const value = Math.max(
            1,
            Math.min(5, Number(e.target.value))
          );

          onChange(value);
        }}
        className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2"
      />
    </div>
  );
}