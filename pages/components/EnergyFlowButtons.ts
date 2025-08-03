import { Locator, Page, expect } from '@playwright/test';
import { Country } from '../../enums/Country';

const CountryNameMap: Record<Country, string> = {
  [Country.Sweden]: 'Sverige',
  [Country.Denmark]: 'Danmark',
  [Country.Norway]: 'Norge',
  [Country.Finland]: 'Finland',
  [Country.Estonia]: 'Estland',
  [Country.Latvia]: 'Lettland',
  [Country.Lithuania]: 'Litauen',
};

export class EnergyFlowButtons {
  private readonly page: Page;
  private readonly buttons: Record<Country, Locator>;

  constructor(page: Page) {
    this.page = page;
    this.buttons = this.createButtonMap();
  }

  private createButtonMap(): Record<Country, Locator> {
    return Object.fromEntries(
      Object.entries(CountryNameMap).map(([country, name]) => [
        country,
        this.page.getByRole('button', {
          name: new RegExp(`${name}.*(Exporterar|Importerar)`),
        }),
      ])
    ) as Record<Country, Locator>;
  }

  getButton(country: Country): Locator {
    return this.buttons[country];
  }

  async click(country: Country) {
    const button = this.getButton(country);
    await expect(button).toBeVisible({ timeout: 5000 });
    await button.scrollIntoViewIfNeeded();
    await button.click();
  }

  async expectVisible(country: Country) {
    await expect(this.getButton(country)).toBeVisible();
  }
}
