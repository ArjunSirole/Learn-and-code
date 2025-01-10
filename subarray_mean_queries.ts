import * as readlineSync from "readline-sync";

function main(): void {
  const [arraySize, queryCount] = readNumbersFromInput();
  const numbers = readNumbersFromInput();

  const prefixSumArray = calculatePrefixSum(numbers);
  handleQueries(queryCount, prefixSumArray);
}

function readNumbersFromInput(): number[] {
  const inputLine = readlineSync.question().trim();
  return inputLine.split(" ").map(Number);
}

function calculatePrefixSum(numbers: number[]): number[] {
  const prefixSum: number[] = new Array(numbers.length + 1);
  prefixSum[0] = 0;

  for (let i = 1; i <= numbers.length; i++) {
    prefixSum[i] = prefixSum[i - 1] + numbers[i - 1];
  }

  return prefixSum;
}

function handleQueries(queryCount: number, prefixSumArray: number[]): void {
  for (let queryIndex = 0; queryIndex < queryCount; queryIndex++) {
    const [leftIndex, rightIndex] = readNumbersFromInput();
    const mean = calculateMean(prefixSumArray, leftIndex, rightIndex);
    printMean(mean);
  }
}

function calculateMean(
  prefixSumArray: number[],
  leftIndex: number,
  rightIndex: number
): number {
  const totalSum = prefixSumArray[rightIndex] - prefixSumArray[leftIndex - 1];
  const elementCount = rightIndex - leftIndex + 1;
  return Math.floor(totalSum / elementCount);
}

function printMean(mean: number): void {
  console.log(mean);
}

main();
