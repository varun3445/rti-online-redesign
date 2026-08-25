import { getSupabase } from "@/lib/supabase-server";
import { rtiCaseSchema, type RtiCase } from "@/lib/rti-case.schema";

type CaseRow = {
  id: string;
  subject: string;
  authority_code: string;
  authority_name: string;
  authority_ministry: string;
  state: RtiCase["state"];
  applicant_email: string | null;
  is_seed_example: boolean;
  submitted_at: string;
  updated_at: string;
};

type SubRecordRow = {
  id: string;
  parent_case_id: string;
  authority_name: string;
  state: RtiCase["state"];
  created_at: string;
  updated_at: string;
};

type EventRow = {
  case_id: string | null;
  sub_record_id: string | null;
  occurred_at: string;
  state: RtiCase["state"];
  message: string;
};

function assemble(cases: CaseRow[], subRecords: SubRecordRow[], events: EventRow[]): RtiCase[] {
  return cases.map((c) => {
    const caseEvents = events
      .filter((e) => e.case_id === c.id)
      .map((e) => ({ occurredAt: e.occurred_at, state: e.state, message: e.message }));

    const subs = subRecords
      .filter((s) => s.parent_case_id === c.id)
      .map((s) => ({
        id: s.id,
        parentCaseId: s.parent_case_id,
        authority: { id: s.id, name: s.authority_name },
        state: s.state,
        createdAt: s.created_at,
        updatedAt: s.updated_at,
        events: events
          .filter((e) => e.sub_record_id === s.id)
          .map((e) => ({ occurredAt: e.occurred_at, state: e.state, message: e.message })),
      }));

    const raw = {
      id: c.id,
      subject: c.subject,
      authority: { id: c.authority_code, name: c.authority_name },
      state: c.state,
      submittedAt: c.submitted_at,
      updatedAt: c.updated_at,
      events: caseEvents.length > 0 ? caseEvents : [{ occurredAt: c.submitted_at, state: c.state, message: "Request submitted." }],
      subRecords: subs,
    };

    return rtiCaseSchema.parse(raw);
  });
}

async function fetchAssembled(caseIds: string[]): Promise<RtiCase[]> {
  const supabase = getSupabase();
  if (!supabase || caseIds.length === 0) return [];

  const [{ data: cases }, { data: subRecords }, { data: events }] = await Promise.all([
    supabase.from("rti_cases").select("*").in("id", caseIds),
    supabase.from("rti_sub_records").select("*").in("parent_case_id", caseIds),
    supabase.from("rti_events").select("*"),
  ]);

  return assemble(
    (cases ?? []) as CaseRow[],
    (subRecords ?? []) as SubRecordRow[],
    (events ?? []) as EventRow[]
  );
}

/** Seed examples plus any real case filed under this email — the set My
 * RTI / View History show. */
export async function fetchCasesForEmail(email?: string): Promise<RtiCase[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  let query = supabase.from("rti_cases").select("id").eq("is_seed_example", true);
  const { data: seedRows } = await query;

  let ownRows: { id: string }[] = [];
  if (email) {
    const { data } = await supabase
      .from("rti_cases")
      .select("id")
      .ilike("applicant_email", email)
      .eq("is_seed_example", false);
    ownRows = data ?? [];
  }

  const ids = [...(seedRows ?? []).map((r) => r.id), ...ownRows.map((r) => r.id)];
  const cases = await fetchAssembled(ids);
  // Most recently updated first.
  return cases.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export async function fetchCaseById(id: string): Promise<RtiCase | undefined> {
  const cases = await fetchAssembled([id.trim()]);
  return cases[0];
}

export async function findCaseByIdLike(query: string): Promise<RtiCase | undefined> {
  const supabase = getSupabase();
  if (!supabase || !query.trim()) return undefined;

  const { data } = await supabase
    .from("rti_cases")
    .select("id")
    .ilike("id", `%${query.trim()}%`)
    .limit(1);

  const id = data?.[0]?.id;
  if (!id) return undefined;
  return fetchCaseById(id);
}

export async function createCase(input: {
  id: string;
  subject: string;
  authority: { code: string; name: string; ministry: string };
  applicantEmail: string;
}): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;

  const now = new Date().toISOString();

  await supabase.from("rti_cases").insert({
    id: input.id,
    subject: input.subject,
    authority_code: input.authority.code,
    authority_name: input.authority.name,
    authority_ministry: input.authority.ministry,
    state: "submitted",
    applicant_email: input.applicantEmail,
    is_seed_example: false,
    submitted_at: now,
    updated_at: now,
  });

  await supabase.from("rti_events").insert({
    case_id: input.id,
    occurred_at: now,
    state: "submitted",
    message: "Request submitted.",
  });
}
