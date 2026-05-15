# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\e2e\features\admin-edit-company.feature.spec.js >> Admin Inline Edit Company Profile >> Admin cancels edit and changes are discarded
- Location: .features-gen\tests\e2e\features\admin-edit-company.feature.spec.js:33:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/CP All|ซีพี ออล/i).first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText(/CP All|ซีพี ออล/i).first()

```

```yaml
- main:
  - heading "Company Profile" [level=2]
  - button "Edit"
  - term: Registered No.
  - definition: "0105550012345"
  - term: SET Symbol
  - definition: CPALL
  - term: Trade Name
  - definition: Updated Company Name
  - term: Registration Type
  - definition: บริษัทมหาชนจำกัด
  - term: Company Status
  - definition: Active
  - term: Latest Registered Capital (Baht)
  - definition: "8985000000"
  - term: Major Shareholder's Nationality
  - definition: Thai
  - term: Year in Business
  - definition: 38 years
  - term: Registration Date
  - definition: 01/12/1988
  - term: Business Address
  - definition: 313 ถนนสีลม แขวงสีลม เขตบางรัก กรุงเทพมหานคร 10500
  - term: Telephone
  - definition: 02-677-8888
- alert
```

# Test source

```ts
  62  |   await expect(page.getByRole("button", { name: /edit|แก้ไข/i })).not.toBeVisible();
  63  |   await expect(page.getByRole("button", { name: /save|บันทึก/i })).not.toBeVisible();
  64  | });
  65  | 
  66  | // ── Clicking edit ─────────────────────────────────────────────────────────────
  67  | 
  68  | When("I click the edit icon", async ({ page }) => {
  69  |   await page.getByRole("button", { name: /edit|แก้ไข/i }).click();
  70  |   await page.waitForTimeout(200);
  71  | });
  72  | 
  73  | // ── Edit mode assertions ──────────────────────────────────────────────────────
  74  | 
  75  | Then("all editable fields convert to text input boxes", async ({ page }) => {
  76  |   // After clicking edit, at least one text input should be visible
  77  |   const inputs = page.locator("input[type=text], textarea, select").filter({ visible: true });
  78  |   const count = await inputs.count();
  79  |   expect(count).toBeGreaterThan(0);
  80  | });
  81  | 
  82  | Then("the layout remains the same card — no page navigation occurs", async ({ page }) => {
  83  |   expect(page.url()).toMatch(/\/companies\//);
  84  |   await expect(page.locator("dl").first()).toBeVisible();
  85  | });
  86  | 
  87  | Then("I see a Save button", async ({ page }) => {
  88  |   await expect(page.getByRole("button", { name: /save|บันทึก/i })).toBeVisible();
  89  | });
  90  | 
  91  | Then("I see a Cancel button", async ({ page }) => {
  92  |   await expect(page.getByRole("button", { name: /cancel|ยกเลิก/i })).toBeVisible();
  93  | });
  94  | 
  95  | // ── Field editing ─────────────────────────────────────────────────────────────
  96  | 
  97  | const LABEL_TO_FIELD: Record<string, string> = {
  98  |   "Trade Name": "tradeName",
  99  |   "ชื่อการค้า": "tradeName",
  100 |   "SET Symbol": "setSymbol",
  101 |   "สัญลักษณ์ SET": "setSymbol",
  102 |   "Registration Type": "registrationType",
  103 |   "ประเภทการจดทะเบียน": "registrationType",
  104 |   "Latest Registered Capital (Baht)": "registeredCapitalBaht",
  105 |   "ทุนจดทะเบียนล่าสุด (บาท)": "registeredCapitalBaht",
  106 |   "Major Shareholder's Nationality": "majorShareholderNationality",
  107 |   "สัญชาติผู้ถือหุ้นรายใหญ่": "majorShareholderNationality",
  108 |   "Business Address": "businessAddress",
  109 |   "ที่อยู่ประกอบธุรกิจ": "businessAddress",
  110 |   "Telephone": "telephone",
  111 |   "โทรศัพท์": "telephone",
  112 | };
  113 | 
  114 | When(
  115 |   "I change the {string} field to {string}",
  116 |   async ({ page }, label: string, value: string) => {
  117 |     const fieldName = LABEL_TO_FIELD[label] ?? label;
  118 |     const input = page.locator(`input[name="${fieldName}"], textarea[name="${fieldName}"]`);
  119 |     await input.clear();
  120 |     await input.fill(value);
  121 |   }
  122 | );
  123 | 
  124 | When(
  125 |   "I clear the required field {string}",
  126 |   async ({ page }, label: string) => {
  127 |     const fieldName = LABEL_TO_FIELD[label] ?? label;
  128 |     const input = page.locator(`input[name="${fieldName}"], textarea[name="${fieldName}"]`);
  129 |     await input.clear();
  130 |   }
  131 | );
  132 | 
  133 | // ── Save / Cancel actions ─────────────────────────────────────────────────────
  134 | 
  135 | When("I click Save", async ({ page }) => {
  136 |   await page.getByRole("button", { name: /save|บันทึก/i }).click();
  137 |   await page.waitForLoadState("networkidle");
  138 | });
  139 | 
  140 | When("I click Cancel", async ({ page }) => {
  141 |   await page.getByRole("button", { name: /cancel|ยกเลิก/i }).click();
  142 |   await page.waitForTimeout(200);
  143 | });
  144 | 
  145 | // ── Post-save / post-cancel assertions ───────────────────────────────────────
  146 | 
  147 | Then("the page returns to read-only view", async ({ page }) => {
  148 |   await expect(page.getByRole("button", { name: /save|บันทึก/i })).not.toBeVisible({ timeout: 10000 });
  149 |   await expect(page.getByRole("button", { name: /cancel|ยกเลิก/i })).not.toBeVisible({ timeout: 10000 });
  150 | });
  151 | 
  152 | Then(
  153 |   "the field {string} shows {string}",
  154 |   async ({ page }, _label: string, value: string) => {
  155 |     await expect(page.getByText(value, { exact: false })).toBeVisible();
  156 |   }
  157 | );
  158 | 
  159 | Then("the field {string} shows the original value", async ({ page }, _label: string) => {
  160 |   // Original trade name for 0105550012345 is "ซีพี ออล จำกัด (มหาชน)" or "CP All Public Company Limited"
  161 |   const original = page.getByText(/CP All|ซีพี ออล/i);
> 162 |   await expect(original.first()).toBeVisible();
      |                                  ^ Error: expect(locator).toBeVisible() failed
  163 | });
  164 | 
  165 | // ── Validation ────────────────────────────────────────────────────────────────
  166 | 
  167 | Then("the page stays in edit mode", async ({ page }) => {
  168 |   // Save button should still be visible (still in edit mode)
  169 |   await expect(page.getByRole("button", { name: /save|บันทึก/i })).toBeVisible();
  170 | });
  171 | 
  172 | Then(
  173 |   "I see the validation message {string} for {string}",
  174 |   async ({ page }, message: string, _label: string) => {
  175 |     await expect(page.getByText(message, { exact: false })).toBeVisible();
  176 |   }
  177 | );
  178 | 
  179 | Then("no data is saved", async ({ page }) => {
  180 |   // Still in edit mode — save button present means the save was blocked
  181 |   await expect(page.getByRole("button", { name: /save|บันทึก/i })).toBeVisible();
  182 | });
  183 | 
```