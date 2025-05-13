export const countDivisors = (number: number): number => {
  let divisorCount = 0;
  for (let i = 1; i * i <= number; i++) {
    if (number % i === 0) {
      divisorCount += i * i === number ? 1 : 2;
    }
  }
  return divisorCount;
};
