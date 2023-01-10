import { expect, chromium, Page } from '@playwright/test';
import { BASEURL } from '../constants';
import { signUpOrLogin } from './testSetupAccounts.spec';
import { test } from './utils/accounts';

let page:Page;

test.describe("Test Suite Card Setup",()=>
{
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

export default function setupCardsPerUser() {
    test('Fill Out Cards', async ({ username, password, counter }) => {
        signUpOrLogin(username, password, counter);
        const user = username + "@mail.com";
        await page.locator("role=main >> role=complementary >> text=Boards").click();

        await page.waitForTimeout(1000);
        const botBoard = await page.locator('text=bot retro').count();
        await page.waitForTimeout(1000);
        console.log(await botBoard + "HOW MANY BOARDS");
        if (await botBoard == 0) {
            await page.locator("text=Add new board").click();
            await page.locator("text=SPLIT retro").click();
            await page.locator("label>>text=Main board name>>xpath=..>>input").fill("bot retro");
            await page.locator("text=Select Team>>xpath=..>>xpath=..").click();
            await page.locator('div>>text="bot team (6 members)"').click();
            await page.locator("text=Create board").click();
            await page.waitForTimeout(10000);
        }
        await page.getByText('bot retro').first().click();
        await page.waitForTimeout(1000);
        const botWellCard = await page.locator('text=Well card ' + user).count();
        const botWellInput = await page.locator('text=Went well >> xpath=.. >> xpath=.. >> xpath=.. >> text=Add new card').count();
        await page.waitForTimeout(1000);
        console.log(await botWellCard);
        if (await botWellCard == 0) {
            if (botWellInput != 0) {
                await page.locator("text=Went well >> xpath=.. >> xpath=.. >> xpath=.. >> text=Add new card").click();
            }
            await page.locator("text=Went well >> xpath=.. >> xpath=.. >> xpath=.. >> textarea").fill("Well card " + user);
            await page.locator("text=Went well >> xpath=.. >> xpath=.. >> xpath=.. >> form >> button").last().click();
        }
        await page.waitForTimeout(1000);
        const botImproveCard = await page.locator('text=Improvement card ' + user).count();
        const botImproveInput = await page.locator('text=To improve >> xpath=.. >> xpath=.. >> xpath=.. >> text=Add new card').count();
        await page.waitForTimeout(1000);
        console.log(await botImproveCard);
        if (await botImproveCard == 0) {
            if (botImproveInput != 0) {
                await page.locator("text=To improve >> xpath=.. >> xpath=.. >> xpath=.. >> text=Add new card").click();
            }
            await page.locator("text=To improve >> xpath=.. >> xpath=.. >> xpath=.. >> textarea").fill("Improvement card " + user);
            await page.locator("text=To improve >> xpath=.. >> xpath=.. >> xpath=.. >> form >> button").last().click();
        }
        await page.waitForTimeout(1000);
        const botActionCard = await page.locator('text=Action card ' + user).count();
        const botActionInput = await page.locator('text=Action points >> xpath=.. >> xpath=.. >> xpath=.. >> text=Add new card').count();
        await page.waitForTimeout(1000);
        console.log(await botActionCard);
        if (await botActionCard == 0) {
            if (await botActionInput != 0) {
                await page.locator("text=Action points >> xpath=.. >> xpath=.. >> xpath=.. >> text=Add new card").click();
            }
            await page.locator("text=Action points >> xpath=.. >> xpath=.. >> xpath=.. >> textarea").fill("Action card " + user);
            await page.locator("text=Action points >> xpath=.. >> xpath=.. >> xpath=.. >> form >> button").last().click();
        }
    });
};