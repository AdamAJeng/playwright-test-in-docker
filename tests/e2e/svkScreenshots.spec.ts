import { test, expect } from '@playwright/test';
import { goToUrlAndVerify, screenshotElement } from '../helpers';

test('Kontrollrummet: screenshots of importance', async ({ page, context }, testInfo) => {
  const readyLocator = 'li:has-text("Visar priser för:")';
  const powerDistributionMap = page.locator('.highcharts-container').first();
  const energySources = page.locator('#Agsid-10');
  const powerConsumption = page.locator('.graphPowerConsumption');
  const cookiesButton = page.getByText(/Acceptera alla kakor/i );

  await goToUrlAndVerify(page, 'https://www.svk.se/om-kraftsystemet/kontrollrummet/', 
    {
      readyLocator: readyLocator
    }
  );

  await context.clearCookies(); // Clear all cookies

  await cookiesButton.isVisible();
  await cookiesButton.click();
  await expect(cookiesButton).not.toBeVisible();

  //await page.waitForTimeout(5000);
  // await powerConsumption.isVisible();

  await screenshotElement(powerDistributionMap, testInfo, 'power-distribution-map');
  await screenshotElement(energySources, testInfo, 'energy-sources');
  await screenshotElement(powerConsumption, testInfo, 'power-consumption-graph-sweden');

  await powerConsumption.filter({hasText: /Elområde Luleå \(SE1\)/i}).click();
  await screenshotElement(powerConsumption, testInfo, 'power-consumption-graph-lulea');
  
  await powerConsumption.filter({hasText: /Elområde Sundsvall \(SE2\)/i}).click();
  await screenshotElement(powerConsumption, testInfo, 'power-consumption-graph-sundsvall');
  
  await powerConsumption.filter({hasText: /Elområde Stockholm \(SE3\)/i}).click();
  await screenshotElement(powerConsumption, testInfo, 'power-consumption-graph-stockholm');
  
  await powerConsumption.filter({hasText: /Elområde Malmö \(SE4\)/i}).click();
  await screenshotElement(powerConsumption, testInfo, 'power-consumption-graph-malmo');
});