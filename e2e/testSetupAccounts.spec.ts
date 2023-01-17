import { expect, chromium, Page } from '@playwright/test';
import { BASEURL } from '../constants';
import { test } from './utils/accounts';
import { setupCardsPerUser } from './testSetupCards.spec';

let page: Page;

test.describe("Test Suite Setup", () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(BASEURL);
    await expect(page).toHaveTitle('SPLIT');
  });

  test.afterAll(async ({ browser }) => {
    await page.close();
  });
  setup();
});

export async function setup() {
  test("Login or SignUp", async ({ username, password, counter }) => {
    await signUpOrLogin(page, username, password, counter);
  });
};

export async function signUpOrLogin(page, username, password, counter) {
  const user = username + "@mail.com";
  await page.locator('xpath=//*[@id="email"]').click();
  await page.locator('xpath=//*[@id="email"]').fill(user);
  await page.locator('xpath=//*[@id="password"]').click();
  await page.locator('xpath=//*[@id="password"]').fill(password);
  const loginBtn = await page.$('button >> text=Log in');
  await loginBtn?.click({ delay: 200 });
  let response = await page.waitForResponse(response => response.url().includes("credentials"))
  let body = await response.text();
  if (await (body).includes("dashboard")) {
    await setupTeamAdminStakeholder(user, password, counter);
  } else {
    await signUp(user, password, counter);
  }
}

export async function signUp(user: string, password: string, counter: string) {
  await expect(page.locator("text=Sign up")).toBeVisible();
  await page.locator('text=Sign up').click();
  await expect(page.locator('text=Enter your email address to proceed further')).toBeVisible();

  await page.locator('xpath=//*[@id="email"]').click();
  await page.locator('xpath=//*[@id="email"]').fill(user);
  await page.locator('text=Get Started').click();
  await page.getByLabel('First Name').click();
  await page.getByLabel('First Name').fill(counter + " Bot");
  await page.getByLabel('Last Name').click();
  await page.getByLabel('Last Name').fill('Testing');
  await page.click('id=password');
  await page.fill('id=password', password);
  await page.click('id=passwordConf');
  await page.fill('id=passwordConf', password);
  await page.locator('role=button[name="Sign up"]').click();
  await expect(page).toHaveURL(/.*dashboard/);
  await setupTeamAdminStakeholder(user, password, counter);
};

export async function setupTeamAdminStakeholder(user: string, password: string, counter: string) {
  if (user.includes("admin")) {
    await page.locator('text=Teams').first().click();
    await page.waitForTimeout(1000);
    const botTeam = await page.locator('text=bot team').count();
    if (await botTeam == 0) {
      await page.locator('text=Create new team').click();
      await page.locator('label >> text="Team name" >> xpath=.. >> input').fill("bot team");
      await page.locator('text=Add/remove members').click();
      await page.locator('label >> text="Search member" >> xpath=.. >> input').fill("bot");

      await expect(await page.locator("text=bot-stakeholder >> xpath=.. >> xpath=.. >> div").first()).toBeVisible();
      await page.locator("text=bot-stakeholder >> xpath=.. >> xpath=.. >> div").first().click();
      const botCount = await page.locator('text=@mail.com').count() - 2;

      for (let index = botCount; index > 0; index--) {
        await expect(await page.locator("text=bot" + (index - 1) + " >> xpath=.. >> xpath=.. >> div").first()).toBeVisible();
        await page.locator("text=bot" + (index - 1) + " >> xpath=.. >> xpath=.. >> div").first().click();
      }

      await page.locator('button >> text=Update').click();
      await page.locator('text=stakeholder Bot >> xpath=.. >> xpath=.. >> xpath=.. >> button ').last().click();
      await page.locator('span >> text=Stakeholders will not be included in sub-team SPLIT retrospectives. >> xpath=.. >> xpath=..').click();
      await page.locator('button >> text=Create team').click();
    }

    await page.locator("role=main >> role=complementary >> text=Boards").waitFor();
    await page.locator("role=main >> role=complementary >> text=Boards").click();

    await page.locator('text=bot retro').waitFor();
    const botBoard = await page.locator('text=bot retro').count();
    if (await botBoard == 0) {
        await page.locator("text=Add new board").click();
        await page.locator("text=SPLIT retro").click();
        await page.locator("label>>text=Main board name>>xpath=..>>input").fill("bot retro");
        await page.locator("text=Select Team>>xpath=..>>xpath=..").click();
        await page.locator('div>>text="bot team (6 members)"').click();
        await page.locator("text=Create board").click();
    }
    await page.getByText('bot retro').first().click();
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
  }
};

async function dragDrop(originSelector: string, destinationSelector: string) {
  const originElement = await page.waitForSelector(originSelector);
  const destinationElement = await page.waitForSelector(destinationSelector);

  const boxSrc = (await originElement.boundingBox())!;
  const boxDst = (await destinationElement.boundingBox())!;

  await page.dragAndDrop(originSelector, destinationSelector);
  await page.mouse.move(boxSrc.x + boxSrc.width / 2, boxSrc.y + boxSrc.height / 2);
  await page.mouse.down();
  await page.mouse.move(boxDst.x + boxDst.width / 2, boxDst.y + boxDst.height / 2);
  await page.mouse.down();

  await page.locator(originSelector).hover();
  await page.mouse.down();
  await page.locator(destinationSelector).hover();
  await page.mouse.up();
}
//<div class=" css-bctwtx-menu" id="react-select-7-listbox"><div class=" css-1n6sfyn-MenuList"><div class=" css-16wef13-option" aria-disabled="false" id="react-select-7-option-0" tabindex="-1">bot team (6 members)</div></div></div>