import { expect, Locator, TestInfo } from '@playwright/test';

export async function screenshotElement(
  element: Locator,
  testInfo: TestInfo,
  screenshotNameOverride?: string
): Promise<void> {
  const safeName = (screenshotNameOverride || 'screenshot').replace(/[^\w-]/g, '-');
  await expect(element).toBeVisible();
  const buffer = await element.screenshot();
  await testInfo.attach(safeName, { body: buffer, contentType: 'image/png' });
}