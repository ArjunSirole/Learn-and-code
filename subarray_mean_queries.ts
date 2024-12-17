import * as readlineSync from 'readline-sync';

function main(): void {
    const [arraySize, queryCount] = parseInputLine();  
    const numbers = parseInputLine();                   

    const prefixSum = computePrefixSum(numbers);  

    handleQueries(queryCount, prefixSum);         
}

function parseInputLine(): number[] {
    const inputLine = readlineSync.question().trim();
    return inputLine.split(' ').map(Number);
}

function computePrefixSum(numbers: number[]): number[] {
    const prefixSum: number[] = new Array(numbers.length + 1);
    prefixSum[0] = 0; 

    for (let i = 1; i <= numbers.length; i++) {
        prefixSum[i] = prefixSum[i - 1] + numbers[i - 1];
    }

    return prefixSum;
}

function handleQueries(queryCount: number, prefixSum: number[]): void {
    for (let i = 0; i < queryCount; i++) {
        const [left, right] = parseInputLine();
        const mean = computeMean(prefixSum, left, right);
        console.log(mean);
    }
}

function computeMean(prefixSum: number[], left: number, right: number): number {
    const totalSum = prefixSum[right] - prefixSum[left - 1];
    const count = right - left + 1;
    return Math.floor(totalSum / count);  
}

main();
