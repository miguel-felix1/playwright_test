import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';
import { ENVS } from '~/constants';
import { TestOptions } from '~/types/general';
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig<TestOptions> = {
  testDir: './e2e',
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { open: 'never', outputFolder: './playwright-report' }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on',
    video: 'retain-on-failure',
    contextOptions: {recordVideo: { dir: "./videos"}},
    launchOptions: {
      headless: true,
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'bot0',
      use: {
        ...devices['Desktop Chrome'],
        headless: false,
        username: "bot0",
        counter: "0",
        password: ENVS.password
      },
    },
    {
      name: 'bot1',
      use: {
        ...devices['Desktop Chrome'],
        headless: false,
        username: "bot1",
        counter: "1",
        password: ENVS.password
      },
    },
    {
      name: 'bot2',
      use: {
        ...devices['Desktop Chrome'],
        headless: false,
        username: "bot2",
        counter: "2",
        password: ENVS.password
      },
    },
    {
      name: 'bot3',
      use: {
        ...devices['Desktop Chrome'],
        headless: false,
        username: "bot3",
        counter: "3",
        password: ENVS.password
      },
    },
    {
      name: 'bot-stakeholder',
      use: {
        ...devices['Desktop Chrome'],
        headless: false,
        username: "bot-stakeholder",
        counter: "stakeholder",
        password: ENVS.password
      },
    },
    {
      name: 'bot-admin',
      use: {
        ...devices['Desktop Chrome'],
        headless: false,
        username: "bot-admin",
        counter: "admin",
        password: ENVS.password
      },
    },

    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //   },
    // },

    // {
    //   name: 'webkit',
    //   use: {
    //     ...devices['Desktop Safari'],
    //   },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: {
    //     ...devices['Pixel 5'],
    //   },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: {
    //     ...devices['iPhone 12'],
    //   },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: {
    //     channel: 'msedge',
    //   },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: {
    //     channel: 'chrome',
    //   },
    // },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  // outputDir: 'test-results/',

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   port: 3000,
  // },
};

export default config;
