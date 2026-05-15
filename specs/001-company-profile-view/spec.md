# Feature Specification: Company Profile View

**Feature Branch**: `001-company-profile-view`  
**Created**: 2026-05-13  
**Status**: Draft  
**Input**: User description: "I want to create a page for viewing company details. The Company Profile feature provides general information including: Registered No., SET Symbol, Trade Name, Registration Type, Company Status, Latest Registered Capital (Baht), Major Shareholder's Nationality, Year in Business, Registration Date, Business Address, and Telephone. Only admin role is able to edit company information. The company profile displays in the same box when an Admin clicks the edit icon, with each field separating into a text box input."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Company General Information (Priority: P1)

A user navigates to a company's profile page and is shown all general information about that company in a clear, organized layout — displayed in either Thai or English based on the user's language preference. The page fetches the latest data from an external data source so the user always sees current, accurate information.

**Why this priority**: Viewing company details is the core purpose of the feature. Without this, no other story has value. It also directly fulfills the requirement that users receive the most up-to-date company information available.

**Independent Test**: Can be fully tested by navigating to a company profile page and verifying that all 11 required information fields are displayed with correct labels and values in both Thai and English. Delivers the complete core value of the feature.

**Acceptance Scenarios**:

1. **Given** a user is on the company profile page with their language set to Thai, **When** the page finishes loading, **Then** all 11 fields and their labels are displayed in Thai.
2. **Given** a user is on the company profile page with their language set to English, **When** the page finishes loading, **Then** all 11 fields and their labels are displayed in English.
3. **Given** a user views the company profile page, **When** the page loads, **Then** the data shown reflects the most recently available information retrieved from the data source — not cached or outdated data.
4. **Given** a company has a SET Symbol, **When** the user views the profile, **Then** the SET Symbol field displays the correct and current symbol.
5. **Given** a company is not listed on SET, **When** the user views the profile, **Then** the SET Symbol field clearly indicates that no symbol is available (e.g., "N/A" or "–") rather than appearing blank.

---

### User Story 2 - Handle Missing or Unavailable Company Data (Priority: P2)

A user views a company profile where some fields have no recorded data. The page clearly shows which fields are unavailable, so the user understands this is a data gap — not a system problem.

**Why this priority**: Real-world company data is often incomplete. Showing missing fields gracefully maintains user trust and prevents confusion between "data not available" and "something went wrong."

**Independent Test**: Can be fully tested by viewing a profile of a company with one or more missing fields and confirming each empty field shows a clear placeholder. Delivers value by ensuring data integrity is communicated correctly.

**Acceptance Scenarios**:

1. **Given** a company profile has one or more fields with no recorded data, **When** the user views the page, **Then** each missing field displays a clear placeholder (e.g., "–" or "ไม่มีข้อมูล" / "Not available") in the user's selected language instead of appearing blank.
2. **Given** a company profile page loads, **When** any individual field's data is unavailable, **Then** all other fields with valid data are still displayed correctly without affecting the rest of the page.

---

### User Story 3 - Access Company Profile via Direct Link (Priority: P3)

A user accesses a company's profile page directly through a unique URL or navigates to it from another part of the system (e.g., a search results page or company list). The page reliably fetches and displays the correct company's latest information.

**Why this priority**: Reliable, addressable access to each company profile enables users to bookmark or share specific company pages, but depends on the core view story being completed first.

**Independent Test**: Can be fully tested by navigating to a company profile URL and confirming the correct company's current information is displayed. A non-existent company URL must show a clear "not found" message.

**Acceptance Scenarios**:

1. **Given** a user enters or follows a direct URL for a specific company, **When** the page loads, **Then** the profile of the correct company is displayed with the latest available data.
2. **Given** a user attempts to access a company profile for a company that does not exist, **When** the page loads, **Then** the user sees a clear "not found" message in their selected language rather than an error or blank page.

---

### User Story 4 - Admin Edits Company Information Inline (Priority: P2)

An Admin user views the company profile page and sees an edit icon alongside the displayed information. When the Admin clicks the edit icon, the page remains in the same layout but each field transforms into a text input box, allowing the Admin to update any field value. After editing, the Admin can save the changes or cancel and revert to the original read-only view.

**Why this priority**: Keeping data accurate and up-to-date is critical. The inline edit pattern (same box, no page navigation) gives Admins an efficient way to correct information without leaving the profile view, reducing friction and errors.

**Independent Test**: Can be fully tested by logging in as an Admin, navigating to a company profile, clicking the edit icon, modifying one or more fields, saving, and verifying the updated values are shown. A non-Admin user viewing the same page must not see the edit icon at all.

**Acceptance Scenarios**:

1. **Given** an Admin is viewing a company profile page, **When** the page loads, **Then** an edit icon is visible on the profile information section.
2. **Given** an Admin clicks the edit icon, **When** the page transitions to edit mode, **Then** all editable fields convert to text input boxes within the same layout and box — no navigation to a separate page occurs.
3. **Given** the Admin is in edit mode, **When** the Admin modifies one or more fields and clicks Save, **Then** the updated values are submitted via API, the page returns to read-only view, and the updated information is displayed.
4. **Given** the Admin is in edit mode, **When** the Admin clicks Cancel, **Then** all fields revert to their original values and the page returns to read-only view with no changes saved.
5. **Given** a non-Admin authenticated user is viewing a company profile page, **When** the page loads, **Then** no edit icon is visible and the user has no way to enter edit mode.
6. **Given** the Admin submits an edit with one or more required fields left empty, **When** the save action is triggered, **Then** the system displays a validation message in the user's selected language indicating which fields are required, without saving.

---

### Edge Cases

- What happens when a company's Registered Capital is zero or has not been updated in the data source?
- How does the system handle a Business Address that spans multiple lines or contains special characters?
- What happens if a user attempts to access a profile for a company ID that does not exist?
- How does the system behave if the Telephone field contains multiple numbers?
- What if the data source returns an error or is temporarily unavailable when the page is loaded?
- What if the Registration Date format from the data source is in a different locale (e.g., Buddhist Era vs. Gregorian calendar)?
- What happens if the API call to save Admin edits fails (e.g., network error or server error)?
- What happens if an Admin navigates away from the page while in edit mode with unsaved changes?
- What if two Admin users attempt to edit the same company profile at the same time?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a company profile page containing all general information for a specified company, sourced from an external data service via API.
- **FR-002**: System MUST display the following fields on the company profile page: Registered No., SET Symbol, Trade Name, Registration Type, Company Status, Latest Registered Capital (Baht), Major Shareholder's Nationality, Year in Business, Registration Date, Business Address, and Telephone.
- **FR-003**: System MUST always retrieve the latest available data from the API when the company profile page is loaded, ensuring users see current and accurate information.
- **FR-004**: System MUST support displaying all page content — including field labels, placeholders, and messages — in both Thai and English, based on the user's selected language.
- **FR-005**: System MUST display a clear label for each information field in the user's selected language so users can identify what each value represents.
- **FR-006**: System MUST display a visible, language-appropriate placeholder (e.g., "–" or "ไม่มีข้อมูล" / "Not available") for any field that has no recorded data.
- **FR-007**: System MUST display a user-friendly error message in the user's selected language when the data source is unavailable or returns an error, rather than showing a blank page or technical error.
- **FR-008**: Users MUST be able to reach a company profile page via a unique, addressable URL or navigational link.
- **FR-009**: System MUST display a language-appropriate "not found" message when a user attempts to view a profile for a non-existent company.
- **FR-010**: System MUST present the page in a readable, organized layout that groups related fields logically and is accessible on both desktop and mobile screen sizes.
- **FR-011**: System MUST differentiate between two user roles: **Admin** (can view and edit) and **Standard User** (can view only). Role is determined at login and enforced on the company profile page.
- **FR-012**: System MUST display an edit icon on the company profile information section only when the logged-in user has the Admin role.
- **FR-013**: When an Admin clicks the edit icon, system MUST switch the profile section to edit mode — all editable fields convert to text input boxes within the same layout and box, without navigating to a separate page.
- **FR-014**: In edit mode, system MUST provide Save and Cancel actions. Clicking Save submits all changed field values via API and returns to read-only view with updated data. Clicking Cancel discards all changes and returns to read-only view with original data.
- **FR-015**: System MUST validate required fields before saving; if any required field is empty, system MUST display a language-appropriate validation message and prevent submission until resolved.
- **FR-016**: System MUST display a language-appropriate error message if the API call to save Admin edits fails, without discarding the Admin's unsaved changes from the edit mode view.
- **FR-017**: System MUST warn the Admin with a language-appropriate confirmation prompt if they attempt to navigate away from the page while unsaved changes exist in edit mode.

### Key Entities

- **User Role**: Determines what actions a user can perform on the company profile page.
  - **Admin**: Can view all 11 fields and edit company information via inline editing. Sees the edit icon.
  - **Standard User**: Can view all 11 fields in read-only mode. Does not see the edit icon.

- **Company Profile**: Represents a registered company's general information as displayed on the profile page. Retrieved via API and always reflects the latest available data. Key attributes include:
  - Registered No. — unique identifier assigned by the registrar
  - SET Symbol — stock exchange symbol (optional; only for companies listed on the Stock Exchange of Thailand)
  - Trade Name — the name under which the company operates
  - Registration Type — the legal form of the company (e.g., limited company, partnership)
  - Company Status — current operational status (e.g., active, dissolved)
  - Latest Registered Capital (Baht) — the most recently recorded registered capital in Thai Baht
  - Major Shareholder's Nationality — the nationality of the principal shareholder(s)
  - Year in Business — the number of years since the company's registration date
  - Registration Date — the date the company was officially registered
  - Business Address — the registered physical address of the company
  - Telephone — the company's contact telephone number(s)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view all required company information fields on a single page without requiring additional navigation or interaction.
- **SC-002**: All available company information is displayed within 3 seconds of navigating to the profile page under normal network conditions.
- **SC-003**: All data displayed on the company profile page reflects the most recently available information from the data source — verified by comparing page values against the latest data source records.
- **SC-004**: Fields with missing data show a clear, language-appropriate placeholder in 100% of cases — no field appears blank without explanation.
- **SC-005**: Users can successfully locate and read a specific company information field (e.g., Registered No. or Business Address) on their first attempt at a rate of 90% or higher.
- **SC-006**: All page content — labels, values, placeholders, and messages — is fully displayed in the user's selected language (Thai or English) with no mixed-language text in a single session.
- **SC-007**: Navigating to a non-existent company profile results in a recognizable, language-appropriate "not found" state in 100% of cases, with no unhandled errors shown to the user.
- **SC-008**: When the data source is temporarily unavailable, users see a clear, friendly error message rather than a blank page or technical error output.
- **SC-009**: The edit icon is visible to Admin users and invisible to Standard Users in 100% of cases — verified by testing both role types on the same company profile page.
- **SC-010**: When an Admin clicks the edit icon, all fields transition to text input boxes within the same layout in under 1 second, with no page navigation occurring.
- **SC-011**: Admin edits submitted successfully via API are reflected in the read-only view immediately after saving, without requiring a manual page refresh.
- **SC-012**: If a save attempt fails due to an API error, the Admin's unsaved input is preserved in edit mode in 100% of cases — no data loss occurs.

## Assumptions

- The company profile page is read-only for Standard Users. Admin users can edit company information directly on the page via inline editing triggered by an edit icon.
- Company data is sourced from an external API (e.g., a Department of Business Development or internal registry service); this page does not store or manage the data itself.
- The SET Symbol field is optional and applies only to companies listed on the Stock Exchange of Thailand; non-listed companies will have this field marked as unavailable.
- Users accessing the company profile page are authenticated and have the appropriate permissions to view company information.
- The page supports Thai and English; the user's language preference is already managed by the application and does not need to be set on this page.
- Registration Date may be displayed in both Buddhist Era (B.E.) and Gregorian calendar formats based on the user's selected language (Thai → B.E., English → Gregorian).
- "Year in Business" is derived from the Registration Date and does not need to be stored as a separate data field.
- Multiple telephone numbers, if present, may be displayed together in the Telephone field.
- Search, filtering, or comparison of companies is out of scope for this feature — this page covers viewing and (for Admins) inline editing of a single company's profile only.
- Editing is limited to the 11 general information fields; other company data not listed in this spec is out of scope for editing.
- Admin role assignment and management (i.e., who is granted Admin access) is handled by an existing user management system, not by this feature.
- The API provides sufficient data to populate all 11 required fields; any fields not returned by the API are treated as unavailable.

## Acceptance Scenarios

```gherkin
Feature: View Company Profile
  As a user of the system
  I want to view a company's general information on a profile page
  So that I can access accurate and up-to-date company details

  Background:
    Given the company "0105550012345" exists in the system with full data
    And the company "0107560000001" exists with several fields missing

  # ─── US1: View Company General Information ───────────────────────────────────

  Scenario: Display all 11 fields in English
    Given I am viewing the company profile for "0105550012345" in English
    When the page finishes loading
    Then I see the field "Registered No." with a value
    And I see the field "SET Symbol" with a value
    And I see the field "Trade Name" with a value
    And I see the field "Registration Type" with a value
    And I see the field "Company Status" with a value
    And I see the field "Latest Registered Capital (Baht)" with a value
    And I see the field "Major Shareholder's Nationality" with a value
    And I see the field "Year in Business" with a value
    And I see the field "Registration Date" with a value
    And I see the field "Business Address" with a value
    And I see the field "Telephone" with a value

  Scenario: Display all 11 fields in Thai
    Given I am viewing the company profile for "0105550012345" in Thai
    When the page finishes loading
    Then I see the field "เลขทะเบียน" with a value
    And I see the field "สัญลักษณ์ SET" with a value
    And I see the field "ชื่อการค้า" with a value
    And I see the field "ประเภทการจดทะเบียน" with a value
    And I see the field "สถานะบริษัท" with a value
    And I see the field "ทุนจดทะเบียนล่าสุด (บาท)" with a value
    And I see the field "สัญชาติผู้ถือหุ้นรายใหญ่" with a value
    And I see the field "อายุธุรกิจ" with a value
    And I see the field "วันที่จดทะเบียน" with a value
    And I see the field "ที่อยู่ประกอบธุรกิจ" with a value
    And I see the field "โทรศัพท์" with a value

  Scenario: SET Symbol is shown for a SET-listed company
    Given I am viewing the company profile for "0105550012345" in English
    When the page finishes loading
    Then I see the field "SET Symbol" with value "CPALL"

  Scenario: SET Symbol shows placeholder for a non-listed company
    Given I am viewing the company profile for "0105536127408" in English
    When the page finishes loading
    Then the field "SET Symbol" displays the not-available placeholder

  # ─── US2: Handle Missing or Unavailable Company Data ─────────────────────────

  Scenario: Missing fields show a language-appropriate placeholder in English
    Given I am viewing the company profile for "0107560000001" in English
    When the page finishes loading
    Then every field with no data shows the placeholder "–"
    And all fields with data are still displayed correctly

  Scenario: Missing fields show a language-appropriate placeholder in Thai
    Given I am viewing the company profile for "0107560000001" in Thai
    When the page finishes loading
    Then every field with no data shows the placeholder "ไม่มีข้อมูล"
    And all fields with data are still displayed correctly

  Scenario: API unavailable shows a friendly error message in English
    Given the data source is temporarily unavailable
    When I navigate to the company profile for "0105550012345" in English
    Then I see an error message "Unable to load company information"
    And I see a retry button

  Scenario: API unavailable shows a friendly error message in Thai
    Given the data source is temporarily unavailable
    When I navigate to the company profile for "0105550012345" in Thai
    Then I see an error message "ไม่สามารถโหลดข้อมูลได้ในขณะนี้"
    And I see a retry button

  # ─── US3: Access Company Profile via Direct Link ──────────────────────────────

  Scenario: Navigating to a valid company URL shows the correct profile
    Given I navigate directly to the URL "/en/companies/0105550012345"
    When the page finishes loading
    Then I see the field "Registered No." with value "0105550012345"

  Scenario: Navigating to a non-existent company shows "not found" in English
    Given I navigate directly to the URL "/en/companies/0000000000000"
    When the page finishes loading
    Then I see the message "Company Not Found"

  Scenario: Navigating to a non-existent company shows "not found" in Thai
    Given I navigate directly to the URL "/th/companies/0000000000000"
    When the page finishes loading
    Then I see the message "ไม่พบข้อมูลบริษัท"


Feature: Admin Inline Edit Company Profile
  As an Admin user
  I want to edit company information directly on the profile page
  So that I can keep company data accurate without navigating away

  Background:
    Given the company "0105550012345" exists in the system with full data

  # ─── US4: Admin Edits Company Information Inline ──────────────────────────────

  Scenario: Admin sees the edit icon on the profile page
    Given I am viewing the company profile for "0105550012345" as an Admin
    When the page finishes loading
    Then I see the edit icon on the profile card

  Scenario: Clicking the edit icon switches all fields to text inputs in place
    Given I am viewing the company profile for "0105550012345" as an Admin
    When I click the edit icon
    Then all editable fields convert to text input boxes
    And the layout remains the same card — no page navigation occurs
    And I see a Save button
    And I see a Cancel button

  Scenario: Admin saves edited company information successfully
    Given I am in edit mode on the company profile for "0105550012345"
    When I change the "Trade Name" field to "Updated Company Name"
    And I click Save
    Then the page returns to read-only view
    And the field "Trade Name" shows "Updated Company Name"

  Scenario: Admin cancels edit and changes are discarded
    Given I am in edit mode on the company profile for "0105550012345"
    When I change the "Trade Name" field to "Temporary Change"
    And I click Cancel
    Then the page returns to read-only view
    And the field "Trade Name" shows the original value

  Scenario: Standard user does not see the edit icon
    Given I am viewing the company profile for "0105550012345" as a Standard User
    When the page finishes loading
    Then the edit icon is not visible
    And there is no way to enter edit mode

  Scenario: Saving with a required field empty shows a validation message in English
    Given I am in edit mode on the company profile for "0105550012345" in English
    When I clear the required field "Trade Name"
    And I click Save
    Then the page stays in edit mode
    And I see the validation message "This field is required" for "Trade Name"
    And no data is saved

  Scenario: Saving with a required field empty shows a validation message in Thai
    Given I am in edit mode on the company profile for "0105550012345" in Thai
    When I clear the required field "Trade Name"
    And I click Save
    Then the page stays in edit mode
    And I see the validation message "กรุณากรอกข้อมูล" for "Trade Name"
    And no data is saved

  Scenario Outline: Role-based visibility of the edit icon
    Given I am viewing the company profile for "0105550012345" as a <role>
    When the page finishes loading
    Then the edit icon is <visibility>

    Examples:
      | role          | visibility  |
      | Admin         | visible     |
      | Standard User | not visible |
```
