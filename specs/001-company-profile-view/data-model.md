# Data Model: Company Profile View

**Branch**: `001-company-profile-view` | **Date**: 2026-05-13

---

## Entities

### CompanyProfile

Represents the general information for a single registered company as returned by the external API and displayed on the profile page.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `registeredNo` | `string` | Yes | Unique identifier; used to identify the company in the URL |
| `setSymbol` | `string \| null` | No | Null or empty string if company is not SET-listed |
| `tradeName` | `string` | Yes | The operating name of the company |
| `registrationType` | `string` | Yes | Legal form (e.g., "บริษัทจำกัด" / "Limited Company") |
| `companyStatus` | `CompanyStatus` | Yes | See enum below |
| `registeredCapitalBaht` | `number \| null` | No | Latest registered capital in Thai Baht; null if not recorded |
| `majorShareholderNationality` | `string \| null` | No | Nationality of principal shareholder(s) |
| `registrationDate` | `string` | Yes | ISO 8601 date string (e.g., `"1995-04-12"`); display format derived from user locale |
| `yearInBusiness` | `number` | Derived | Calculated from `registrationDate` — not stored separately |
| `businessAddress` | `string \| null` | No | May span multiple lines; null if not recorded |
| `telephone` | `string \| null` | No | May contain multiple numbers separated by comma or newline |

#### CompanyStatus Enum

| Value | Thai Display | English Display |
|-------|-------------|-----------------|
| `ACTIVE` | ยังดำเนินกิจการอยู่ | Active |
| `DISSOLVED` | เลิกบริษัท | Dissolved |
| `STRUCK_OFF` | ถูกขีดชื่อออก | Struck Off |
| `SUSPENDED` | ระงับการดำเนินงาน | Suspended |
| `UNKNOWN` | ไม่ทราบสถานะ | Unknown |

---

### UserRole

Determines the actions a user can perform on the company profile page. Derived from the authenticated session — not stored or managed by this feature.

| Value | Can View | Can Edit | Sees Edit Icon |
|-------|----------|----------|----------------|
| `admin` | Yes | Yes | Yes |
| `standard` | Yes | No | No |

---

### CompanyProfileEditRequest

Represents the payload sent to the API when an Admin saves changes. Only the 11 editable fields are included. `registeredNo` is used as the path parameter, not in the body.

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `setSymbol` | `string \| null` | No | Max 10 characters |
| `tradeName` | `string` | Yes | Non-empty, max 255 characters |
| `registrationType` | `string` | Yes | Non-empty |
| `companyStatus` | `CompanyStatus` | Yes | Must be a valid enum value |
| `registeredCapitalBaht` | `number \| null` | No | Non-negative if present |
| `majorShareholderNationality` | `string \| null` | No | Max 100 characters |
| `registrationDate` | `string` | Yes | Valid ISO 8601 date |
| `businessAddress` | `string \| null` | No | Max 500 characters |
| `telephone` | `string \| null` | No | Max 200 characters |

> **Note**: `yearInBusiness` is not editable — it is always derived from `registrationDate`. `registeredNo` is the company identifier and is not editable from the profile page.

---

## State Transitions

### Company Profile Page Mode

```
[READ_ONLY] ──(Admin clicks edit icon)──► [EDIT_MODE]
    ▲                                           │
    │                                           │
    └──(Admin clicks Cancel)────────────────────┤
    └──(Admin clicks Save → API success)────────┘
    └──(API save failure)────────────────────────── stays in [EDIT_MODE], error shown
```

### Field Display State

| Page Mode | Field Display |
|-----------|---------------|
| READ_ONLY | `<span>` showing current value or placeholder |
| EDIT_MODE | `<input>` / `<select>` pre-filled with current value |

---

## Validation Rules

| Rule | Scope | Trigger |
|------|-------|---------|
| Required fields cannot be empty on save | `tradeName`, `registrationType`, `companyStatus`, `registrationDate` | Admin clicks Save |
| `registeredCapitalBaht` must be non-negative | Edit form | Admin clicks Save |
| `registrationDate` must be a valid date | Edit form | Admin clicks Save |
| Language-appropriate validation messages | All | Admin clicks Save with invalid input |
| Unsaved-changes warning on navigation | Edit mode only | Admin navigates away |

---

## Locale & Display Rules

| Field | Thai (th) | English (en) |
|-------|-----------|--------------|
| `registrationDate` | B.E. calendar, `DD/MM/YYYY (พ.ศ.)` format | Gregorian, `DD/MM/YYYY` or `Month DD, YYYY` |
| `yearInBusiness` | Derived: current B.E. year − registration B.E. year | Derived: current year − registration year |
| `registeredCapitalBaht` | Thai numeral grouping (e.g., `1,000,000`) | Same format |
| `companyStatus` | Thai enum label | English enum label |
| Missing field placeholder | `ไม่มีข้อมูล` | `–` (em dash) or `Not available` |

---

## API Response Shape (expected from external API)

```json
{
  "registeredNo": "0105550012345",
  "setSymbol": "CPALL",
  "tradeName": "บริษัท ซีพี ออลล์ จำกัด (มหาชน)",
  "registrationType": "บริษัทมหาชนจำกัด",
  "companyStatus": "ACTIVE",
  "registeredCapitalBaht": 8985000000,
  "majorShareholderNationality": "Thai",
  "registrationDate": "1988-12-01",
  "businessAddress": "313 ถนนสีลม แขวงสีลม เขตบางรัก กรุงเทพมหานคร 10500",
  "telephone": "02-677-8888"
}
```

Missing optional fields are returned as `null` (not omitted).
