import { expect, chromium, Page } from '@playwright/test';
import { BASEURL } from '../constants';
import { signUpOrLogin, test } from './utils/accounts';

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

        if (!user.includes("admin")) {
            await page.locator("role=main >> role=complementary >> text=Boards").waitFor();
            await page.locator("role=main >> role=complementary >> text=Boards").click();
            await page.locator('text=bot retro').waitFor();
            await page.getByText('bot retro').first().click();
        }

        await page.locator('text=Went well').waitFor();
        const botWellCard = await page.locator('text=Well card ' + user).count();
        const botWellInput = await page.locator('text=Went well >> xpath=.. >> xpath=.. >> xpath=.. >> text=Add new card').count();
        if (await botWellCard == 0) {
            if (botWellInput != 0) {
                await page.locator("text=Went well >> xpath=.. >> xpath=.. >> xpath=.. >> text=Add new card").click();
            }
            await page.locator("text=Went well >> xpath=.. >> xpath=.. >> xpath=.. >> textarea").fill("Well card " + user);
            await page.locator("text=Went well >> xpath=.. >> xpath=.. >> xpath=.. >> form >> button").last().click();
        }
        await page.locator('text=To improve').waitFor();
        const botImproveCard = await page.locator('text=Improvement card ' + user).count();
        const botImproveInput = await page.locator('text=To improve >> xpath=.. >> xpath=.. >> xpath=.. >> text=Add new card').count();
        if (await botImproveCard == 0) {
            if (botImproveInput != 0) {
                await page.locator("text=To improve >> xpath=.. >> xpath=.. >> xpath=.. >> text=Add new card").click();
            }
            await page.locator("text=To improve >> xpath=.. >> xpath=.. >> xpath=.. >> textarea").fill("Improvement card " + user);
            await page.locator("text=To improve >> xpath=.. >> xpath=.. >> xpath=.. >> form >> button").last().click();
        }
        await page.locator('text=Action points').waitFor();
        const botActionCard = await page.locator('text=Action card ' + user).count();
        const botActionInput = await page.locator('text=Action points >> xpath=.. >> xpath=.. >> xpath=.. >> text=Add new card').count();
        if (await botActionCard == 0) {
            if (await botActionInput != 0) {
                await page.locator("text=Action points >> xpath=.. >> xpath=.. >> xpath=.. >> text=Add new card").click();
            }
            await page.locator("text=Action points >> xpath=.. >> xpath=.. >> xpath=.. >> textarea").fill("Action card " + user);
            await page.locator("text=Action points >> xpath=.. >> xpath=.. >> xpath=.. >> form >> button").last().click();
        }
    });
};