import { test } from '@playwright/test';
import { goToUrlAndVerify, clickButtonByLabel, fillFieldByLabel } from '../helpers';

test('Testim: Book A Trip', async ({ page }) => {
  const readyLocator = 'span:has-text("Back to top")';

  await goToUrlAndVerify(page, 'https://demo.testim.io/', 
    {
      readyLocator: readyLocator
    }
  );
  
  await page.getByRole('button', { name: /Load more/i }).click();

  //──────────────── Book a Trip to Cuozhou ────────────────//
  await clickButtonByLabel(page, /Book/i, /Cuozhou/i);

  // Checkout page
  //──────────────── Name ────────────────//  
  //await fillFieldByLabel(page, 'Name', 'John Doe');
  await page.locator('div').filter({ hasText: /^Name0\/30$/ }).getByRole('textbox').fill('John Doe');
  
  //──────────────── Email ────────────────//  
  await page.locator('input[type="email"]').fill('a@b.com');


  //──────────────── Social Security Number ────────────────//
  //await fillFieldByLabel(page, 'Social Security Number', '444-33-2222');
  await page.locator('div').filter({ hasText: /^Social Security Number$/ }).getByRole('textbox').fill('444-33-2222');
  
  //──────────────── Phone Number ────────────────//
  //await fillFieldByLabel(page, 'Phone Number', '212-456-7890');
  await page.locator('input[type="tel"]').fill('212-456-7890');
  
  //──────────────── Promo Code ────────────────//
  //await fillFieldByLabel(page, 'I have a promo code', '34233');
  await page.locator('input[name="promo"]').fill('34233');
  await page.getByRole('button', { name: /Apply/i }).click();
  
  //──────────────── Terms and Conditions ────────────────//
  await page.locator('label').filter({ hasText: /I agree to the terms and conditions/i }).locator('div').click();
  
  //──────────────── Pay now ────────────────//
  await page.getByRole('button', { name: /Pay now/i }).click();
});
