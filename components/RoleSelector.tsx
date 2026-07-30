import type { Role } from "../types/champion";

const roles: Role[] = ["TOP", "JG", "MID", "ADC", "SUP"];

type RoleSelectorProps = {
  selectedRole: Role;
  setSelectedRole: React.Dispatch<React.SetStateAction<Role>>;
};

export default function RoleSelector({
  selectedRole,
  setSelectedRole,
}: RoleSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      {roles.map((role) => (
        <button
          key={role}
          onClick={() => setSelectedRole(role)}
          className={`rounded-lg px-4 py-2 font-medium transition ${
            selectedRole === role
              ? "bg-blue-600 text-white"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          {role}
        </button>
      ))}
    </div>
  );
}