import indexModule from '../src/index';

describe('index', () => {
  describe('foo2', () => {
    it('should return a string containing the message', () => {
      const message = 'Hello index.test.ts';

      const result = indexModule.foo2(message);

      expect(result).toBe('[index] -> [foo2] Hello index.test.ts');
    });
  });
});
