import { z } from "zod";

export const caseLifecycleStateSchema = z.enum([
  "submitted",
  "forwarded",
  "responded",
  "additional-payment-required",
  "returned-to-applicant",
  "transferred-to-other-authority",
]);

export const authoritySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

export const caseEventSchema = z.object({
  occurredAt: z.iso.datetime({ offset: true }),
  state: caseLifecycleStateSchema,
  message: z.string().min(1),
});

export const forwardedSubRecordSchema = z.object({
  id: z.string().min(1),
  parentCaseId: z.string().min(1),
  authority: authoritySchema,
  state: caseLifecycleStateSchema,
  createdAt: z.iso.datetime({ offset: true }),
  updatedAt: z.iso.datetime({ offset: true }),
  events: z.array(caseEventSchema).min(1),
});

export const rtiCaseSchema = z
  .object({
    id: z.string().min(1),
    subject: z.string().min(1),
    authority: authoritySchema,
    state: caseLifecycleStateSchema,
    submittedAt: z.iso.datetime({ offset: true }),
    updatedAt: z.iso.datetime({ offset: true }),
    events: z.array(caseEventSchema).min(1),
    subRecords: z.array(forwardedSubRecordSchema),
  })
  .superRefine((caseRecord, context) => {
    if (caseRecord.state === "forwarded" && caseRecord.subRecords.length === 0) {
      context.addIssue({ code: "custom", message: "Forwarded cases must include linked sub-records." });
    }

    if (caseRecord.state !== "forwarded" && caseRecord.subRecords.length > 0) {
      context.addIssue({ code: "custom", message: "Only forwarded cases can include sub-records." });
    }

    caseRecord.subRecords.forEach((subRecord, index) => {
      if (subRecord.parentCaseId !== caseRecord.id) {
        context.addIssue({
          code: "custom",
          path: ["subRecords", index, "parentCaseId"],
          message: "Sub-record parentCaseId must match the parent case ID.",
        });
      }
    });
  });

export type CaseLifecycleState = z.infer<typeof caseLifecycleStateSchema>;
export type ForwardedSubRecord = z.infer<typeof forwardedSubRecordSchema>;
export type RtiCase = z.infer<typeof rtiCaseSchema>;
