import { expect, chromium, Page } from '@playwright/test';
import { BASEURL } from '../constants';
import { test } from './utils/accounts';

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

export default function setup() {
  test("Login or SignUp", async ({ username, password, counter }) => {
    signUpOrLogin(username, password, counter);
  });
};

export async function signUpOrLogin(username, password, counter) {
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
    console.log(await botTeam);
    if (await botTeam == 0) {
      console.log(botTeam);
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
      await page.waitForTimeout(1000);
    }
  }
};

async function dragDrop(originSelector: string, destinationSelector: string) {
  const originElement = await page.waitForSelector(originSelector);
  const destinationElement = await page.waitForSelector(destinationSelector);

  const boxSrc = (await originElement.boundingBox())!;
  const boxDst = (await destinationElement.boundingBox())!;
  console.log(boxSrc);
  console.log(boxDst);

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