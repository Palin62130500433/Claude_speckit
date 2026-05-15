export type CompanyStatus =
  | "ACTIVE"
  | "DISSOLVED"
  | "STRUCK_OFF"
  | "SUSPENDED"
  | "UNKNOWN";

export interface CompanyProfile {
  registeredNo: string;
  setSymbol: string | null;
  tradeName: string;
  registrationType: string;
  companyStatus: CompanyStatus;
  registeredCapitalBaht: number | null;
  majorShareholderNationality: string | null;
  registrationDate: string;
  businessAddress: string | null;
  telephone: string | null;
}

export type UserRole = "admin" | "standard";
