import { Page, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open() {
    await this.page.goto('/');
  }

  async verifyHomePageIsDisplayed() {
    await expect(this.page).toHaveTitle(/Restful-booker-platform|Restful Booker Platform/i);
  }
}