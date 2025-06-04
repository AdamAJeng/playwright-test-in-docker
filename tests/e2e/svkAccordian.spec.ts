import { test, expect } from '@playwright/test';
import { goToUrlAndVerify, clickButtonByLabel, expectAccordionExpanded } from '../helpers';

test('Kontrollrummet: Accordian Functionality on Index Page', async ({ page, context }) => {
  const readyLocator = 'li:has-text("Visar priser för:")';
  const cookiesButton = page.getByText(/Acceptera alla kakor/i );
  const energyFlowSweden = page.getByRole('button', { name: /Sverige.*(Exporterar|Importerar)/ });
  const energyFlowDenmark = page.getByRole('button', { name: /Danmark.*(Exporterar|Importerar)/ });
  const energyFlowNorway = page.getByRole('button', { name: /Norge.*(Exporterar|Importerar)/ });
  const energyFlowFinland = page.getByRole('button', { name: /Finland.*(Exporterar|Importerar)/ });
  const energyFlowEstonia = page.getByRole('button', { name: /Estland.*(Exporterar|Importerar)/ });
  const energyFlowLatvia = page.getByRole('button', { name: /Lettland.*(Exporterar|Importerar)/ });
  const energyFlowLithuania = page.getByRole('button', { name: /Litauen.*(Exporterar|Importerar)/ });
  const label1 = 'Bra att veta om data på sidan';
  const label2 = 'Om elmarknaden';
  const label3 = 'Om balansering';

  await goToUrlAndVerify(page, 'https://www.svk.se/om-kraftsystemet/kontrollrummet/', 
    {
      readyLocator: readyLocator
    }
  );

  await context.clearCookies(); // Clear all cookies

  await cookiesButton.isVisible();
  await cookiesButton.click();
  await expect(cookiesButton).not.toBeVisible();

  //─────── Toggle "Bra att veta om data på sidan" ────────────//

  await page.getByText(label1).click();
  await expectAccordionExpanded(page, label1, false);
  
  await expect(page.getByText(/Vanliga frågor om kontrollrummet/i)).toBeHidden({ timeout: 10000 });
  
  await page.getByText(label1).click();
  await expectAccordionExpanded(page, label1, true);
  
  //─────── Toggle "Om elmarknaden" ────────────//
  await clickButtonByLabel(page,label2);
  await expectAccordionExpanded(page, label2, true);
  
  await expect(page.getByText(/Läs mer om elmarknaden/i)).toBeVisible({ timeout: 10000 });
  
  await clickButtonByLabel(page,label2);
  await expectAccordionExpanded(page, label2, false);
  
  //─────── Toggle "Om balansering" ────────────//
  await page.getByText(label3, { exact: true }).click();
  await expectAccordionExpanded(page, label3, true);
  
  await expect(page.getByText(/Läs mer om balansering/i)).toBeVisible({ timeout: 10000 });
  
  await page.getByText(label3, { exact: true }).click();
  await expectAccordionExpanded(page, label3, false);
  
  //─────── EL: Import/Export ───────//
  // Sweden
  await expect(energyFlowSweden).toBeVisible();
  await energyFlowSweden.click();
  await expect(page.locator('#electrical-areas-SE td')).toContainText(['SE1', 'SE2', 'SE3', 'SE4']);
  
  //await page.waitForTimeout(4000);
  
  // Denmark
  await expect(energyFlowDenmark).toBeVisible();
  await energyFlowDenmark.click();
  await expect(page.locator('#electrical-areas-DK td')).toContainText(['DK1', 'DK2']);
  
  // Norway
  await expect(energyFlowNorway).toBeVisible();
  await energyFlowNorway.click();
  await expect(page.locator('#electrical-areas-NO td')).toContainText(['NO1', 'NO2', 'NO3','NO4','NO5']);
  
  // Finland
  await expect(energyFlowFinland).toBeVisible();
  await energyFlowFinland.click();
  await expect(page.locator('#electrical-areas-FI td')).toContainText(['FI']);
  
  // Estonia
  await expect(energyFlowEstonia).toBeVisible();
  await energyFlowEstonia.click();
  await expect(page.locator('#electrical-areas-EE td')).toContainText(['EE']);
  
  // Latvia
  await expect(energyFlowLatvia).toBeVisible();
  await energyFlowLatvia.click();
  await expect(page.locator('#electrical-areas-LV td')).toContainText(['LV']);
  
  // Lithuania
  await expect(energyFlowLithuania).toBeVisible();
  await energyFlowLithuania.click();
  await expect(page.locator('#electrical-areas-LT td')).toContainText(['LT']);
}); 