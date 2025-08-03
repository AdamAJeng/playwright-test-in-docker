import { Page, Locator, expect } from '@playwright/test';

/**
 * Fills an editable input, textarea, or select field associated with a visible label.
 * Optionally supports targeting multiple matching inputs using an index.
 */
export async function fillFieldByLabel(
  page: Page,
  labelText: string | RegExp,
  value: string,
  index = 0
): Promise<void> {
  // Try finding an element (span, label, div, etc.) that contains the label text
  const labelLocator = page.locator('text=' + labelText);

  // From the element with the label, go to its closest container (e.g., section, div, form)
  const container = labelLocator.locator('xpath=ancestor::*[self::div or self::section or self::form][1]');

  // Look inside for editable input fields
  const inputs = container.locator(
    'input:not([readonly]), textarea:not([readonly]), select:not([disabled])'
  );

  const count = await inputs.count();
  if (count === 0) {
    throw new Error(`No editable field found for label "${labelText}"`);
  }
  if (index >= count) {
    throw new Error(`Only ${count} fields found for label "${labelText}", but index ${index} was requested.`);
  }

  const field = inputs.nth(index);
  await field.fill(value);
}



/**
 * Clicks a checkbox-like element associated with a visible label.
 * Useful when labels wrap a visual checkbox or toggle structure.
 */
export async function clickCheckboxLikeLabel(page: Page, labelText: string | RegExp) {
  const label = page.locator('label', {
    hasText: labelText,
  });

  const clickable = label.locator('div');

  await expect(clickable).toBeVisible();
  await clickable.click();
}

/**
 * Opens a React Toolbox-style date picker by clicking on the input
 * associated with a given label. Returns the input locator for later value checks.
 */
export async function openDatePickerByLabel(page: Page, labelText: string | RegExp): Promise<Locator> {
  const container = page.locator('[data-react-toolbox="date-picker"]', {
    has: page.locator('label', { hasText: labelText }),
  });

  const input = container.locator('input[readonly]');

  await expect(input).toBeVisible();
  await input.click(); // Opens the calendar UI

  return input;
}

/**
 * Clicks a readonly input (dropdown-like element) based on its visible value.
 * Commonly used for fields that trigger modal pickers or dropdowns.
 */
export async function clickReadOnlyInputByValue(page: Page, value: string) {
  const input = page.locator(`div[data-react-toolbox="input"] input[role="input"][value="${value}"]`);
  await expect(input).toBeVisible();
  await input.click();
}

/**
 * Clicks a list item (`<li>`) based on exact visible text.
 * Supports numbers, strings, or RegExp for flexible matching.
 */
export async function clickListItemByText(page: Page, text: string | number | RegExp) {
  const hasText =
    typeof text === 'number' ? new RegExp(`^${text}$`) :
    typeof text === 'string' ? new RegExp(`^${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`) :
    text;

  const locator = page.getByRole('listitem').filter({ hasText });

  await expect(locator).toHaveCount(1); // Helps debug strict mode errors
  await expect(locator).toBeVisible();
  await locator.click();
}
