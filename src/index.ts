import { countDivisors } from "./utils/divisorUtils";

export const findMatchingDivisorCounts = (limit: number): number => {
  if (limit <= 0) {
    throw new Error("Input must be a positive integer");
  }

  let matchingCount = 0;

  for (let i = 1; i <= Math.floor(limit / 2); i++) {
    const mirror = limit - i + 1;
    if (countDivisors(i) === countDivisors(mirror)) {
      matchingCount += 2;
    }
  }

  if (limit % 2 === 1) {
    const middle = Math.ceil(limit / 2);
    matchingCount += 1; 
  }

  return matchingCount;
};
