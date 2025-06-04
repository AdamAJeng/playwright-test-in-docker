import { test, expect } from '@playwright/test';
import { goToUrlAndVerify } from '../helpers';

test('Kontrollrummet: Date selection', async ({ page, context }) => {
  //─────── Set Date to May 2 ───────//
  await page.clock.setFixedTime(new Date('2025-05-01'));

  const cookiesButton = page.getByText(/Acceptera alla kakor/i );
  const calendar = page.getByRole('figure', { name: /Varje land ansvarar för att/i }).getByLabel('Datum')
  const readyLocator = 'li:has-text("Visar priser för:")';
  const firstOfMay = await page.evaluate(() => {
    return new Date().toISOString().split('T')[0];
  });
  
  await goToUrlAndVerify(page, 'https://www.svk.se/om-kraftsystemet/kontrollrummet/', 
    {
      readyLocator: readyLocator
    }
  );

  await context.clearCookies(); // Clear all cookies

  await cookiesButton.isVisible();
  await cookiesButton.click();
  await expect(cookiesButton).not.toBeVisible();
  
  await page.waitForTimeout(2000);

  //─────── Open calendar date form ────────────//
  await calendar.click()

  //─────── Select the previous month ────────────//
  await page.getByRole('button', { name: /Minska månad med 1/i }).click();
  
  //─────── Select the 1st of previous ────────────//
  await page.getByRole('button', { name: firstOfMay }).click();
  await page.getByRole('button', { name: /Välj/i, exact: true }).click();

  //─────── Verify that the first day of the previous month is selected ────────────//
  await expect(page.locator('li').filter({ hasText: `Visar priser för: ${firstOfMay}` }).first()).toBeVisible({ timeout: 5000 });
  await expect(page.locator('li').filter({ hasText: `Visar priser för: ${firstOfMay}` }).last()).toBeVisible({ timeout: 5000 });
});