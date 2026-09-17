import * as fs from 'fs';
import * as path from 'path';
import { Page } from '@playwright/test';
import { Logger } from './Logger';

const SCREENSHOTS_DIR = path.resolve(__dirname, '..', 'test-results', 'screenshots');

export class ScreenshotHelper {
  // captures a named, timestamped screenshot for a failed test, separate from Playwright's built-in artifact
  static async captureOnFailure(page: Page, testName: string): Promise<void> {
    if (!fs.existsSync(SCREENSHOTS_DIR)) {
      fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
    }
    const safeName = testName.replace(/[^a-z0-9-_]/gi, '_');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filePath = path.join(SCREENSHOTS_DIR, `${safeName}_${timestamp}.png`);
    try {
      await page.screenshot({ path: filePath, fullPage: true });
      Logger.info(`Failure screenshot saved: ${filePath}`);
    } catch (err) {
      Logger.error(`Failed to capture screenshot: ${(err as Error).message}`);
    }
  }
}
