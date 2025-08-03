import { test } from '@playwright/test';
import { setFixedBrowserTime } from '../../helpers/time';
import { KontrollrummetPage } from '../../pages/KontrollrummetPage';
import { Calendar } from '../../pages/components/Calendar';

test.describe('Kontrollrummet: Date selection', () => {
  let kontrollrummet: KontrollrummetPage;

  test.beforeEach(async ({ page, context }) => {
    kontrollrummet = new KontrollrummetPage(page);
    await setFixedBrowserTime(page, '2025-05-01');
    await context.clearCookies();
    await kontrollrummet.goto();
    await kontrollrummet.acceptCookies();
  });

  test('User can select previous month date in calendar', async ({ page }) => {
    const calendar = new Calendar(page);
    const fixedIsoDate = '2025-04-01';
    await calendar.open();
    await calendar.selectPreviousMonthDate(fixedIsoDate);
    await calendar.assertDateVisible(fixedIsoDate);
  });
});
