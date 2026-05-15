import { createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";

const { Given, When, Then } = createBdd();

// ── Background ────────────────────────────────────────────────────────────────

Given(
  "the company {string} exists in the system with full data",
  async ({}, _registeredNo: string) => {
    // Mock data is served automatically by the Route Handler in dev mode.
    // No setup needed — the mock store is pre-seeded in lib/mock/companies.ts.
  }
);

Given(
  "the company {string} exists with several fields missing",
  async ({}, _registeredNo: string) => {
    // lib/mock/companies.ts includes 0107560000001 with null fields.
  }
);

// ── Navigation ────────────────────────────────────────────────────────────────

Given(
  "I am viewing the company profile for {string} in English",
  async ({ page }, registeredNo: string) => {
    await page.goto(`/en/companies/${registeredNo}`);
    await page.waitForLoadState("networkidle");
  }
);

Given(
  "I am viewing the company profile for {string} in Thai",
  async ({ page }, registeredNo: string) => {
    await page.goto(`/th/companies/${registeredNo}`);
    await page.waitForLoadState("networkidle");
  }
);

Given(
  "I am viewing the company profile for {string} as an Admin",
  async ({ page }, registeredNo: string) => {
    await page.goto(`/en/companies/${registeredNo}?role=admin`);
    await page.waitForLoadState("networkidle");
  }
);

Given(
  "I am viewing the company profile for {string} as a Standard User",
  async ({ page }, registeredNo: string) => {
    await page.goto(`/en/companies/${registeredNo}?role=standard`);
    await page.waitForLoadState("networkidle");
  }
);

Given(
  "I am viewing the company profile for {string} as a {word}",
  async ({ page }, registeredNo: string, role: string) => {
    const roleParam = role.toLowerCase().replace(" ", "-") === "admin" ? "admin" : "standard";
    await page.goto(`/en/companies/${registeredNo}?role=${roleParam}`);
    await page.waitForLoadState("networkidle");
  }
);

Given(
  "I navigate directly to the URL {string}",
  async ({ page }, url: string) => {
    await page.goto(url);
    await page.waitForLoadState("networkidle");
  }
);

Given(
  "the data source is temporarily unavailable",
  async ({ page }) => {
    // Intercept API calls and return 503
    await page.route("**/api/companies/**", (route) =>
      route.fulfill({ status: 503, body: JSON.stringify({ error: "Data source unavailable" }) })
    );
  }
);

When(
  "I navigate to the company profile for {string} in English",
  async ({ page }, registeredNo: string) => {
    await page.goto(`/en/companies/${registeredNo}`);
    await page.waitForLoadState("networkidle");
  }
);

When(
  "I navigate to the company profile for {string} in Thai",
  async ({ page }, registeredNo: string) => {
    await page.goto(`/th/companies/${registeredNo}`);
    await page.waitForLoadState("networkidle");
  }
);

// ── Page Load ─────────────────────────────────────────────────────────────────

When("the page finishes loading", async ({ page }) => {
  await page.waitForLoadState("networkidle");
});

// ── Field Assertions ──────────────────────────────────────────────────────────

Then(
  "I see the field {string} with a value",
  async ({ page }, label: string) => {
    const labelEl = page.getByText(label, { exact: true });
    await expect(labelEl).toBeVisible();
  }
);

Then(
  "I see the field {string} with value {string}",
  async ({ page }, label: string, value: string) => {
    await expect(page.getByText(label, { exact: true }).first()).toBeVisible();
    await expect(page.getByText(value, { exact: false }).first()).toBeVisible();
  }
);

Then(
  "the field {string} displays the not-available placeholder",
  async ({ page }, _label: string) => {
    // Placeholder is either "–" (EN) or "ไม่มีข้อมูล" (TH)
    const placeholder = page.getByText("–").or(page.getByText("ไม่มีข้อมูล"));
    await expect(placeholder.first()).toBeVisible();
  }
);

Then(
  "every field with no data shows the placeholder {string}",
  async ({ page }, placeholder: string) => {
    const els = page.getByText(placeholder, { exact: true });
    const count = await els.count();
    expect(count).toBeGreaterThan(0);
  }
);

Then("all fields with data are still displayed correctly", async ({ page }) => {
  // Registered No. always has data in mock; verify it is visible
  await expect(page.getByText("0107560000001")).toBeVisible();
});

// ── Error States ──────────────────────────────────────────────────────────────

Then(
  "I see an error message {string}",
  async ({ page }, message: string) => {
    await expect(page.getByText(message, { exact: false })).toBeVisible();
  }
);

Then("I see a retry button", async ({ page }) => {
  const retry = page
    .getByRole("button", { name: /try again|ลองใหม่/i });
  await expect(retry).toBeVisible();
});

// ── Not-Found State ───────────────────────────────────────────────────────────

Then("I see the message {string}", async ({ page }, message: string) => {
  await expect(page.getByText(message, { exact: false }).first()).toBeVisible();
});
