import type { RtiCase } from "@/lib/rti-case.schema";
import { CaseCard } from "@/components/ui/CaseCard";

export function CaseList({ cases }: { cases: RtiCase[] }) {
  return (
    <ul className="flex flex-col gap-4" style={{ listStyle: "none", padding: 0 }}>
      {cases.map((c) => (
        <li key={c.id}>
          <CaseCard rtiCase={c} />
        </li>
      ))}
    </ul>
  );
}
