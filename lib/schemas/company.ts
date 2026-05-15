import { z } from "zod";

export const CompanyStatusSchema = z.enum([
  "ACTIVE",
  "DISSOLVED",
  "STRUCK_OFF",
  "SUSPENDED",
  "UNKNOWN",
]);

export const CompanyProfileSchema = z.object({
  registeredNo: z.string(),
  setSymbol: z.string().nullable(),
  tradeName: z.string(),
  registrationType: z.string(),
  companyStatus: CompanyStatusSchema,
  registeredCapitalBaht: z.number().nullable(),
  majorShareholderNationality: z.string().nullable(),
  registrationDate: z.string(),
  businessAddress: z.string().nullable(),
  telephone: z.string().nullable(),
});

export const CompanyProfileEditRequestSchema = z.object({
  setSymbol: z.string().max(10).nullable().optional(),
  tradeName: z.string().min(1, "required").max(255),
  registrationType: z.string().min(1, "required"),
  companyStatus: CompanyStatusSchema,
  registeredCapitalBaht: z.number().min(0).nullable().optional(),
  majorShareholderNationality: z.string().max(100).nullable().optional(),
  registrationDate: z.string().min(1, "required"),
  businessAddress: z.string().max(500).nullable().optional(),
  telephone: z.string().max(200).nullable().optional(),
});

export type CompanyProfileEditRequest = z.infer<
  typeof CompanyProfileEditRequestSchema
>;
