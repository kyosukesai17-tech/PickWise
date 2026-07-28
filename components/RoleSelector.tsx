"use client";

import { useState } from "react";

const roles = [
  "トップ",
  "ジャングル",
  "ミッド",
  "ADC",
  "サポート",
];

export default function RoleSelector() {
  const [selectedRole, setSelectedRole] = useState("ミッド");

  return (
    <section className="mb-12">
      <h2 className="mb-6 text-center text-3xl font-bold">
        ロール
      </h2>

      <div className="flex flex-wrap justify-center gap-3">
        {roles.map((role) => {
          const selected = selectedRole === role;

          return (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`rounded-lg border px-6 py-3 font-semibold transition-all duration-200
                ${
                  selected
                    ? "border-yellow-400 bg-yellow-400 text-slate-950"
                    : "border-slate-700 bg-slate-900 text-white hover:border-yellow-400"
                }`}
            >
              {role}
            </button>
          );
        })}
      </div>
    </section>
  );
}