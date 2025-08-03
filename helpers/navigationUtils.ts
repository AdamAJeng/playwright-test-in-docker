import { Page, expect } from '@playwright/test';

/**
 * Navigates to a specified URL and verifies that the page has loaded correctly.
 * Optionally waits for a specific element to be visible to confirm readiness.
 *
 * @param page - The Playwright Page object to perform actions on.
 * @param url - The URL to navigate to.
 * @param options - Optional parameters:
 *   - timeoutMs: Maximum time to wait for navigation and element visibility (default: 20000ms).
 *   - readyLocator: A selector for an element that indicates the page is ready.
 */

export async function goToUrlAndVerify(
  page: Page,
  url: string,
  options?: {
    timeoutMs?: number;
    readyLocator?: string;
  }
): Promise<void> {
  const timeoutMs = options?.timeoutMs ?? 20000;
  const readyLocator = options?.readyLocator;

  await page.goto(url, { timeout: timeoutMs, waitUntil: 'load' });
  await expect(page).toHaveURL(url, { timeout: timeoutMs });

  if (readyLocator) {
    // Wait for a specific element to confirm the page is ready
    await page.locator(readyLocator).waitFor({ state: 'visible', timeout: timeoutMs });
  }
}

