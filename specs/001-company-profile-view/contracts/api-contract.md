# API Contract: Company Profile View

**Branch**: `001-company-profile-view` | **Date**: 2026-05-13  
**Protocol**: REST over HTTPS  
**Base path**: `/api/companies` (Next.js Route Handler proxy to external data API)

---

## GET /api/companies/{registeredNo}

Retrieves the full general information profile for a single company.

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `registeredNo` | `string` | Yes | The company's unique registered number (e.g., `0105550012345`) |

### Request Headers

| Header | Value | Notes |
|--------|-------|-------|
| `Accept-Language` | `th` or `en` | Indicates preferred language for status labels and messages |
| `Authorization` | `Bearer <token>` | Required; valid authenticated session token |

### Response: 200 OK

```json
{
  "registeredNo": "string",
  "setSymbol": "string | null",
  "tradeName": "string",
  "registrationType": "string",
  "companyStatus": "ACTIVE | DISSOLVED | STRUCK_OFF | SUSPENDED | UNKNOWN",
  "registeredCapitalBaht": "number | null",
  "majorShareholderNationality": "string | null",
  "registrationDate": "string (ISO 8601, e.g. 1988-12-01)",
  "businessAddress": "string | null",
  "telephone": "string | null"
}
```

> `yearInBusiness` is not returned by the API — it is calculated on the client from `registrationDate`.

### Error Responses

| Status | Condition | Response Body |
|--------|-----------|---------------|
| `401 Unauthorized` | Missing or invalid auth token | `{ "error": "Unauthorized" }` |
| `404 Not Found` | Company with given `registeredNo` does not exist | `{ "error": "Company not found" }` |
| `503 Service Unavailable` | External data API is unreachable | `{ "error": "Data source unavailable" }` |

---

## PUT /api/companies/{registeredNo}

Updates the general information for a company. **Admin role required.**

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `registeredNo` | `string` | Yes | The company's unique registered number |

### Request Headers

| Header | Value | Notes |
|--------|-------|-------|
| `Content-Type` | `application/json` | Required |
| `Authorization` | `Bearer <token>` | Required; must be an Admin-role token |

### Request Body

```json
{
  "setSymbol": "string | null",
  "tradeName": "string",
  "registrationType": "string",
  "companyStatus": "ACTIVE | DISSOLVED | STRUCK_OFF | SUSPENDED | UNKNOWN",
  "registeredCapitalBaht": "number | null",
  "majorShareholderNationality": "string | null",
  "registrationDate": "string (ISO 8601)",
  "businessAddress": "string | null",
  "telephone": "string | null"
}
```

> `registeredNo` and `yearInBusiness` are excluded from the request body.

### Validation (server-side)

| Field | Rule |
|-------|------|
| `tradeName` | Required, non-empty, max 255 characters |
| `registrationType` | Required, non-empty |
| `companyStatus` | Required, valid enum value |
| `registrationDate` | Required, valid ISO 8601 date |
| `registeredCapitalBaht` | Optional; if present, must be ≥ 0 |

### Response: 200 OK

Returns the full updated company profile (same shape as GET 200 response).

### Error Responses

| Status | Condition | Response Body |
|--------|-----------|---------------|
| `400 Bad Request` | Validation failure | `{ "error": "Validation failed", "fields": { "tradeName": "Required" } }` |
| `401 Unauthorized` | Missing or invalid auth token | `{ "error": "Unauthorized" }` |
| `403 Forbidden` | Authenticated user does not have Admin role | `{ "error": "Forbidden" }` |
| `404 Not Found` | Company with given `registeredNo` does not exist | `{ "error": "Company not found" }` |
| `503 Service Unavailable` | External data API is unreachable | `{ "error": "Data source unavailable" }` |

---

## Notes

- Both endpoints are implemented as Next.js Route Handlers that proxy to the external company data API.
- Authentication and role verification are performed at the Route Handler layer before forwarding to the external API.
- The external API is treated as a black box; this contract defines the interface the frontend consumes.
- All date values in request/response use ISO 8601 (`YYYY-MM-DD`). Locale-specific display formatting (B.E. / Gregorian) is handled entirely on the client.
