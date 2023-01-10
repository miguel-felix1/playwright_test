import { test as playwrightTest } from '@playwright/test';
import { ENVS } from '../../constants';
import { TestOptions } from '~/types/general';

export const test = playwrightTest.extend<TestOptions>({
  username: [ENVS.user, { option: true }],
  password: [ENVS.password, { option: true }],
  counter: [ENVS.counter, { option: true }],
});
