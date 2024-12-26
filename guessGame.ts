import * as readline from 'readline';

const userInput = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function isValidNumber(input: string): boolean {
    const number = parseInt(input, 10);
    return !isNaN(number) && number >= 1 && number <= 100;
}

function askForGuess(callback: (guess: number) => void): void {
    userInput.question("Guess a number between 1 and 100: ", (input: string) => {
        if (isValidNumber(input)) {
            const guess = parseInt(input, 10);
            callback(guess);
        } else {
            console.log("Invalid input. Please enter a number between 1 and 100.");
            askForGuess(callback);  
        }
    });
}

function provideGuessFeedback(guess: number, secretNumber: number): string {
    if (guess < secretNumber) {
        return "Too low. Guess again.";
    } else if (guess > secretNumber) {
        return "Too high. Guess again.";
    } else {
        return "";  
    }
}

function generateRandomNumber(): number {
    return Math.floor(Math.random() * 100) + 1;
}

function startNewGameSession(secretNumber: number): void {
    let numberOfGuesses = 0;

    function handleGuess(guess: number): void {
        numberOfGuesses++;
        const feedback = provideGuessFeedback(guess, secretNumber);

        if (feedback === "") {
            console.log(`Congratulations! You've guessed the number in ${numberOfGuesses} attempts.`);
            userInput.close();  
        } else {
            console.log(feedback);
            askForGuess(handleGuess);  
        }
    }

    askForGuess(handleGuess);
}

function beginGuessingGame(): void {
    const secretNumber = generateRandomNumber();
    startNewGameSession(secretNumber);
}

beginGuessingGame();
