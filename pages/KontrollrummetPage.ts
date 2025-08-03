import { Page, Locator, expect } from '@playwright/test';
import { Country } from '../enums/Country';
import { City, CityZoneMap } from '../enums/City';
import { goToUrlAndVerify } from '../helpers';
import { EnergyFlowButtons, Accordion } from './components';

export class KontrollrummetPage {
  private readonly page: Page;
  private readonly readyLocator: string;
  private readonly cookiesButton: Locator;
  private readonly energyFlowButtons: EnergyFlowButtons;

  constructor(page: Page) {
    this.page = page;
    this.readyLocator = 'li:has-text("Visar priser för:")';
    this.cookiesButton = page.getByText(/Acceptera alla kakor/i);
    this.energyFlowButtons = new EnergyFlowButtons(page);
  }

  async goto() {
    await goToUrlAndVerify(this.page, 'https://www.svk.se/om-kraftsystemet/kontrollrummet/', {
      // TODO: Refactor this to awit for page to be ready in a proper way
      readyLocator: this.readyLocator,
    });
  }
  
  async acceptCookies() {
    await expect(this.cookiesButton).toBeVisible();
    await this.cookiesButton.click();
    await expect(this.cookiesButton).not.toBeVisible();
  }

  accordion(label: string): Accordion {
    return new Accordion(this.page, label);
  }

  async clickEnergyFlow(country: Country) {
    await this.energyFlowButtons.click(country);
  }

  async expectAreaCodes(areaId: string, expectedCodes: string[]) {
    const locator = this.page.locator(`#electrical-areas-${areaId} td`);
    await expect(locator).toContainText(expectedCodes);
  }

  async clickPowerConsumptionForCity(city: City) {
    const zone = CityZoneMap[city];
    await this.page
      .locator('.graphPowerConsumption')
      .filter({ hasText: new RegExp(`Elområde ${city} \\(${zone}\\)`, 'i') })
      .click();
  }

  getPowerConsumptionLocator(): Locator {
    return this.page.locator('.graphPowerConsumption');
  }
}
