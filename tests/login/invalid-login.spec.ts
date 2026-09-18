// spec: specs/openemr-invalid-login.plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Invalid Login Scenarios', () => {
  test('Invalid username and invalid password', async ({ page }) => {
    // 1. Navigate to the OpenEMR login page
    await page.goto('https://demo.openemr.io/b/openemr/interface/login/login.php?site=default');
    const usernameField = page.getByRole('textbox', { name: 'Username' });
    const passwordField = page.getByRole('textbox', { name: 'Password' });
    await expect(usernameField).toBeVisible();
    await expect(passwordField).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();

    // 2. Enter an invalid username (e.g. 'invaliduser') in the Username field
    await usernameField.fill('invaliduser');
    await expect(usernameField).toHaveValue('invaliduser');

    // 3. Enter an invalid password (e.g. 'wrongpassword') in the Password field
    await passwordField.fill('wrongpassword');
    await expect(passwordField).toHaveValue('wrongpassword');

    // 4. Click the Login button
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Invalid username or password')).toBeVisible();
    await expect(usernameField).toBeEmpty();
    await expect(passwordField).toBeEmpty();
    await expect(page).toHaveURL('https://demo.openemr.io/b/openemr/interface/login/login.php?site=default');
  });
});
