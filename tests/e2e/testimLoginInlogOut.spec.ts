import { test, expect } from '@playwright/test';
import { goToUrlAndVerify, fillFieldByLabel } from '../helpers';

test('Testim: Login and Logout', async ({ page }) => {
  const readyLocator = 'span:has-text("Back to top")';
  const confirmationText = page.locator('span').filter({ hasText: /Hello, John/i });

  await goToUrlAndVerify(page, 'https://demo.testim.io/', 
    {
      readyLocator: readyLocator
    }
  );

  await page.getByRole('button', { name: /Log in/i }).click();
  
  await fillFieldByLabel(page, 'Username', 'John');
  await fillFieldByLabel(page, 'Password', 'Doe');
  
  await page.locator('button[type="submit"]').click();
  
  // Assert that the login was successful
  await expect(confirmationText).toBeVisible();
  await confirmationText.click();
  
  // Log out
  await page.getByRole('link', { name: /Log out/i }).click();
});