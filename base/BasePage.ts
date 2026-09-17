import { Page, Locator } from '@playwright/test';
import { Logger } from '../utils/Logger';

// Wraps common Playwright actions with logging/error context so Page Objects stay declarative
export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(url: string): Promise<void> {
    Logger.info(`Navigating to: ${url}`);
    await this.page.goto(url);
  }

  async click(selector: string): Promise<void> {
    Logger.info(`Clicking element: ${selector}`);
    await this.page.locator(selector).click();
  }

  async fill(selector: string, value: string): Promise<void> {
    Logger.info(`Filling element ${selector} with value`);
    await this.page.locator(selector).fill(value);
  }

  async getText(selector: string): Promise<string> {
    const text = await this.page.locator(selector).innerText();
    Logger.info(`Retrieved text from ${selector}: ${text}`);
    return text;
  }

  async isVisible(selector: string): Promise<boolean> {
    return this.page.locator(selector).isVisible();
  }

  async waitForElement(selector: string, timeout = 10000): Promise<void> {
    Logger.info(`Waiting for element: ${selector}`);
    await this.page.locator(selector).waitFor({ state: 'visible', timeout });
  }

  async selectOption(selector: string, value: string): Promise<void> {
    Logger.info(`Selecting option "${value}" on ${selector}`);
    await this.page.locator(selector).selectOption(value);
  }

  locator(selector: string): Locator {
    return this.page.locator(selector);
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }
}
