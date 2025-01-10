# Assignment 1: The below program is to Roll the Dice
import random

def rollDice(sides):
    rolledNumber = random.randint(1, sides)
    return rolledNumber

def main():
    diceSides = 6
    keepPlaying = True
    while keepPlaying:
        userInput = input("Ready to roll? Enter Q to Quit: ")
        if userInput.lower() != "q":
            rolledNumber = rollDice(diceSides)
            print(f"You have rolled a {rolledNumber}")
        else:
            keepPlaying = False

main()



# Assignment 2: The below program is to guess the correct number between 1 to 100
import random

def isValidGuess(guess):
    if guess.isdigit() and 1 <= int(guess) <= 100:
        return True
    return False

def main():
    targetNumber = random.randint(1, 100)
    guessIsCorrect = False
    userGuess = input("Guess a number between 1 and 100: ")
    guessCount = 0

    while not guessIsCorrect:
        if not isValidGuess(userGuess):
            userGuess = input("Invalid input! Please enter a number between 1 and 100: ")
            continue
        else:
            guessCount += 1
            userGuess = int(userGuess)

        if userGuess < targetNumber:
            userGuess = input("Too low. Guess again: ")
        elif userGuess > targetNumber:
            userGuess = input("Too high. Guess again: ")
        else:
            print(f"You guessed it in {guessCount} guesses!")
            guessIsCorrect = True

main()


# Assignment 3: The below program is to check whether the number is Armstrong number or not
def calculateSum(number):
    sum = 0
    numberDigits = 0

    temporaryNumber = number
    while temporaryNumber > 0:
        numberDigits += 1
        temporaryNumber //= 10

    temporaryNumber = number
    for _ in range(1, temporaryNumber + 1):
        digit = temporaryNumber % 10
        sum += digit ** numberDigits
        temporaryNumber //= 10
    
    return sum

inputNumber = int(input("\nPlease Enter the Number to Check for Armstrong: "))
    
if inputNumber == calculateSum(inputNumber):
    print(f"\n{inputNumber} is an Armstrong Number.\n")
else:
    print(f"\n{inputNumber} is Not an Armstrong Number.\n")


