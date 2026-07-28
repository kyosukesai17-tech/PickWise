const roles = ["トップ", "ジャングル", "ミッド", "ADC", "サポート"];

export default function RoleSelector() {
  return (
    <section className="text-center">
      <h2 className="mb-6 text-2xl font-semibold text-slate-200">ロール</h2>

      <div className="flex flex-wrap justify-center gap-3">
        {roles.map((role) => (
          <button
            key={role}
            type="button"
            className="rounded-lg border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-yellow-400 hover:text-yellow-400"
          >
            {role}
          </button>
        ))}
      </div>
    </section>
  );
}
