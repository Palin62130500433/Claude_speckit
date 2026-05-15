# Research: Company Profile View

**Branch**: `001-company-profile-view` | **Date**: 2026-05-13  
**Phase**: 0 — Resolving unknowns before design

---

## 1. Project Type & Frontend Framework

**Decision**: Next.js 14+ (App Router) with TypeScript  
**Rationale**: The feature is a web page accessible on desktop and mobile. Next.js provides server-side rendering (useful for SEO and initial data load performance), built-in routing (each company profile gets a unique URL via dynamic routes), and first-class TypeScript support. It is the dominant choice for modern React web applications in enterprise contexts.  
**Alternatives considered**:
- Plain React (Vite/CRA) — rejected: lacks server-side rendering and file-based routing needed for addressable company URLs
- Vue/Nuxt — rejected: smaller ecosystem for Thai enterprise tooling; team familiarity assumed to be React-centric
- Angular — rejected: heavier setup for a single feature page; no evidence this project uses it

---

## 2. Styling & UI Component Approach

**Decision**: Tailwind CSS + shadcn/ui  
**Rationale**: Tailwind provides utility-first responsive styling (satisfies mobile + desktop requirement) with minimal bundle overhead. shadcn/ui supplies accessible, composable primitives (cards, inputs, buttons, dialogs) that map directly to the profile view layout and inline edit pattern. Together they avoid the heavyweight runtime of Ant Design while remaining production-ready.  
**Alternatives considered**:
- Ant Design — considered: strong enterprise adoption in Thailand; rejected because it imposes a large runtime dependency and a fixed design language that may conflict with existing brand
- MUI — rejected: similar overhead to Ant Design; less composable for custom layouts
- Plain CSS Modules — rejected: slower to build responsive layouts consistently

---

## 3. Internationalization (i18n) — Thai & English

**Decision**: next-intl  
**Rationale**: next-intl is the leading i18n library for Next.js App Router. It supports locale-based routing, typed message keys (TypeScript), server component compatibility, and date/number formatting — directly satisfying the Thai (B.E.) and English (Gregorian) date display requirement.  
**Alternatives considered**:
- react-i18next — viable; rejected because it requires additional wiring for App Router server components and does not natively integrate with Next.js locale routing
- i18next alone — rejected: same server component limitation
- Manual string maps — rejected: not maintainable as content grows

**Thai date (B.E.) handling**:  
Use the `Intl.DateTimeFormat` API with the `buddhist` calendar option (`new Intl.DateTimeFormat('th-TH-u-ca-buddhist', ...)`) for Thai locale. English locale uses standard Gregorian. next-intl wrappers handle locale selection automatically.

---

## 4. Server State & API Data Fetching

**Decision**: TanStack Query (React Query) v5  
**Rationale**: Company profile data is server state — it comes from an external API, needs caching, loading and error states, and must always reflect the latest values. TanStack Query is the standard solution for this pattern: it handles background refetch, stale-while-revalidate, retry on failure, and mutation state (for the Admin save flow).  
**Alternatives considered**:
- SWR — viable alternative; rejected because TanStack Query has richer mutation support needed for the admin edit flow (optimistic updates, rollback on failure)
- fetch in useEffect — rejected: manual error/loading state management, no cache, no retry
- Redux RTK Query — rejected: adds Redux overhead not needed for a single-page data fetch

---

## 5. Form Handling & Validation (Admin Edit Mode)

**Decision**: React Hook Form + Zod  
**Rationale**: When Admin clicks the edit icon, each field converts to a text input. React Hook Form manages the uncontrolled form state efficiently (no re-render per keystroke). Zod provides schema-based validation — required fields, data types, and format rules are declared once and reused for both client-side validation (FR-015) and TypeScript type inference.  
**Alternatives considered**:
- Formik — rejected: more verbose and slower than React Hook Form for this use case
- Manual useState per field — rejected: leads to boilerplate and inconsistent validation

---

## 6. Role-Based Access Control

**Decision**: Role checked from authenticated session; edit icon conditionally rendered on client based on role  
**Rationale**: The spec states that role is determined at login and managed by an existing authentication system. The frontend reads the user's role from the session/token and uses it to conditionally show or hide the edit icon (FR-012, FR-016). Server-side, the API enforces the Admin restriction on the update endpoint (returning 403 for non-Admins).  
**Pattern**: Client-side role guard (hide edit icon for Standard User) + server-side enforcement (API returns 403 on unauthorized edit attempt). Both layers required — client guard is UX; server guard is security.  
**Assumptions**:
- The authentication system provides a role claim (e.g., `role: "admin" | "standard"`) in the session or JWT
- Session/auth state is available to the Next.js App Router via a shared auth context or middleware

---

## 7. Inline Edit UX Pattern

**Decision**: Toggle edit mode on the same card; field components switch between display (`<span>`) and input (`<input>`) states  
**Rationale**: The spec explicitly requires that the profile "displays in the same box" and fields "separate into text box inputs" — matching the classic inline-edit / edit-in-place pattern. No modal, no separate page. A single `isEditing` boolean state on the profile card drives the switch. React Hook Form registers inputs only when `isEditing` is true.  
**Unsaved-changes guard**: A `beforeunload` event listener and Next.js router event listener warn the Admin on navigation away (FR-017).  
**Concurrent edit risk**: Not addressed in this version; spec defers conflict resolution — the last save wins.

---

## 8. Testing Strategy

**Decision**: Vitest + React Testing Library (unit/component) + Playwright (E2E)  
**Rationale**: Vitest integrates natively with Vite-based Next.js setups and is fast. React Testing Library tests components from a user perspective (renders labels, finds fields, checks role visibility). Playwright handles E2E scenarios: full page load, Admin edit flow, Standard User cannot edit, API error states, bilingual content.  
**Coverage targets**: All 12 acceptance scenarios from the spec must have corresponding tests.

---

## 9. API Integration Pattern

**Decision**: Next.js Route Handlers as a thin proxy layer between the frontend and the external company data API  
**Rationale**: Calling the external API directly from the browser exposes API keys and bypasses CORS. A Next.js Route Handler (`/api/companies/[id]`) receives the browser request, forwards it to the external API with credentials, and returns the response. This also allows server-side auth enforcement before the external call is made.  
**GET** (fetch company): called on page mount via TanStack Query  
**PUT** (admin update): called on save via TanStack Query mutation

---

## 10. Performance Target Clarification

**Spec SC-002**: Page displays all information within 3 seconds.  
**Resolution**: The 3-second target covers the full page load including the initial API call. Next.js server-side rendering can pre-fetch the company data on the server and serve a populated HTML response, reducing perceived load time. Client hydration and TanStack Query background refetch keep data fresh without blocking paint.
