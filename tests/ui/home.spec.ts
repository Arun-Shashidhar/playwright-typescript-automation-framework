import { test } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test('@smoke @ui should open the application home page', async ({ page }) => {
  const homePage = new HomePage(page);

  await homePage.open();
  await homePage.verifyHomePageIsDisplayed();
});