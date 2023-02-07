import { expect, chromium, Page } from '@playwright/test';
import { BASEURL } from '../constants';
import { checkPossibleCard, signUpOrLogin, test } from './utils/accounts';

let page: Page;

test.describe("Test Suite Card Setup", () => {
    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();
        await page.goto(BASEURL);
        await expect(page).toHaveTitle('SPLIT');
    });

    test.afterAll(async ({ browser }) => {
        await page.close();
    });

    setupCardsPerUser();
});

export async function setupCardsPerUser() {
    test('Fill Out Cards', async ({ username, password, counter }) => {
        await signUpOrLogin(page, username, password, counter);
        const user = username + "@mail.com";
        console.log(user);

        if (!user.includes("admin") && !user.includes("stakeholder")) {
            await page.locator("role=main >> role=complementary >> text=Boards").waitFor();
            await page.locator("role=main >> role=complementary >> text=Boards").click();
            await page.locator('text=bot retro').first().waitFor();
            await page.locator('text=Dashboard').first().click();
            await page.locator('text=Sub-team board').first().click();
        }
        if (user.includes("stakeholder")) {
            await page.locator("role=main >> role=complementary >> text=Boards").waitFor();
            await page.locator("role=main >> role=complementary >> text=Boards").click();
            await page.locator('text=bot retro').first().waitFor();
            await page.locator('text=Dashboard').first().click();
            await page.locator('text=bot retro').first().click();
        } else {
            await checkPossibleCard(page, user, "Went well", "Well card");
            await checkPossibleCard(page, user, "To improve", "Improvement card");
            await checkPossibleCard(page, user, "Action points", "Action card");
        }
    });
};