import { foo1 } from "@/module1";

describe("module1", () => {
  describe("foo1", () => {
    it("should return a string containing the message", () => {
      const message = "Hello";

      const result = foo1(message);

      expect(result).toBe("[module1] -> [foo1] Hello");
    });
  });
});
