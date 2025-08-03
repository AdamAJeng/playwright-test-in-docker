import { test, expect } from '@playwright/test';
import { clickDynamicButtonRepeatedly, setFixedBrowserTime } from '../../helpers';
import { KontrollrummetPage } from '../../pages/KontrollrummetPage';

//test.setTimeout(60000);

test.describe('Kontrollrummet: Update time and price with slider', () => {
  let kontrollrummet: KontrollrummetPage;

  test.beforeEach(async ({ page, context }) => {
    kontrollrummet = new KontrollrummetPage(page);
    await context.clearCookies();
    await kontrollrummet.goto();
    await kontrollrummet.acceptCookies();
    await setFixedBrowserTime(page, '2023-10-02 03:00');
  });
  
  test('Kontrollrummet: Displays correct hourly price after slider interaction', async ({ page }) => {
    // Arrange
    const expectedTime = '2023-10-02 02:00';
    const priceLabel = page.locator('li').filter({ hasText: `Visar priser för: ${expectedTime}` }).first();

    // Act
    await clickDynamicButtonRepeatedly(page, /^Minska till \d{2}:\d{2}$/, 3);

    // Assert
    await expect(priceLabel).toContainText(`Visar priser för: ${expectedTime}`, { timeout: 10000 });
  });
});  
