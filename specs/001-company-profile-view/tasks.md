# Tasks: Company Profile View

**Input**: Design documents from `specs/001-company-profile-view/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story this task belongs to (US1–US4)
- Tests: Not included (not requested in spec)

## Path Conventions

Web application — Next.js App Router layout per `plan.md`:

```
app/[locale]/companies/[registeredNo]/   ← pages
app/api/companies/[registeredNo]/        ← Route Handler proxy
components/company-profile/              ← UI components
lib/api/, lib/i18n/, lib/schemas/, lib/auth/, lib/utils/
tests/unit/, tests/e2e/
```

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize Next.js project and install all dependencies before any feature work begins.

- [x] T001 Initialize Next.js 14+ project with TypeScript, App Router, and Tailwind CSS in repository root (package.json, tsconfig.json, next.config.ts)
- [x] T002 Install feature dependencies: TanStack Query v5, React Hook Form, Zod, next-intl, shadcn/ui (run `npx shadcn@latest init`)
- [x] T003 [P] Install dev dependencies: Vitest, @testing-library/react, Playwright (vitest.config.ts, playwright.config.ts)
- [x] T004 [P] Create project directory structure per plan.md: app/, components/company-profile/, lib/api/, lib/i18n/messages/, lib/schemas/, lib/auth/, lib/utils/, tests/unit/, tests/e2e/
- [x] T005 [P] Configure next-intl locale routing for `th` and `en` in next.config.ts and create i18n/request.ts middleware

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types, schemas, i18n keys, auth helpers, and providers that ALL user stories depend on. No user story can begin until this phase completes.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T006 Define CompanyProfile, CompanyStatus enum, and UserRole TypeScript types in lib/types/company.ts
- [x] T007 Define Zod schemas for CompanyProfile (read) and CompanyProfileEditRequest (write) with all validation rules from data-model.md in lib/schemas/company.ts
- [x] T008 [P] Create UserRole type (`admin` | `standard`) and `isAdmin(role)` helper in lib/auth/roles.ts
- [x] T009 [P] Create base Thai message file with all field labels, CompanyStatus labels, placeholder strings, error messages, and validation messages in lib/i18n/messages/th.json
- [x] T010 [P] Create base English message file mirroring th.json structure with English equivalents in lib/i18n/messages/en.json
- [x] T011 [P] Create locale date formatting utilities: `formatRegistrationDate(date, locale)` (B.E. for Thai, Gregorian for English) and `calcYearInBusiness(date, locale)` in lib/utils/date.ts
- [x] T012 Wrap app root with TanStack Query provider and next-intl provider in app/[locale]/layout.tsx and app/layout.tsx
- [x] T013 Create Next.js Route Handler scaffold (GET + PUT) for /api/companies/[registeredNo] with auth token validation and role extraction in app/api/companies/[registeredNo]/route.ts

**Checkpoint**: All types, schemas, i18n keys, and providers are in place. User story phases can now begin.

---

## Phase 3: User Story 1 — View Company General Information (Priority: P1) 🎯 MVP

**Goal**: Any authenticated user can navigate to a company profile page and see all 11 information fields, displayed in their selected language (Thai or English), with data always fetched fresh from the API.

**Independent Test**: Navigate to `/th/companies/0105550012345` and `/en/companies/0105550012345` — verify all 11 field labels and values appear in the correct language. Check that the page shows live API data (not a hardcoded response).

### Implementation

- [x] T014 [P] [US1] Create `CompanyField` component (read-only): renders a label and value side-by-side; supports locale prop in components/company-profile/CompanyField.tsx
- [x] T015 [P] [US1] Create `StatusBadge` component: maps CompanyStatus enum to locale-appropriate label with a colored indicator in components/company-profile/StatusBadge.tsx
- [x] T016 [US1] Create `CompanyProfileCard` component (read-only): renders all 11 fields using CompanyField and StatusBadge inside a single card layout in components/company-profile/CompanyProfileCard.tsx
- [x] T017 [US1] Implement `useCompany(registeredNo)` TanStack Query hook: GET /api/companies/[registeredNo], includes loading and error state in lib/api/companies.ts
- [x] T018 [US1] Implement GET handler in Route Handler: forward request to external API with Authorization header; return parsed CompanyProfile JSON in app/api/companies/[registeredNo]/route.ts
- [x] T019 [US1] Create company profile page: server-side fetch company data, pass to CompanyProfileCard, set locale from URL segment in app/[locale]/companies/[registeredNo]/page.tsx
- [x] T020 [US1] Wire locale-aware Registration Date display and Year in Business calculation into CompanyField using lib/utils/date.ts formatters in components/company-profile/CompanyField.tsx

**Checkpoint**: User Story 1 fully functional. A user can view all 11 fields in Thai or English with live data.

---

## Phase 4: User Story 2 — Handle Missing or Unavailable Company Data (Priority: P2)

**Goal**: Fields with no recorded data show a clear, language-appropriate placeholder. API errors show a friendly error message — never a blank page or raw error output.

**Independent Test**: View a company profile where 2–3 fields are null — every null field shows "–" (EN) or "ไม่มีข้อมูล" (TH). Simulate an API failure — user sees a friendly error message with a retry action.

### Implementation

- [x] T021 [US2] Extend `CompanyField` to render locale-appropriate placeholder ("–" / "ไม่มีข้อมูล") when value is null or empty in components/company-profile/CompanyField.tsx
- [x] T022 [US2] Add loading skeleton state to `CompanyProfileCard`: show placeholder skeleton rows while TanStack Query fetch is in-flight in components/company-profile/CompanyProfileCard.tsx
- [x] T023 [US2] Add API error state to `CompanyProfileCard`: when useCompany returns an error, display a locale-appropriate error message and a "Try Again" retry button in components/company-profile/CompanyProfileCard.tsx
- [x] T024 [P] [US2] Add 503/error response handling to GET Route Handler: catch external API failures and return `{ "error": "Data source unavailable" }` with HTTP 503 in app/api/companies/[registeredNo]/route.ts
- [x] T025 [P] [US2] Add TH/EN strings for loading state, API error message, and retry button label to lib/i18n/messages/th.json and lib/i18n/messages/en.json

**Checkpoint**: User Story 2 fully functional. Missing data and API errors handled gracefully in both languages.

---

## Phase 5: User Story 4 — Admin Edits Company Information Inline (Priority: P2)

**Goal**: An Admin user sees an edit icon on the profile card. Clicking it converts all editable fields to text inputs within the same layout. Admin can save (triggers PUT API call) or cancel (reverts to read-only). Non-Admin users never see the edit icon.

**Independent Test**: Log in as Admin — edit icon visible, clicking it enters edit mode (fields become inputs, same card), saving updates values displayed. Log in as Standard User — no edit icon visible, no way to enter edit mode.

### Implementation

- [x] T026 [US4] Create `EditToolbar` component: shows edit (pencil) icon in read-only mode; shows Save and Cancel buttons in edit mode; hidden entirely for non-Admin users in components/company-profile/EditToolbar.tsx
- [x] T027 [US4] Extend `CompanyField` to support `editMode` prop: renders `<input>`, `<select>` (for CompanyStatus), or `<textarea>` (for businessAddress) when in edit mode; read-only fields (registeredNo, yearInBusiness) never enter edit mode in components/company-profile/CompanyField.tsx
- [x] T028 [US4] Integrate React Hook Form into `CompanyProfileCard`: wrap all editable fields in a `<form>`, register each with React Hook Form, connect Zod schema resolver from lib/schemas/company.ts in components/company-profile/CompanyProfileCard.tsx
- [x] T029 [US4] Add `isEditing` state and Admin role guard to `CompanyProfileCard`: read user role from session/auth context; show EditToolbar only for Admin; toggle isEditing on edit icon click and on Cancel in components/company-profile/CompanyProfileCard.tsx
- [x] T030 [US4] Implement `useUpdateCompany(registeredNo)` TanStack Query mutation: PUT /api/companies/[registeredNo]; on success refresh useCompany cache and exit edit mode; on error preserve edit mode and surface error in lib/api/companies.ts
- [x] T031 [US4] Implement PUT handler in Route Handler: validate Admin role (return 403 if not Admin); validate request body with Zod schema; forward to external API; return updated CompanyProfile in app/api/companies/[registeredNo]/route.ts
- [x] T032 [US4] Add per-field validation error display to `CompanyField`: show locale-appropriate error message below the input when React Hook Form/Zod validation fails on save in components/company-profile/CompanyField.tsx
- [x] T033 [US4] Add API save-failure handling to `CompanyProfileCard`: when PUT mutation fails, stay in edit mode and display locale-appropriate error message above Save button (user's input is preserved) in components/company-profile/CompanyProfileCard.tsx
- [x] T034 [US4] Add unsaved-changes navigation guard to the company profile page: register `beforeunload` listener and Next.js router `beforeNavigation` handler to warn Admin on navigation away while in edit mode in app/[locale]/companies/[registeredNo]/page.tsx
- [x] T035 [P] [US4] Add TH/EN strings for edit mode UI: "Edit", "Save", "Cancel", validation error messages, save-failure message, and unsaved-changes warning prompt in lib/i18n/messages/th.json and lib/i18n/messages/en.json

**Checkpoint**: User Story 4 fully functional. Admin can inline-edit company data; Standard Users see read-only view only.

---

## Phase 6: User Story 3 — Access Company Profile via Direct Link (Priority: P3)

**Goal**: A user navigating directly to a company profile URL sees the correct company's latest data. Navigating to a non-existent company shows a clear, locale-appropriate "not found" page — no errors or blank screens.

**Independent Test**: Open `/en/companies/0000000000000` (non-existent) — see English "not found" page. Open `/th/companies/0000000000000` — see Thai "not found" page. Open `/en/companies/0105550012345` — see correct company data.

### Implementation

- [x] T036 [US3] Add 404 handling to the company profile page: when GET Route Handler returns 404, render a locale-appropriate "not found" message component instead of the profile card in app/[locale]/companies/[registeredNo]/page.tsx
- [x] T037 [P] [US3] Create locale-aware Not Found component: displays "Company not found" message and a back-navigation link, styled consistently with the profile page in components/company-profile/CompanyNotFound.tsx
- [x] T038 [P] [US3] Add TH/EN "not found" strings ("ไม่พบข้อมูลบริษัท" / "Company not found") and back-link label in lib/i18n/messages/th.json and lib/i18n/messages/en.json
- [x] T039 [US3] Add locale-aware page `<title>` and `<meta>` description via Next.js `generateMetadata` for the company profile page in app/[locale]/companies/[registeredNo]/page.tsx

**Checkpoint**: User Story 3 fully functional. All URLs resolve correctly; non-existent companies show a friendly locale-appropriate page.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Responsive layout, accessibility, security hardening, and final translation completeness checks across all user stories.

- [x] T040 [P] Apply responsive Tailwind breakpoints to `CompanyProfileCard`: two-column label/value layout on desktop, stacked layout on mobile in components/company-profile/CompanyProfileCard.tsx
- [x] T041 [P] Add ARIA labels and keyboard navigation support to `EditToolbar` and edit-mode inputs (edit icon is `<button>` with aria-label; inputs have associated `<label>` elements) in components/company-profile/EditToolbar.tsx and CompanyField.tsx
- [x] T042 [P] Audit all TH/EN message files for completeness — every key used in components must exist in both th.json and en.json in lib/i18n/messages/
- [x] T043 [P] Security: verify Route Handler PUT endpoint returns HTTP 403 for requests with non-Admin role tokens in app/api/companies/[registeredNo]/route.ts
- [ ] T044 Add `shadcn/ui` Card, Input, Select, Textarea, Button, and Skeleton primitives (run `npx shadcn@latest add card input select textarea button skeleton`) used by components in components/company-profile/

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — **BLOCKS all user story phases**
- **Phase 3 (US1 — P1)**: Depends on Phase 2 — start here for MVP
- **Phase 4 (US2 — P2)**: Depends on Phase 3 (extends CompanyField and CompanyProfileCard)
- **Phase 5 (US4 — P2)**: Depends on Phase 3 (extends CompanyField and CompanyProfileCard); can run in parallel with Phase 4
- **Phase 6 (US3 — P3)**: Depends on Phase 3 (extends profile page)
- **Phase 7 (Polish)**: Depends on all user story phases

### User Story Dependencies

| Story | Depends On | Can Parallelize With |
|-------|-----------|---------------------|
| US1 (P1) | Phase 2 complete | — |
| US2 (P2) | US1 complete | US4 (different concerns) |
| US4 (P2) | US1 complete | US2 (different concerns) |
| US3 (P3) | US1 complete | US2, US4 |

### Within Each User Story

- Shared types/schemas → component → hook/service → Route Handler → page integration
- Each story extends the same CompanyProfileCard/CompanyField components — coordinate if developing stories in parallel to avoid merge conflicts on those files

### Parallel Opportunities

- All `[P]`-marked tasks within a phase can run concurrently
- US2, US4, and US3 can all start as soon as US1 is complete (if team has capacity)
- All i18n message additions across stories are in separate concerns but in the same files — batch by locale file to avoid conflicts

---

## Parallel Example: Phase 2 (Foundational)

```
Parallel batch 1 (no dependencies):
  T006  Define TypeScript types in lib/types/company.ts
  T007  Define Zod schemas in lib/schemas/company.ts
  T008  Create UserRole helpers in lib/auth/roles.ts
  T009  Create th.json message file
  T010  Create en.json message file
  T011  Create date utility functions in lib/utils/date.ts

Sequential after batch 1:
  T012  Setup providers in app/layout.tsx (depends on T009/T010 keys existing)
  T013  Create Route Handler scaffold in app/api/companies/[registeredNo]/route.ts
```

## Parallel Example: Phase 5 (US4 — Admin Edit)

```
Parallel batch (no inter-dependencies):
  T026  Create EditToolbar component
  T035  Add TH/EN strings for edit mode

Sequential (build up edit mode):
  T027  Extend CompanyField for edit mode  ← after T026 for EditToolbar interface
  T028  Integrate React Hook Form into CompanyProfileCard  ← after T027
  T029  Add isEditing state and role guard to CompanyProfileCard  ← after T028
  T030  Implement useUpdateCompany mutation in lib/api/companies.ts  ← after T029
  T031  Implement PUT Route Handler  ← after T030
  T032  Add per-field validation error display  ← after T028
  T033  Add save-failure error handling  ← after T030
  T034  Add unsaved-changes navigation guard  ← after T029
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (**CRITICAL** — blocks all stories)
3. Complete Phase 3: User Story 1 (T014–T020)
4. **STOP and VALIDATE**: Open a company profile in both Thai and English, verify all 11 fields display correctly with live API data
5. Demo or ship the read-only view

### Incremental Delivery

1. Phase 1 + 2 → Foundation ready
2. Phase 3 (US1) → Read-only bilingual profile → **MVP**
3. Phase 4 (US2) → Graceful missing data + error states → **Production-stable**
4. Phase 5 (US4) → Admin inline edit → **Full feature**
5. Phase 6 (US3) → Not-found handling + SEO metadata → **Complete**
6. Phase 7 → Polish, accessibility, security → **Ship-ready**

### Parallel Team Strategy

After Phase 2 completes and Phase 3 (US1) ships:
- **Developer A**: Phase 4 (US2 — missing data/error states)
- **Developer B**: Phase 5 (US4 — admin inline edit)
- **Developer C**: Phase 6 (US3 — not-found + metadata)

---

## Notes

- `[P]` tasks = different files, no blocking dependencies between them
- `[Story]` label traces each task back to its acceptance criteria in spec.md
- `registeredNo` and `yearInBusiness` are never editable — enforce in both CompanyField (edit mode guard) and Route Handler (exclude from PUT schema)
- CompanyField and CompanyProfileCard are extended across multiple stories — communicate with teammates before merging changes to these files
- All date values stored and transmitted as ISO 8601; locale display handled entirely on client via lib/utils/date.ts
- Route Handler is the single security enforcement point for role checks — never rely solely on client-side role guard
