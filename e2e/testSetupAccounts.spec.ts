import { expect, chromium, Page } from '@playwright/test';
import { BASEURL } from '../constants';
import { signUpOrLogin, test } from './utils/accounts';
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

//<div class=" css-bctwtx-menu" id="react-select-7-listbox"><div class=" css-1n6sfyn-MenuList"><div class=" css-16wef13-option" aria-disabled="false" id="react-select-7-option-0" tabindex="-1">bot team (6 members)</div></div></div>