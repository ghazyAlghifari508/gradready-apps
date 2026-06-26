import { DocType, JobStatus } from "@/generated/prisma/client";
import { z } from "zod";

const currentYear = new Date().getFullYear();

const emptyToUndefined = (value: unknown) =>
  value === "" || value === null ? undefined : value;

const optionalTrimmedString = (max: number) =>
  z.preprocess(emptyToUndefined, z.string().trim().max(max).optional());

const optionalCuid = z.preprocess(
  emptyToUndefined,
  z.string().cuid().optional(),
);

const optionalGraduationYear = z.preprocess(
  emptyToUndefined,
  z.coerce.number().int().min(1950).max(currentYear + 10).optional(),
);

const optionalPhone = z.preprocess(
  emptyToUndefined,
  z
    .string()
    .trim()
    .regex(/^\+?[0-9 ()-]{6,20}$/)
    .optional(),
);

const httpUrlForHost = (host: "linkedin.com" | "github.com") =>
  z
    .string()
    .trim()
    .url()
    .refine((value) => /^https?:\/\//.test(value), {
      message: "URL must start with http:// or https://",
    })
    .refine(
      (value) => {
        const hostname = new URL(value).hostname.toLowerCase();
        return hostname === host || hostname.endsWith(`.${host}`);
      },
      { message: `URL host must be ${host}` },
    );

export const profileUpdateSchema = z
  .object({
    name: z.preprocess(
      emptyToUndefined,
      z.string().trim().min(1).max(100).optional(),
    ),
    university: optionalTrimmedString(200),
    graduationYear: optionalGraduationYear,
    bio: optionalTrimmedString(1000),
    linkedinUrl: z.preprocess(
      emptyToUndefined,
      httpUrlForHost("linkedin.com").optional(),
    ),
    githubUrl: z.preprocess(
      emptyToUndefined,
      httpUrlForHost("github.com").optional(),
    ),
    phone: optionalPhone,
    targetJobId: optionalCuid,
  })
  .strict();

export const onboardingSchema = z
  .object({
    name: z.preprocess(
      emptyToUndefined,
      z.string().trim().min(1).max(100).optional(),
    ),
    university: optionalTrimmedString(200),
    graduationYear: optionalGraduationYear,
    bio: optionalTrimmedString(1000),
    linkedinUrl: z.preprocess(
      emptyToUndefined,
      httpUrlForHost("linkedin.com").optional(),
    ),
    githubUrl: z.preprocess(
      emptyToUndefined,
      httpUrlForHost("github.com").optional(),
    ),
    phone: optionalPhone,
    targetJobId: optionalCuid,
  })
  .strict();

export const savedJobSchema = z
  .object({
    id: optionalCuid,
    status: z.nativeEnum(JobStatus).optional(),
    companyName: z.preprocess(
      emptyToUndefined,
      z.string().trim().min(1).max(200).optional(),
    ),
    position: z.preprocess(
      emptyToUndefined,
      z.string().trim().min(1).max(200).optional(),
    ),
    notes: z.preprocess(
      emptyToUndefined,
      z.string().trim().max(2000).optional(),
    ),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (!value.id && !value.companyName) {
      ctx.addIssue({
        code: "custom",
        path: ["companyName"],
        message: "Company name is required",
      });
    }
    if (!value.id && !value.position) {
      ctx.addIssue({
        code: "custom",
        path: ["position"],
        message: "Position is required",
      });
    }
    if (value.id && !value.status && value.notes === undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["status"],
        message: "Status or notes is required",
      });
    }
  });

export const roadmapProgressSchema = z
  .object({
    resourceId: z.string().cuid(),
    isCompleted: z.boolean(),
  })
  .strict();

const cappedString = (max: number) => z.string().trim().min(1).max(max);
const optionalCappedString = (max: number) =>
  z.preprocess(emptyToUndefined, z.string().trim().max(max).optional());

export const docInputSchemas = {
  [DocType.MOTIVATION]: z
    .object({
      companyName: cappedString(200),
      position: cappedString(200),
    })
    .strict(),
  [DocType.COVER]: z
    .object({
      companyName: cappedString(200),
      position: cappedString(200),
      jobDescription: cappedString(5000),
    })
    .strict(),
  [DocType.LINKEDIN]: z
    .object({
      tone: optionalCappedString(50),
      industry: cappedString(200),
      highlights: optionalCappedString(1000),
    })
    .strict(),
  [DocType.PORTFOLIO]: z
    .object({
      projectName: cappedString(200),
      techStack: cappedString(1000),
      goal: cappedString(1000),
      impact: cappedString(1000),
    })
    .strict(),
  [DocType.SELF_INTRO]: z
    .object({
      position: cappedString(200),
      highlights: cappedString(1000),
    })
    .strict(),
  [DocType.CV]: z.object({}).strict(),
} satisfies Record<DocType, z.ZodType>;

export const docGenerateSchema = z
  .object({
    docType: z.nativeEnum(DocType),
    inputs: z.unknown(),
  })
  .strict();
