import type { CompanyProfile } from "@/lib/types/company";

const MOCK_COMPANIES: Record<string, CompanyProfile> = {
  "0105550012345": {
    registeredNo: "0105550012345",
    setSymbol: "CPALL",
    tradeName: "บริษัท ซีพี ออลล์ จำกัด (มหาชน)",
    registrationType: "บริษัทมหาชนจำกัด",
    companyStatus: "ACTIVE",
    registeredCapitalBaht: 8985000000,
    majorShareholderNationality: "Thai",
    registrationDate: "1988-12-01",
    businessAddress:
      "313 ถนนสีลม แขวงสีลม เขตบางรัก กรุงเทพมหานคร 10500",
    telephone: "02-677-8888",
  },
  "0105536127408": {
    registeredNo: "0105536127408",
    setSymbol: null,
    tradeName: "บริษัท สมชาย เทรดดิ้ง จำกัด",
    registrationType: "บริษัทจำกัด",
    companyStatus: "ACTIVE",
    registeredCapitalBaht: 2000000,
    majorShareholderNationality: "Thai",
    registrationDate: "2005-06-15",
    businessAddress: "99/5 ถนนพระราม 9 เขตห้วยขวาง กรุงเทพมหานคร 10310",
    telephone: "02-123-4567",
  },
  "0107560000001": {
    registeredNo: "0107560000001",
    setSymbol: null,
    tradeName: "บริษัท มิสซิ่ง ดาต้า จำกัด",
    registrationType: "บริษัทจำกัด",
    companyStatus: "DISSOLVED",
    registeredCapitalBaht: null,
    majorShareholderNationality: null,
    registrationDate: "2013-03-20",
    businessAddress: null,
    telephone: null,
  },
};

export function getMockCompany(registeredNo: string): CompanyProfile | null {
  return MOCK_COMPANIES[registeredNo] ?? null;
}

export function updateMockCompany(
  registeredNo: string,
  updates: Partial<CompanyProfile>
): CompanyProfile | null {
  const existing = MOCK_COMPANIES[registeredNo];
  if (!existing) return null;
  MOCK_COMPANIES[registeredNo] = { ...existing, ...updates };
  return MOCK_COMPANIES[registeredNo];
}
