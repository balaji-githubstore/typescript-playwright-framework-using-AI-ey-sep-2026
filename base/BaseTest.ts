import { test as base, TestInfo } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ScreenshotHelper } from '../utils/ScreenshotHelper';

interface Pages {
  homePage: HomePage;
}

// Extends Playwright's test with injected page objects and a named failure screenshot hook
export const test = base.extend<Pages>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
});

test.afterEach(async ({ page }, testInfo: TestInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    await ScreenshotHelper.captureOnFailure(page, testInfo.title);
  }
});

export { expect } from '@playwright/test';
