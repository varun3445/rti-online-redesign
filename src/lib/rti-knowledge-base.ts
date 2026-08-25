/**
 * Static reference corpus for the RTI Act, 2005 and common Central
 * Government service timelines. Small enough to inject directly into a
 * prompt (or read by the local fallback) rather than needing a vector
 * store — the point is a single source of truth both the fallback
 * matcher and the real-AI path draw from, instead of facts scattered
 * and duplicated across files.
 *
 * `web_search` (real-AI path only) is for facts NOT covered here —
 * anything specific/current this static corpus doesn't know. Stable,
 * well-documented facts belong here so they don't need a network call
 * (or worse, a guess) on every single request.
 */

export const RTI_ACT_REFERENCE = {
  responseWindowDays: 30,
  lifeOrLibertyWindowHours: 48,
  transferWindowDays: 5,
  requestFeeInr: 10,
  appealFeeInr: 0,
  keySections: {
    "6(1)": "Right to request information from a Public Authority, in writing or electronically.",
    "2(j)": "Defines the 'right to information' — includes inspection, taking notes/extracts, and certified copies of documents.",
    "7(1)": "The CPIO must respond within 30 days of receipt — 48 hours if the information concerns a person's life or liberty.",
    "7(5)": "No fee is payable by an applicant below the poverty line, on producing a valid BPL certificate.",
    "6(3)": "A CPIO who receives a request meant for a different Public Authority must transfer it within 5 days.",
    "19": "Establishes the right to a First Appeal (to that authority's Appellate Authority) and a Second Appeal (to the Information Commission).",
    "20": "Penalties the Information Commission can impose on a CPIO for unreasonable delay, refusal, or malafide denial.",
  },
  appealGrounds: [
    "Refused access to information requested",
    "No response within the time limit",
    "Unreasonable amount of fee required to pay",
    "Provided incomplete, misleading, or false information",
    "Any other ground",
  ],
};

/** DD/MM/YYYY, matching how an actual RTI application date is written. */
export function formatDate(date = new Date()): string {
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
}

export const SERVICE_SLA_HINTS: Record<string, { days: number; note: string }> = {
  EPFO: {
    days: 20,
    note: "EPFO's own citizen charter targets PF claim settlement within 20 days",
  },
  PSPT: {
    days: 14,
    note: "Passport Seva typically dispatches a passport within about 14 days of application",
  },
  CPV: {
    days: 14,
    note: "Passport Seva typically dispatches a passport within about 14 days of application",
  },
  ITD: {
    days: 45,
    note: "Income tax refunds are typically processed within 4-5 weeks of e-verification, per the Income Tax Department's own processing guidance",
  },
  CBDT: {
    days: 45,
    note: "Income tax refunds are typically processed within 4-5 weeks of e-verification, per the Income Tax Department's own processing guidance",
  },
};
