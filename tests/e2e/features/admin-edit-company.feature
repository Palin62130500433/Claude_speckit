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
