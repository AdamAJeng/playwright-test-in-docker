import { test, expect } from '@playwright/test';
import { goToUrlAndVerify,clickDynamicButtonRepeatedly } from '../helpers';

test.setTimeout(60000);

test('Kontrollrummet: Interact with slider', async ({ page, context }) => {
  const readyLocator = 'li:has-text("Visar priser för:")';
  const cookiesButton = page.getByText(/Acceptera alla kakor/i );
  const hourelyPrice = page.locator('li').filter({ hasText: `Visar priser för: 2023-10-02 01:00` }).first();
    
  await goToUrlAndVerify(page, 'https://www.svk.se/om-kraftsystemet/kontrollrummet/', 
    {
      readyLocator: readyLocator
    }
  );

  await context.clearCookies();

  await cookiesButton.isVisible();
  await cookiesButton.click();
  await expect(cookiesButton).not.toBeVisible();
  
  //─────── Set Date to Octber 2  ───────//
  const choosenDate = await page.evaluate(() => {
    return new Date('2023-10-02 04:01').toISOString().split('T')[0];
  });

  await page.clock.setFixedTime(new Date(choosenDate));
  
  //─── Clicks slider multiple times ───────//
  await clickDynamicButtonRepeatedly(page, /^Minska till \d{2}:\d{2}$/, 3);
  
  //─── Verify the correct price  ───────//
  await expect(hourelyPrice).toContainText('Visar priser för: 2023-10-02 01:00', {timeout: 30000});
});