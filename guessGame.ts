import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function isValidNumber(s: string): boolean {
    const num = parseInt(s, 10);
    return !isNaN(num) && num >= 1 && num <= 100;
}

function getUserGuess(callback: (guess: number) => void): void {
    rl.question("Guess a number between 1 and 100: ", (answer: string) => {
        if (isValidNumber(answer)) {
            callback(parseInt(answer, 10));
        } else {
            console.log("Invalid input. Please enter a number between 1 and 100.");
            getUserGuess(callback); 
        }
    });
}

function provideFeedback(guess: number, secretNumber: number): string {
    if (guess < secretNumber) {
        return "Too low. Guess again.";
    } else if (guess > secretNumber) {
        return "Too High. Guess again.";
    } else {
        return "";
    }
}

function playGame(): void {
    const secretNumber = Math.floor(Math.random() * 100) + 1;
    let guessCount = 0;

    function makeGuess(guess: number): void {
        guessCount++;
        const feedback = provideFeedback(guess, secretNumber);
        if (feedback === "") {
            console.log(`You guessed it in ${guessCount} guesses!`);
            rl.close();
        } else {
            console.log(feedback);
            getUserGuess(makeGuess); 
        }
    }

    getUserGuess(makeGuess);
}

playGame();
