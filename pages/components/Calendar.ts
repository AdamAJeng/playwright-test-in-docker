import { Page, Locator, expect } from '@playwright/test';

export class Calendar {
  private readonly page: Page;
  private readonly calendarTrigger: Locator;
  private readonly prevMonthButton: Locator;
  private readonly selectButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.calendarTrigger = page
      .getByRole('figure', { name: /Varje land ansvarar för att/i })
      .getByLabel('Datum');

    this.prevMonthButton = page.getByRole('button', { name: /Minska månad med 1/i });
    this.selectButton = page.getByRole('button', { name: /^Välj$/, exact: true });
  }

  async open() {
    await expect(this.calendarTrigger).toBeVisible();
    await this.calendarTrigger.click();
  }

  async selectPreviousMonthDate(isoDate: string) {
    await expect(this.prevMonthButton).toBeVisible();
    await this.prevMonthButton.click();
    
    const dateButton = this.page.locator(`button[data-date="${isoDate}"]`);
    await dateButton.click();
    await this.selectButton.click();
  }

  async assertDateVisible(isoDate: string) {
    const locator = this.page.locator('li').filter({
      hasText: `Visar priser för: ${isoDate}`,
    });

    await expect(locator.first()).toBeVisible({ timeout: 5000 });
  }
}
