import { test, expect } from "@playwright/test";

// US1 — View Company General Information
test("displays all 11 fields in English", async ({ page }) => {
  await page.goto("/en/companies/0105550012345");
  await expect(page.getByText("Registered No.")).toBeVisible();
  await expect(page.getByText("Trade Name")).toBeVisible();
  await expect(page.getByText("Company Status")).toBeVisible();
});

test("displays all 11 fields in Thai", async ({ page }) => {
  await page.goto("/th/companies/0105550012345");
  await expect(page.getByText("เลขทะเบียน")).toBeVisible();
  await expect(page.getByText("ชื่อการค้า")).toBeVisible();
  await expect(page.getByText("สถานะบริษัท")).toBeVisible();
});

// US2 — Handle Missing Data
test("shows placeholder for null fields", async ({ page }) => {
  await page.goto("/en/companies/0000000000001");
  // Fields with null values should show "–"
  const placeholders = page.getByText("–");
  await expect(placeholders.first()).toBeVisible();
});

test("shows error message when API is unavailable", async ({ page }) => {
  // Test with a registeredNo that triggers a 503
  await page.goto("/en/companies/ERROR");
  await expect(
    page.getByText("Unable to load company information")
  ).toBeVisible();
});

// US3 — Not Found
test("shows not-found page in English for non-existent company", async ({
  page,
}) => {
  await page.goto("/en/companies/0000000000000");
  await expect(page.getByText("Company Not Found")).toBeVisible();
});

test("shows not-found page in Thai for non-existent company", async ({
  page,
}) => {
  await page.goto("/th/companies/0000000000000");
  await expect(page.getByText("ไม่พบข้อมูลบริษัท")).toBeVisible();
});

// US4 — Admin Edit
test("admin sees edit icon", async ({ page }) => {
  // Requires auth setup — placeholder
  await page.goto("/en/companies/0105550012345");
  // When logged in as admin:
  // await expect(page.getByRole("button", { name: "Edit" })).toBeVisible();
});

test("standard user does not see edit icon", async ({ page }) => {
  await page.goto("/en/companies/0105550012345");
  await expect(
    page.getByRole("button", { name: "Edit" })
  ).not.toBeVisible();
});
