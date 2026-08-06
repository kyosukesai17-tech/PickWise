import type { GroupedRecommendationReasons } from "../lib/groupRecommendationReasons";

type RecommendationReasonGroupsProps = Readonly<{
  championId: string;
  groups: readonly GroupedRecommendationReasons[];
}>;

export default function RecommendationReasonGroups({
  championId,
  groups,
}: RecommendationReasonGroupsProps) {
  if (groups.length === 0) {
    return null;
  }

  return (
    <section aria-label="おすすめ理由">
      <h4 className="mb-2 text-xs font-semibold text-sky-300">
        おすすめ理由
      </h4>

      <div className="space-y-3">
        {groups.map((group) => (
          <section
            key={group.group}
            aria-labelledby={`${championId}-reason-group-${group.group}`}
          >
            <h5
              id={`${championId}-reason-group-${group.group}`}
              className="mb-1 text-[11px] font-medium tracking-wide text-slate-400"
            >
              {group.label}
            </h5>

            <ul className="space-y-1.5">
              {group.reasons.map((reason, reasonIndex) => (
                <li
                  key={`${championId}-${group.group}-${reasonIndex}`}
                  className="flex items-start gap-2 text-sm text-sky-200"
                >
                  <span aria-hidden="true" className="text-sky-400">
                    ・
                  </span>
                  <span>{reason.text}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
