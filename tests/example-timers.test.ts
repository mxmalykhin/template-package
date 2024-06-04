// source: https://vitest.dev/guide/mocking.html#example-4

import type { Mock } from 'vitest';

function executeAfterTwoHours(func: Mock) {
  setTimeout(func, 1000 * 60 * 60 * 2); // 2 hours
}

function executeEveryMinute(func: Mock) {
  setInterval(func, 1000 * 60); // 1 minute
}

const mock = vi.fn(() => console.log('executed'));

describe('delayed execution', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should execute the function', () => {
    executeAfterTwoHours(mock);
    vi.runAllTimers();
    expect(mock).toHaveBeenCalledTimes(1);
  });

  it('should not execute the function', () => {
    executeAfterTwoHours(mock);
    // advancing by 2ms won't trigger the func
    vi.advanceTimersByTime(2);
    expect(mock).not.toHaveBeenCalled();
  });

  it('should execute every minute', () => {
    executeEveryMinute(mock);
    vi.advanceTimersToNextTimer();
    expect(mock).toHaveBeenCalledTimes(1);
    vi.advanceTimersToNextTimer();
    expect(mock).toHaveBeenCalledTimes(2);
  });
});
