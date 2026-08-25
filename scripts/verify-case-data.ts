import { mockRtiCases } from "../src/lib/mock-rti-cases";
import { caseLifecycleStateSchema } from "../src/lib/rti-case.schema";

for (const state of caseLifecycleStateSchema.options) {
  const cases = mockRtiCases.filter((caseRecord) => caseRecord.state === state);
  if (cases.length === 0) throw new Error(`Missing mock case for state: ${state}`);

  console.log(`${state}:`);
  for (const caseRecord of cases) {
    console.log(`  ${caseRecord.id} — ${caseRecord.subject}`);
    for (const subRecord of caseRecord.subRecords) {
      console.log(`    ${subRecord.id} → ${subRecord.authority.name} (${subRecord.state})`);
    }
  }
}
