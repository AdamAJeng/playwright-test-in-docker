import { Page, Locator, expect } from '@playwright/test';

export class Accordion {
  private readonly page: Page;
  private readonly button: Locator;

  constructor(page: Page, label: string | RegExp) {
    this.page = page;
    this.button = page.getByRole('button', { name: new RegExp(`^${label}\\s*`) });
  }

  async toggle() {
    await expect(this.button).toBeVisible({ timeout: 5000 });
    await this.button.click();
  }

  async expectExpanded(expanded: boolean) {
    const ariaExpanded = await this.button.getAttribute('aria-expanded');
    expect(ariaExpanded).toBe(expanded ? 'true' : 'false');
  }

  async expectTextVisible(text: string | RegExp, shouldBeVisible = true) {
    const content = this.page.getByText(text);
    await (shouldBeVisible
      ? expect(content).toBeVisible({ timeout: 10000 })
      : expect(content).toBeHidden({ timeout: 10000 }));
  }
}
