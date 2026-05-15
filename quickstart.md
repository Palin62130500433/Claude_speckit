# Quickstart — Company Profile V2

## Prerequisites

- Node.js 20 LTS
- npm 10+

## Install

```bash
npm install
```

## Run dev server

```bash
npm run dev
```

The app is available at `http://localhost:3000`.

Navigate to a company profile:

```
http://localhost:3000/en/companies/<registeredNo>
http://localhost:3000/th/companies/<registeredNo>
```

## Build for production

```bash
npm run build
npm run start
```

## Lint

```bash
npm run lint
```

## Tests

| Command | What it runs |
|---|---|
| `npm test` | Vitest unit + component tests |
| `npm run test:e2e` | Playwright end-to-end tests |
| `npm run test:bdd` | BDD feature scenarios (playwright-bdd) |

## Project layout

```
app/
  [locale]/companies/[registeredNo]/page.tsx   # SSR profile page
  api/companies/[registeredNo]/route.ts        # Route Handler proxy (GET + PUT)

components/company-profile/                   # UI components
  CompanyProfileCard.tsx
  CompanyField.tsx
  EditToolbar.tsx
  StatusBadge.tsx

lib/
  api/companies.ts       # TanStack Query hooks
  schemas/company.ts     # Zod validation
  auth/roles.ts          # Role helpers (Admin / Standard User)
  i18n/messages/         # th.json, en.json translations

specs/001-company-profile-view/               # Feature spec, plan, tasks
tests/
  unit/                  # Vitest
  e2e/                   # Playwright
```

## Key facts

- **Roles**: Admin (view + inline edit) / Standard User (view only)
- **Languages**: Thai (`th`) and English (`en`) via next-intl
- **Data**: Always fetched live from external API — no local persistence
- **Edit mode**: Same card layout; fields switch to text inputs on edit icon click
- **Required fields**: Trade Name (and others per spec) must not be empty on save
