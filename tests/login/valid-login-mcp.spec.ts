// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Valid Login Scenarios', () => {
  test('Valid username and valid password', async ({ page }) => {
    // 1. Navigate to the OpenEMR login page
    await page.goto('https://demo.openemr.io/b/openemr/interface/login/login.php?site=default');
    const usernameField = page.getByRole('textbox', { name: 'Username' });
    const passwordField = page.getByRole('textbox', { name: 'Password' });
    await expect(usernameField).toBeVisible();
    await expect(passwordField).toBeVisible();

    // 2. Enter valid credentials
    await usernameField.fill('admin');
    await passwordField.fill('pass');

    // 3. Click the Login button
    await page.getByRole('button', { name: 'Login' }).click();

    // 4. User is redirected to the OpenEMR dashboard
    await expect(page).toHaveURL(/interface\/main\/tabs\/main\.php/);
    await expect(page).toHaveTitle('OpenEMR');
  });
});
