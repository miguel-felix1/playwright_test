// import { expect, Page } from "@playwright/test";
// import { BASEURL } from "~/constants";
// import setup from "./testSetup";
// import setupCardsPerUser from "./testSetupCards.spec";
// import { test } from './utils/accounts';

// let urlLocal = BASEURL;
// export var page: Page;

// test.describe('Test Suite Setup', () => {
//     test.beforeAll(async ({ browser }) => {
//         page = await browser.newPage();
//         await page.goto(urlLocal);
//         await expect(page).toHaveTitle('SPLIT');
//     });

//     test.afterAll(async ({ browser }) => {
//         await page.close();
//     });

//     setup();
// });

// test.describe('Test Suite Card Creation', () => {

//     test.beforeAll(async ({ browser }) => {
//         page = await browser.newPage();
//         await page.goto(urlLocal);
//         await expect(page).toHaveTitle('SPLIT');
//     });

//     test.afterAll(async ({ browser }) => {
//         await page.close();
//     });
    
//     setupCardsPerUser();
// });


// // test.describe(setup);