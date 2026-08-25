import { rtiCaseSchema, type RtiCase } from "@/lib/rti-case.schema";

const timestamp = (value: string) => `${value}T10:00:00.000Z`;

export const mockRtiCases: RtiCase[] = rtiCaseSchema.array().parse([
  {
    id: "RTI-2026-0001",
    subject: "Platform accessibility audit reports",
    authority: { id: "railways", name: "Ministry of Railways" },
    state: "submitted",
    submittedAt: timestamp("2026-08-19"),
    updatedAt: timestamp("2026-08-19"),
    events: [{ occurredAt: timestamp("2026-08-19"), state: "submitted", message: "Request submitted." }],
    subRecords: [],
  },
  {
    id: "RTI-2026-0002",
    subject: "PF claim processing delays",
    authority: { id: "epfo", name: "Employees' Provident Fund Organisation" },
    state: "forwarded",
    submittedAt: timestamp("2026-08-03"),
    updatedAt: timestamp("2026-08-07"),
    events: [
      { occurredAt: timestamp("2026-08-03"), state: "submitted", message: "Request submitted." },
      { occurredAt: timestamp("2026-08-07"), state: "forwarded", message: "Request split between relevant offices." },
    ],
    subRecords: [
      {
        id: "EPFO/R/E/26/00421/1",
        parentCaseId: "RTI-2026-0002",
        authority: { id: "epfo-delhi", name: "EPFO Delhi Regional Office" },
        state: "forwarded",
        createdAt: timestamp("2026-08-07"),
        updatedAt: timestamp("2026-08-07"),
        events: [{ occurredAt: timestamp("2026-08-07"), state: "forwarded", message: "Sent to Delhi regional office." }],
      },
      {
        id: "EPFO/R/E/26/00421/2",
        parentCaseId: "RTI-2026-0002",
        authority: { id: "epfo-noida", name: "EPFO Noida Regional Office" },
        state: "responded",
        createdAt: timestamp("2026-08-07"),
        updatedAt: timestamp("2026-08-14"),
        events: [{ occurredAt: timestamp("2026-08-14"), state: "responded", message: "Response issued by Noida office." }],
      },
      {
        id: "EPFO/R/E/26/00421/3",
        parentCaseId: "RTI-2026-0002",
        authority: { id: "epfo-gurugram", name: "EPFO Gurugram Regional Office" },
        state: "additional-payment-required",
        createdAt: timestamp("2026-08-07"),
        updatedAt: timestamp("2026-08-16"),
        events: [{ occurredAt: timestamp("2026-08-16"), state: "additional-payment-required", message: "Additional copying fee requested." }],
      },
    ],
  },
  {
    id: "RTI-2026-0003",
    subject: "Railway station redevelopment contracts",
    authority: { id: "railways", name: "Ministry of Railways" },
    state: "responded",
    submittedAt: timestamp("2026-07-10"),
    updatedAt: timestamp("2026-08-08"),
    events: [{ occurredAt: timestamp("2026-08-08"), state: "responded", message: "Response issued." }],
    subRecords: [],
  },
  {
    id: "RTI-2026-0004",
    subject: "Income tax record copies",
    authority: { id: "cbdt", name: "Central Board of Direct Taxes" },
    state: "additional-payment-required",
    submittedAt: timestamp("2026-07-24"),
    updatedAt: timestamp("2026-08-12"),
    events: [{ occurredAt: timestamp("2026-08-12"), state: "additional-payment-required", message: "Additional copying fee requested." }],
    subRecords: [],
  },
  {
    id: "RTI-2026-0005",
    subject: "Missing supporting document details",
    authority: { id: "epfo", name: "Employees' Provident Fund Organisation" },
    state: "returned-to-applicant",
    submittedAt: timestamp("2026-08-01"),
    updatedAt: timestamp("2026-08-05"),
    events: [{ occurredAt: timestamp("2026-08-05"), state: "returned-to-applicant", message: "Returned for clarification." }],
    subRecords: [],
  },
  {
    id: "RTI-2026-0006",
    subject: "Pension policy records",
    authority: { id: "dopt", name: "Department of Personnel and Training" },
    state: "transferred-to-other-authority",
    submittedAt: timestamp("2026-07-28"),
    updatedAt: timestamp("2026-08-02"),
    events: [{ occurredAt: timestamp("2026-08-02"), state: "transferred-to-other-authority", message: "Transferred to the Ministry of Finance." }],
    subRecords: [],
  },
]);

export const casesByState = (state: RtiCase["state"]) =>
  mockRtiCases.filter((caseRecord) => caseRecord.state === state);
