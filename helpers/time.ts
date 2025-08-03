import { Page } from '@playwright/test';

/**
 * Sets a fixed browser time using Playwright's page.clock API.
 * @param page Playwright Page instance
 * @param isoDate Either a Date instance or ISO string (e.g., '2025-05-01')
 */
export async function setFixedBrowserTime(page: Page, isoDate: string | Date): Promise<void> {
  const date = typeof isoDate === 'string' ? new Date(isoDate) : isoDate;
  await page.clock.setFixedTime(date);
}
