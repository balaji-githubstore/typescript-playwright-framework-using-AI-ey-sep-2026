import { test, expect } from '../base/BaseTest';
import ConfigManager from '../config/ConfigManager';

test.describe('Playwright.dev homepage', () => {
  test('should display the correct heading', async ({ homePage }) => {
    await homePage.open(ConfigManager.get('baseUrl'));
    const heading = await homePage.getHeadingText();
    expect(heading).toContain('Playwright');
  });

  test('should navigate to Get started page', async ({ homePage, page }) => {
    await homePage.open(ConfigManager.get('baseUrl'));
    await homePage.clickGetStarted();
    await expect(page).toHaveURL(/.*intro/);
  });
});
