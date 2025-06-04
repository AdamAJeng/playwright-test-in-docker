import { test, expect } from '@playwright/test';
import { goToUrlAndVerify, openDatePickerByLabel, clickReadOnlyInputByValue, clickListItemByText, getDateRangePlusDays } from '../helpers';

test('Testim: Select Travel Date', async ({ page }) => {
  const { formattedStartDate, formattedEndDate } = getDateRangePlusDays('2025-05-15', 10);
  const travelerSummary = page.getByText(/^\d+ travelers?, [A-Za-z]+ \d{1,2} – (?:[A-Za-z]+ )?\d{1,2}$/);
  const readyLocator = 'span:has-text("Back to top")';
  
  await goToUrlAndVerify(page, 'https://demo.testim.io/', 
    {
      readyLocator: readyLocator
    }
  );
  
  //─────── Select Departure Date ────────────//
  await page.clock.setFixedTime(formattedStartDate);
  await openDatePickerByLabel(page, 'Departing');
  await page.getByText(String('15'), { exact: true }).click();
  await page.getByRole('button', { name: 'Ok', exact: true }).click();

  //─────── Select Return Date ────────────//
  
  // ... later, simulate time jump
  await page.clock.setFixedTime(formattedEndDate);
  await openDatePickerByLabel(page, 'Returning');
  await page.getByText(String('25'), { exact: true }).first().click();
  await page.getByRole('button', { name: 'Ok', exact: true }).click();
  
  //─────── Select Adult Travelers ────────────//
  await clickReadOnlyInputByValue(page, 'Adults (18+)');
  await clickListItemByText(page, '1');
  
  //─────── Select Child Travelers ────────────//
  await clickReadOnlyInputByValue(page, 'Children (0-7)');
  await clickListItemByText(page, '2');

  //─────── Summarize Trip ────────────//
  await expect(travelerSummary).toBeVisible();
});