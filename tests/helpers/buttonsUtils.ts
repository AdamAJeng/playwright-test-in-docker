import { Page, Locator, expect } from '@playwright/test';

export async function clickButtonByLabel(
  page: Page,
  buttonLabel: string | RegExp,
  withinHeading?: string | RegExp
): Promise<void> {
  const rolesToTry = ['button', 'link'];

  for (const role of rolesToTry) {
    let buttonLocator: Locator;

    if (withinHeading) {
      const heading = page.getByRole('heading', { name: withinHeading });
      await expect(heading).toBeVisible();

      const container = page.locator(
        'xpath=//*[@*[starts-with(name(), "data-react-")]]',
        { has: heading }
      );

      buttonLocator = container.getByRole(role as any, { name: buttonLabel });
    } else {
      buttonLocator = page.getByRole(role as any, { name: buttonLabel });
    }

    if (await buttonLocator.count() > 0) {
      await expect(buttonLocator).toBeVisible();
      await buttonLocator.click();
      return;
    }
  }

  throw new Error(`No visible button or tab found with label: ${buttonLabel}`);
}

export async function clickDynamicButtonRepeatedly(
  page: Page,
  pattern: RegExp,
  count = 1,
  withinLocator?: Locator
) {
  for (let i = 0; i < count; i++) {
    let button: Locator;

    if (withinLocator) {
      button = withinLocator.getByRole('button', { name: pattern });
    } else {
      button = page.getByRole('button', { name: pattern });
    }

    await button.first().click();
    await page.waitForTimeout(2000);
  }
}