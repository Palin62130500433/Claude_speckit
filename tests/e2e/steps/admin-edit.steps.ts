import { createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";

const { Given, When, Then } = createBdd();

// ── Background / Edit-mode navigation ────────────────────────────────────────

async function enterEditMode(page: import("@playwright/test").Page, url: string) {
  await page.goto(url);
  await page.waitForLoadState("networkidle");
  const editBtn = page.getByRole("button", { name: /edit|แก้ไข/i });
  await editBtn.waitFor({ state: "visible" });
  await editBtn.click();
  // Wait until at least one editable input is visible (edit mode is active)
  await page.locator("input[type=text], textarea").first().waitFor({ state: "visible", timeout: 5000 });
}

Given(
  "I am in edit mode on the company profile for {string}",
  async ({ page }, registeredNo: string) => {
    await enterEditMode(page, `/en/companies/${registeredNo}?role=admin`);
  }
);

Given(
  "I am in edit mode on the company profile for {string} in English",
  async ({ page }, registeredNo: string) => {
    await enterEditMode(page, `/en/companies/${registeredNo}?role=admin`);
  }
);

Given(
  "I am in edit mode on the company profile for {string} in Thai",
  async ({ page }, registeredNo: string) => {
    await enterEditMode(page, `/th/companies/${registeredNo}?role=admin`);
  }
);

// ── Edit icon ─────────────────────────────────────────────────────────────────

Then("I see the edit icon on the profile card", async ({ page }) => {
  const editBtn = page.getByRole("button", { name: /edit|แก้ไข/i });
  await expect(editBtn).toBeVisible();
});

Then("the edit icon is not visible", async ({ page }) => {
  const editBtn = page.getByRole("button", { name: /edit|แก้ไข/i });
  await expect(editBtn).not.toBeVisible();
});

Then("the edit icon is {word}", async ({ page }, visibility: string) => {
  const editBtn = page.getByRole("button", { name: /edit|แก้ไข/i });
  if (visibility === "visible") {
    await expect(editBtn).toBeVisible();
  } else {
    await expect(editBtn).not.toBeVisible();
  }
});

Then("there is no way to enter edit mode", async ({ page }) => {
  // Verify neither the edit button nor any Save/Cancel buttons are present
  await expect(page.getByRole("button", { name: /edit|แก้ไข/i })).not.toBeVisible();
  await expect(page.getByRole("button", { name: /save|บันทึก/i })).not.toBeVisible();
});

// ── Clicking edit ─────────────────────────────────────────────────────────────

When("I click the edit icon", async ({ page }) => {
  await page.getByRole("button", { name: /edit|แก้ไข/i }).click();
  await page.waitForTimeout(200);
});

// ── Edit mode assertions ──────────────────────────────────────────────────────

Then("all editable fields convert to text input boxes", async ({ page }) => {
  // After clicking edit, at least one text input should be visible
  const inputs = page.locator("input[type=text], textarea, select").filter({ visible: true });
  const count = await inputs.count();
  expect(count).toBeGreaterThan(0);
});

Then("the layout remains the same card — no page navigation occurs", async ({ page }) => {
  expect(page.url()).toMatch(/\/companies\//);
  await expect(page.locator("dl").first()).toBeVisible();
});

Then("I see a Save button", async ({ page }) => {
  await expect(page.getByRole("button", { name: /save|บันทึก/i })).toBeVisible();
});

Then("I see a Cancel button", async ({ page }) => {
  await expect(page.getByRole("button", { name: /cancel|ยกเลิก/i })).toBeVisible();
});

// ── Field editing ─────────────────────────────────────────────────────────────

const LABEL_TO_FIELD: Record<string, string> = {
  "Trade Name": "tradeName",
  "ชื่อการค้า": "tradeName",
  "SET Symbol": "setSymbol",
  "สัญลักษณ์ SET": "setSymbol",
  "Registration Type": "registrationType",
  "ประเภทการจดทะเบียน": "registrationType",
  "Latest Registered Capital (Baht)": "registeredCapitalBaht",
  "ทุนจดทะเบียนล่าสุด (บาท)": "registeredCapitalBaht",
  "Major Shareholder's Nationality": "majorShareholderNationality",
  "สัญชาติผู้ถือหุ้นรายใหญ่": "majorShareholderNationality",
  "Business Address": "businessAddress",
  "ที่อยู่ประกอบธุรกิจ": "businessAddress",
  "Telephone": "telephone",
  "โทรศัพท์": "telephone",
};

When(
  "I change the {string} field to {string}",
  async ({ page }, label: string, value: string) => {
    const fieldName = LABEL_TO_FIELD[label] ?? label;
    const input = page.locator(`input[name="${fieldName}"], textarea[name="${fieldName}"]`);
    await input.clear();
    await input.fill(value);
  }
);

When(
  "I clear the required field {string}",
  async ({ page }, label: string) => {
    const fieldName = LABEL_TO_FIELD[label] ?? label;
    const input = page.locator(`input[name="${fieldName}"], textarea[name="${fieldName}"]`);
    await input.clear();
  }
);

// ── Save / Cancel actions ─────────────────────────────────────────────────────

When("I click Save", async ({ page }) => {
  await page.getByRole("button", { name: /save|บันทึก/i }).click();
  await page.waitForLoadState("networkidle");
});

When("I click Cancel", async ({ page }) => {
  await page.getByRole("button", { name: /cancel|ยกเลิก/i }).click();
  await page.waitForTimeout(200);
});

// ── Post-save / post-cancel assertions ───────────────────────────────────────

Then("the page returns to read-only view", async ({ page }) => {
  await expect(page.getByRole("button", { name: /save|บันทึก/i })).not.toBeVisible({ timeout: 10000 });
  await expect(page.getByRole("button", { name: /cancel|ยกเลิก/i })).not.toBeVisible({ timeout: 10000 });
});

Then(
  "the field {string} shows {string}",
  async ({ page }, _label: string, value: string) => {
    await expect(page.getByText(value, { exact: false })).toBeVisible();
  }
);

Then("the field {string} shows the original value", async ({ page }, _label: string) => {
  // Original trade name for 0105550012345 is "ซีพี ออล จำกัด (มหาชน)" or "CP All Public Company Limited"
  const original = page.getByText(/CP All|ซีพี ออล/i);
  await expect(original.first()).toBeVisible();
});

// ── Validation ────────────────────────────────────────────────────────────────

Then("the page stays in edit mode", async ({ page }) => {
  // Save button should still be visible (still in edit mode)
  await expect(page.getByRole("button", { name: /save|บันทึก/i })).toBeVisible();
});

Then(
  "I see the validation message {string} for {string}",
  async ({ page }, message: string, _label: string) => {
    await expect(page.getByText(message, { exact: false })).toBeVisible();
  }
);

Then("no data is saved", async ({ page }) => {
  // Still in edit mode — save button present means the save was blocked
  await expect(page.getByRole("button", { name: /save|บันทึก/i })).toBeVisible();
});
