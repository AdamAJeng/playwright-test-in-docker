import { test } from '@playwright/test';
import { KontrollrummetPage } from '../../pages/KontrollrummetPage';
import { Country } from '../../enums/Country';
import { CountryCode } from '../../enums/CountryCode';

test.describe('Kontrollrummet Index Page', () => {
  let kontrollrummet: KontrollrummetPage;

  test.beforeEach(async ({ page, context }) => {
    kontrollrummet = new KontrollrummetPage(page);
    await context.clearCookies();
    await kontrollrummet.goto();
    await kontrollrummet.acceptCookies();
  });

  test('Accordion functionality shows and hides correct content', async () => {
    const pageInfo = kontrollrummet.accordion('Bra att veta om data på sidan');
    await pageInfo.expectTextVisible(/^Vanliga frågor om kontrollrummet$/, true);
    await pageInfo.toggle();
    await pageInfo.expectTextVisible(/^Vanliga frågor om kontrollrummet$/, false);
    await pageInfo.toggle();

    const powerMarket = kontrollrummet.accordion('Om elmarknaden');
    await powerMarket.expectTextVisible(/^Läs mer om elmarknaden$/, false);
    await powerMarket.toggle();
    await powerMarket.expectTextVisible(/^Läs mer om elmarknaden$/, true);
    await powerMarket.toggle();

    const balancing = kontrollrummet.accordion('Om balansering');
    await balancing.expectTextVisible(/^Läs mer om balansering$/, false);
    await balancing.toggle();
    await balancing.expectTextVisible(/^Läs mer om balansering$/, true);
    await balancing.toggle();
  });

  test('Energy flow buttons show expected area codes', async () => {
    const testCases = [
      { country: Country.Sweden, code: CountryCode.SE, expectedAreas: ['SE1', 'SE2', 'SE3', 'SE4'] },
      { country: Country.Denmark, code: CountryCode.DK, expectedAreas: ['DK1', 'DK2'] },
      { country: Country.Norway, code: CountryCode.NO, expectedAreas: ['NO1', 'NO2', 'NO3', 'NO4', 'NO5'] },
      { country: Country.Finland, code: CountryCode.FI, expectedAreas: ['FI'] },
      { country: Country.Estonia, code: CountryCode.EE, expectedAreas: ['EE'] },
      { country: Country.Latvia, code: CountryCode.LV, expectedAreas: ['LV'] },
      { country: Country.Lithuania, code: CountryCode.LT, expectedAreas: ['LT'] },
    ];

    for (const { country, code, expectedAreas } of testCases) {
      await test.step(`Verify energy zone(s) for ${country}`, async () => {
        await kontrollrummet.clickEnergyFlow(country);
        await kontrollrummet.expectAreaCodes(code, expectedAreas);
      });
    }
  });
});
