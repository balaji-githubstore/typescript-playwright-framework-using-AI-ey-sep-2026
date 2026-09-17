import { Page } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { HomePageLocators } from '../locators/HomePageLocators';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(baseUrl: string): Promise<void> {
    await this.navigateTo(baseUrl);
  }

  async clickGetStarted(): Promise<void> {
    await this.click(HomePageLocators.getStartedLink);
  }

  async getHeadingText(): Promise<string> {
    return this.getText(HomePageLocators.heading);
  }
}
