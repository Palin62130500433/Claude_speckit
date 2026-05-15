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
