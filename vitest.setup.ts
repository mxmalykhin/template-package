import { faker } from '@faker-js/faker';
import chalk from 'chalk';
import { setupServer } from 'msw/node';
import failOnConsole from 'vitest-fail-on-console';

let seed: number;
const mswServer = setupServer();

mswServer.events.on('request:start', async ({ request }) => {
  const payload = await request.clone().text();
  console.log(chalk.bgWhiteBright.black.bold('[MSW] Intercepted'), request.method, request.url, payload);
});

beforeAll(() => {
  seed = faker.seed();
  console.log(chalk.bgBlack.yellowBright.underline(`FAKER SEED: ${seed}`));
  vi.stubEnv('TEST_SEED', seed.toString());

  failOnConsole();
  mswServer.listen({ onUnhandledRequest: 'error' });
  vi.useFakeTimers();
});

afterAll(async () => {
  mswServer.close();
  vi.useRealTimers();
});

beforeEach(() => {
  vi.clearAllTimers();
  vi.setSystemTime(0);

  // mocks...
});

afterEach(async () => {
  //  await vi.runOnlyPendingTimersAsync();
  mswServer.resetHandlers();
  //  localStorage.clear();
  //  sessionStorage.clear();
});
