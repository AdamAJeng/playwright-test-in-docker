import { Page, expect } from '@playwright/test';

export async function toggleAccordionBasic(page: Page, label: string): Promise<void> {
  const accordionButton = page.getByRole('button', { name: label });
  await accordionButton.click();
}

export async function toggleAccordion(
  page: Page,
  firstLineText: string,
  secondLineText?: string,
  locator: string = 'button'
): Promise<void> {
  const buttons = page.locator(locator);
  const count = await buttons.count();

  const expectedSecondLines = secondLineText
    ? secondLineText.split('|').map(s => s.trim().toLowerCase())
    : undefined;

  for (let i = 0; i < count; i++) {
    const button = buttons.nth(i);

    const debug = await button.evaluate((el) => {
      const labelSpan = el.querySelector('span.data-label');
      const div = labelSpan?.closest('div');
      let firstLine = '';
      let secondLine = '';
      const debugHTML = el.innerHTML;

      if (labelSpan) {
        firstLine = labelSpan.textContent?.trim() ?? '';

        // If there's a <br> inside the same container, try to find the text node after it
        if (div) {
          let foundBr = false;
          for (const node of div.childNodes) {
            if (node.nodeName === 'BR') {
              foundBr = true;
              continue;
            }
            if (foundBr && node.nodeType === Node.TEXT_NODE) {
              secondLine = node.textContent?.trim() ?? '';
              break;
            }
          }
        }
      } else {
        // Fallback for buttons without data-label span (1-liners)
        firstLine = el.textContent?.trim() ?? '';
      }

      return { firstLine, secondLine, debugHTML };
    });

    const firstMatches = debug.firstLine === firstLineText;
    const secondMatches =
      !expectedSecondLines || expectedSecondLines.includes(debug.secondLine.toLowerCase());

    if (firstMatches && secondMatches) {
      await button.click();
      return;
    }
  }

  throw new Error(
    `Accordion with firstLine="${firstLineText}" and secondLine in [${
      expectedSecondLines?.join(', ') ?? 'any'
    }] not found.`
  );
}

export async function expectAccordionExpanded(
  page: Page,
  label: string | RegExp,
  expanded: boolean,
  timeout: number = 20000 // default to 5 seconds
): Promise<void> {
  const accordionButton = page.getByRole('button', { name: label });
  await expect(accordionButton).toBeVisible({ timeout });
  await expect(accordionButton).toHaveAttribute('aria-expanded', expanded.toString(), { timeout });
}

/**
 * Finds any visible <table> on the page that contains a <td> with the given text.
 * Ensures that such a table is visible and that the matching <td> exists.
 *
 * @param page Playwright Page instance
 * @param cellText The exact text to look for inside a <td>
 */
export async function expectTableWithCell(page: Page, cellText: string): Promise<void> {
  const matchingTable = page.locator('table:visible').filter({
    has: page.locator(`td:has-text("${cellText}")`),
  });

  await expect(matchingTable, `No visible table found with a <td> containing text "${cellText}"`).toHaveCount(1);

  const cell = matchingTable.locator(`td:has-text("${cellText}")`);
  await expect(cell, `Could not find cell with text "${cellText}" in the matching table`).toHaveCount(1);
}

/**
 * Waits for a visible table that contains all the expected cell texts.
 * Useful for verifying the SE region rows in a table shown after expanding an accordion.
 *
 * @param page Playwright Page instance
 * @param expectedCells List of cell texts to verify (e.g., ['SE1', 'SE2', 'SE3', 'SE4'])
 * @param timeoutMs Optional timeout override (defaults to 5000ms)
 */
export async function expectSERegionsInVisibleTable(
  page: Page,
  expectedCells: string[],
  timeoutMs = 30000
): Promise<void> {
  // Wait for any visible table that contains ALL expected cells
  const visibleTables = page.locator('table:visible');

  const tableCount = await visibleTables.count();

  for (let i = 0; i < tableCount; i++) {
    const table = visibleTables.nth(i);

    // Wait for this table to be stable and visible before checking contents
    await expect(table).toBeVisible({ timeout: timeoutMs });
    await page.waitForTimeout(1000);
    const cellChecks = await Promise.all(
      expectedCells.map(async (text) => {
        const cell = table.locator(`td:has-text("${text}")`);
        return (await cell.count()) > 0;
      })
    );

    const allCellsFound = cellChecks.every(Boolean);

    if (allCellsFound) {
      // Table contains all expected cells – success
      return;
    }
  }

  throw new Error(
    `No visible table found containing all expected cells: [${expectedCells.join(', ')}]`
  );
}
