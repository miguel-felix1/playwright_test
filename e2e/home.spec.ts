import { test, expect } from '@playwright/test';

test('page should have title of "Dogs security blog"', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  const title = await page.title();
  expect(title).toBe("Dogs security blog");
  console.log("yaaaaaa");
  console.log("e depois?");
});