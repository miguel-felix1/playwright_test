import { test, expect, Page, chromium } from '@playwright/test';

class userClass {
  email: string = "mgfelix93+";
  emailEnd: string = "@gmail.com";
  firstname: string = "Testing";
  lastname: string = "Account";
  password: string = "123-Testing";
  emailCount: number = 0;
}
let user = new userClass();
let url = "http://localhost:3000/";
let context;

test.describe('Create new account', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(url);
    await expect(page).toHaveTitle('SPLIT');
  });

  test.afterAll(async ({ browser }) => {
    console.log("acabou");
    await page.close();
  });

  test('Create new account', async () => {
    await page.getByRole('tab', { name: 'Sign up' }).click();
    await page.getByPlaceholder(' ').click();
    await page.getByPlaceholder(' ').fill(user.email + user.emailCount + user.emailEnd);
    await page.getByRole('button', { name: 'Get Started' }).click({ delay: 500 });
    let response = await page.waitForResponse(response => response.url().includes(user.email + user.emailCount + user.emailEnd) && response.status() != 404);
    let respBody = await response.text();
    console.log("RESPONSE " + respBody);
    while (response.status() != 404) {
      user.emailCount++;
      await page.getByPlaceholder(' ').fill("");
      await page.getByPlaceholder(' ').type(user.email + user.emailCount + user.emailEnd, { delay: 5 });
      await page.getByRole('button', { name: 'Get Started' }).click({ delay: 500 });
      response = await page.waitForResponse(response => response.url().includes(user.email + user.emailCount + user.emailEnd));
      respBody = await response.text();
    }
    await page.getByLabel('First Name').click();
    await page.getByLabel('First Name').fill('Testing');
    await page.getByLabel('Last Name').click();
    await page.getByLabel('Last Name').fill('Testing');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('Testing-123');
    await page.getByLabel('Confirm Password').click();
    await page.getByLabel('Confirm Password').fill('Testing-123');
    await page.getByRole('button', { name: 'Sign up' }).click();
    await expect(page).toHaveURL('https://split.kigroup.de/dashboard');
    await page.locator('div:has-text("Log out")').nth(2).click();
    await page.close();
  });

});
