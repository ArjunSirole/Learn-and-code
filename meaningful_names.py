# Assignment 1: The below program is to Roll the Dice
import random

def roll_dice(sides):
    rolled_number = random.randint(1, sides)
    return rolled_number

def main():
    dice_sides = 6
    keep_playing = True
    while keep_playing:
        user_input = input("Ready to roll? Enter Q to Quit: ")
        if user_input.lower() != "q":
            rolled_number = roll_dice(dice_sides)
            print(f"You have rolled a {rolled_number}")
        else:
            keep_playing = False

main()



# Assignment 2: The below program is to guess the correct number between 1 to 100
import random

def is_valid_guess(guess):
    if guess.isdigit() and 1 <= int(guess) <= 100:
        return True
    return False

def main():
    target_number = random.randint(1, 100)
    guess_is_correct = False
    user_guess = input("Guess a number between 1 and 100: ")
    guess_count = 0

    while not guess_is_correct:
        if not is_valid_guess(user_guess):
            user_guess = input("Invalid input! Please enter a number between 1 and 100: ")
            continue
        else:
            guess_count += 1
            user_guess = int(user_guess)

        if user_guess < target_number:
            user_guess = input("Too low. Guess again: ")
        elif user_guess > target_number:
            user_guess = input("Too high. Guess again: ")
        else:
            print(f"You guessed it in {guess_count} guesses!")
            guess_is_correct = True

main()


# Assignment 3: The below program is to check whether the number is Armstrong number or not
def calculate_sum_of_powers(number):
    sum_of_powers = 0
    number_digits = 0

    temporary_number = number
    while temporary_number > 0:
        number_digits += 1
        temporary_number //= 10

    temporary_number = number
    for _ in range(number_digits):
        digit = temporary_number % 10
        sum_of_powers += digit ** number_digits
        temporary_number //= 10
    
    return sum_of_powers

def main():
    number_to_check = int(input("\nPlease Enter the Number to Check for Armstrong: "))
    
    if number_to_check == calculate_sum_of_powers(number_to_check):
        print(f"\n{number_to_check} is an Armstrong Number.\n")
    else:
        print(f"\n{number_to_check} is Not an Armstrong Number.\n")

main()
