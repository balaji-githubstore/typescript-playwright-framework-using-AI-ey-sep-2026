# OpenEMR Login - Invalid Login Scenarios

## Application Overview

Test plan for the OpenEMR Login page (https://demo.openemr.io/b/openemr/interface/login/login.php?site=default) focused on invalid login scenarios. The login form has Username, Password, Language dropdown (defaults to "Default - English (Standard)"), and a Login button. On invalid credentials, the server displays the message "Invalid username or password" above the form and clears the input fields, keeping the user on the login page.

## Test Scenarios

### 1. Invalid Login Scenarios

**Seed:** `seed.spec.ts`

#### 1.1. Invalid username and invalid password

**File:** `tests/login/invalid-login.spec.ts`

**Steps:**
  1. Navigate to the OpenEMR login page
    - expect: Login page loads with Username, Password fields, Language dropdown, and Login button visible
  2. Enter an invalid username (e.g. 'invaliduser') in the Username field
    - expect: Username field shows the entered value
  3. Enter an invalid password (e.g. 'wrongpassword') in the Password field
    - expect: Password field shows masked characters
  4. Click the Login button
    - expect: Page reloads and displays the message 'Invalid username or password'
    - expect: Username and Password fields are cleared/empty
    - expect: User remains on the login page (URL unchanged)

#### 1.2. Valid username with invalid password

**File:** `tests/login/invalid-login.spec.ts`

**Steps:**
  1. Navigate to the OpenEMR login page
    - expect: Login page loads successfully
  2. Enter a known valid username (e.g. 'admin') in the Username field
    - expect: Username field shows the entered value
  3. Enter an incorrect password (e.g. 'wrongpass123') in the Password field
    - expect: Password field accepts the input
  4. Click the Login button
    - expect: Message 'Invalid username or password' is displayed
    - expect: Fields are cleared
    - expect: User remains on login page

#### 1.3. Invalid username with valid-looking password

**File:** `tests/login/invalid-login.spec.ts`

**Steps:**
  1. Navigate to the OpenEMR login page
    - expect: Login page loads successfully
  2. Enter a nonexistent username (e.g. 'nouser999') in the Username field
    - expect: Username field shows the entered value
  3. Enter any password (e.g. 'Password123') in the Password field
    - expect: Password field accepts the input
  4. Click the Login button
    - expect: Message 'Invalid username or password' is displayed
    - expect: No indication is given as to whether the username or password specifically was wrong (no username enumeration)

#### 1.4. Empty username and empty password

**File:** `tests/login/invalid-login.spec.ts`

**Steps:**
  1. Navigate to the OpenEMR login page
    - expect: Login page loads successfully
  2. Leave the Username field empty
    - expect: Username field remains empty
  3. Leave the Password field empty
    - expect: Password field remains empty
  4. Click the Login button
    - expect: Form does not submit successfully, or an 'Invalid username or password' / required-field message is shown
    - expect: User remains on the login page

#### 1.5. Empty username with a password entered

**File:** `tests/login/invalid-login.spec.ts`

**Steps:**
  1. Navigate to the OpenEMR login page
    - expect: Login page loads successfully
  2. Leave the Username field empty
    - expect: Username field remains empty
  3. Enter a password (e.g. 'somepassword') in the Password field
    - expect: Password field accepts the input
  4. Click the Login button
    - expect: Login is rejected with an error/validation message
    - expect: User remains on the login page

#### 1.6. Username entered with empty password

**File:** `tests/login/invalid-login.spec.ts`

**Steps:**
  1. Navigate to the OpenEMR login page
    - expect: Login page loads successfully
  2. Enter a username (e.g. 'admin') in the Username field
    - expect: Username field shows the entered value
  3. Leave the Password field empty
    - expect: Password field remains empty
  4. Click the Login button
    - expect: Login is rejected with an error/validation message
    - expect: User remains on the login page

#### 1.7. Username and password with leading/trailing whitespace

**File:** `tests/login/invalid-login.spec.ts`

**Steps:**
  1. Navigate to the OpenEMR login page
    - expect: Login page loads successfully
  2. Enter '  admin  ' (with leading/trailing spaces) in the Username field
    - expect: Username field shows the entered value including spaces
  3. Enter '  wrongpass  ' (with leading/trailing spaces) in the Password field
    - expect: Password field accepts the input
  4. Click the Login button
    - expect: Login fails with 'Invalid username or password' since whitespace is treated as part of the credential (or verify app's trimming behavior is consistent)

#### 1.8. SQL injection attempt in username field

**File:** `tests/login/invalid-login.spec.ts`

**Steps:**
  1. Navigate to the OpenEMR login page
    - expect: Login page loads successfully
  2. Enter a SQL injection payload (e.g. "' OR '1'='1") in the Username field
    - expect: Username field accepts the input as plain text
  3. Enter any value in the Password field
    - expect: Password field accepts the input
  4. Click the Login button
    - expect: Login is rejected with 'Invalid username or password'
    - expect: No SQL error or unexpected behavior is exposed
    - expect: Application does not grant unauthorized access

#### 1.9. Script injection (XSS) attempt in username field

**File:** `tests/login/invalid-login.spec.ts`

**Steps:**
  1. Navigate to the OpenEMR login page
    - expect: Login page loads successfully
  2. Enter a script payload (e.g. '<script>alert(1)</script>') in the Username field
    - expect: Username field accepts the input as plain text
  3. Enter any value in the Password field
    - expect: Password field accepts the input
  4. Click the Login button
    - expect: Login is rejected with 'Invalid username or password'
    - expect: No script executes (no alert dialog appears)
    - expect: Payload is safely escaped/rendered as text if reflected anywhere on the page

#### 1.10. Excessively long username and password input

**File:** `tests/login/invalid-login.spec.ts`

**Steps:**
  1. Navigate to the OpenEMR login page
    - expect: Login page loads successfully
  2. Enter a very long string (e.g. 500+ characters) in the Username field
    - expect: Username field accepts or truncates the input without error
  3. Enter a very long string (e.g. 500+ characters) in the Password field
    - expect: Password field accepts the input
  4. Click the Login button
    - expect: Application handles the long input gracefully without crashing or throwing a server error
    - expect: Login is rejected with an appropriate error message

#### 1.11. Repeated failed login attempts (brute-force / lockout check)

**File:** `tests/login/invalid-login.spec.ts`

**Steps:**
  1. Navigate to the OpenEMR login page
    - expect: Login page loads successfully
  2. Attempt login with invalid credentials 5 times in a row
    - expect: Each attempt is rejected and returns to the login page
  3. Observe application behavior after repeated failures
    - expect: Application either continues to show 'Invalid username or password', or enforces an account lockout / CAPTCHA / delay after repeated failures, consistent with its security design
    - expect: No sensitive information (e.g. stack traces) is leaked

#### 1.12. Invalid login with different language selected

**File:** `tests/login/invalid-login.spec.ts`

**Steps:**
  1. Navigate to the OpenEMR login page
    - expect: Login page loads successfully
  2. Change the Language dropdown to a non-default language (e.g. 'French (Standard)')
    - expect: Selected language is reflected in the dropdown
  3. Enter invalid username and invalid password
    - expect: Fields accept the entered values
  4. Click the Login button
    - expect: Error message is displayed (translated if supported, or default English fallback)
    - expect: Selected language persists after the failed login attempt
