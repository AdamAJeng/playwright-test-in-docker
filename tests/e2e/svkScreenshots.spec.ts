import { test } from '@playwright/test';
import { screenshotElement } from '../../helpers';
import { KontrollrummetPage } from '../../pages/KontrollrummetPage';
import { City, CitySlug } from '../../enums/City';

test.describe('Kontrollrummet: Screenshots', () => {
  let kontrollrummet: KontrollrummetPage;

  test.beforeEach(async ({ page, context }) => {
    kontrollrummet = new KontrollrummetPage(page);
    await context.clearCookies();
    await kontrollrummet.goto();
    await kontrollrummet.acceptCookies();
  });

  test('Kontrollrummet: screenshots of importance', async ({ page }, testInfo) => {
    const powerDistributionMap = page.locator('.highcharts-container').first();
    const energySources = page.locator('#Agsid-10');
    const powerConsumption = kontrollrummet.getPowerConsumptionLocator();

    await screenshotElement(powerDistributionMap, testInfo, 'power-distribution-map');
    await screenshotElement(energySources, testInfo, 'energy-sources');
    await screenshotElement(powerConsumption, testInfo, 'power-consumption-graph-sweden');

    for (const city of Object.values(City)) {
      await kontrollrummet.clickPowerConsumptionForCity(city);
      await screenshotElement(powerConsumption, testInfo, `power-consumption-graph-${CitySlug[city]}`);
    }
  });

});
