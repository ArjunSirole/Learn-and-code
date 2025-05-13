import { findMatchingDivisorCounts } from "../src/index";

describe("findMatchingDivisorCounts", () => {
  test("should return correct result for 3", () => {
    expect(findMatchingDivisorCounts(3)).toBe(1);
  });

  test("should return correct result for 15", () => {
    expect(findMatchingDivisorCounts(15)).toBe(7); 
  });  

  test("should return correct result for 100", () => {
    expect(findMatchingDivisorCounts(100)).toBe(16);
  });

  test("should return correct result for 1", () => {
    expect(findMatchingDivisorCounts(1)).toBe(1);
  });

  test("should throw error for negative input", () => {
    expect(() => findMatchingDivisorCounts(-5)).toThrow("Input must be a positive integer");
  });
});
