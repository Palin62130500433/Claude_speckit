# Implementation Plan: Company Profile View

**Branch**: `001-company-profile-view` | **Date**: 2026-05-13 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `specs/001-company-profile-view/spec.md`

## Summary

Build a company profile page that displays 11 general information fields for a registered company, fetched live from an external data API. The page supports Thai and English, handles missing fields gracefully, and provides Admin users with an inline edit mode (same card layout, fields transform to text inputs on edit icon click) while Standard Users see a read-only view. The frontend is a Next.js (TypeScript) web application; data is proxied through Next.js Route Handlers to the external API.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20 LTS  
**Primary Dependencies**: Next.js 14+ (App Router), React 18, TanStack Query v5, React Hook Form, Zod, next-intl, Tailwind CSS, shadcn/ui  
**Storage**: None (read from external API; no local persistence)  
**Testing**: Vitest + React Testing Library (unit/component), Playwright (E2E)  
**Target Platform**: Web — desktop and mobile browsers (responsive)  
**Project Type**: Web application (Next.js frontend with Route Handler API proxy)  
**Performance Goals**: Initial page load + data display ≤ 3 seconds (SC-002); edit mode transition ≤ 1 second (SC-010)  
**Constraints**: Bilingual (Thai B.E. / English Gregorian dates); role-based edit access; API data always reflects latest source (no stale cache served to users)  
**Scale/Scope**: Single company profile page; 2 user roles; 11 data fields; 2 locales

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution (`/.specify/memory/constitution.md`) is currently a blank template — no project-specific principles have been configured. All gates are treated as **N/A** for this iteration.

**Recommendation**: Run `/speckit-constitution` to define project principles before moving to future features. For this feature, no constitution violations exist.

| Gate | Status | Notes |
|------|--------|-------|
| Constitution principles defined | N/A | Constitution not yet configured |
| Complexity justified | Pass | Single page, 2 endpoints, 2 roles — inherently simple |
| No unnecessary abstractions | Pass | Route Handler proxy is required for auth/CORS; no speculative layers |

## Project Structure

### Documentation (this feature)

```text
specs/001-company-profile-view/
├── plan.md              ← this file
├── research.md          ← Phase 0: tech decisions and rationale
├── data-model.md        ← Phase 1: entities, validation, state transitions
├── contracts/
│   └── api-contract.md  ← Phase 1: GET and PUT endpoint contracts
└── tasks.md             ← Phase 2 (/speckit-tasks — not yet generated)
```

### Source Code (repository root)

```text
app/
├── [locale]/
│   └── companies/
│       └── [registeredNo]/
│           └── page.tsx           ← Company profile page (SSR)
├── api/
│   └── companies/
│       └── [registeredNo]/
│           └── route.ts           ← Next.js Route Handler (GET + PUT proxy)
└── layout.tsx                     ← Root layout with i18n provider

components/
└── company-profile/
    ├── CompanyProfileCard.tsx     ← Main card: read-only and edit mode
    ├── CompanyField.tsx           ← Single field: display ↔ input toggle
    ├── EditToolbar.tsx            ← Edit icon, Save, Cancel buttons
    └── StatusBadge.tsx            ← CompanyStatus display with locale label

lib/
├── api/
│   └── companies.ts               ← TanStack Query hooks (useCompany, useUpdateCompany)
├── i18n/
│   ├── messages/
│   │   ├── th.json                ← Thai translations
│   │   └── en.json                ← English translations
│   └── config.ts                  ← next-intl configuration
├── schemas/
│   └── company.ts                 ← Zod schemas for CompanyProfile and EditRequest
└── auth/
    └── roles.ts                   ← Role type definitions and role-check helpers

tests/
├── unit/
│   ├── components/
│   │   └── CompanyProfileCard.test.tsx
│   └── lib/
│       └── schemas/company.test.ts
└── e2e/
    └── company-profile.spec.ts    ← Playwright: all 12 acceptance scenarios
```

**Structure Decision**: Web application — Option 2 pattern (frontend-only; no separate backend directory since Next.js collocates Route Handlers with pages). The `app/api/` directory acts as the thin proxy layer to the external API.

## Complexity Tracking

No constitution violations to justify — complexity is appropriate for the feature scope.
