// spec: manual request - verify header and description on OpenEMR login page
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('OpenEMR Login Page', () => {
  test('Header and description are visible', async ({ page }) => {
    // 1. Navigate to the OpenEMR login page
    await page.goto('https://demo.openemr.io/b/openemr/interface/login/login.php?site=default');
    await expect(page).toHaveTitle('OpenEMR Login');

    // 2. Verify the header logo image is visible
    const logo = page.locator('img[src*="logo"]');
    await expect(logo).toBeVisible();

    // 3. Verify the description text is visible
    await expect(page.getByText('The most popular open-source Electronic Health Record and Medical Practice Management solution.')).toBeVisible();
  });
});
