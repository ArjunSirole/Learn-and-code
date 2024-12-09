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



def calculate_sum_of_powers(number):
    sum_of_powers = 0
    number_digits = 0

    temp_number = number
    while temp_number > 0:
        number_digits += 1
        temp_number //= 10

    temp_number = number
    for _ in range(number_digits):
        digit = temp_number % 10
        sum_of_powers += digit ** number_digits
        temp_number //= 10
    
    return sum_of_powers

def main():
    number_to_check = int(input("\nPlease Enter the Number to Check for Armstrong: "))
    
    if number_to_check == calculate_sum_of_powers(number_to_check):
        print(f"\n{number_to_check} is an Armstrong Number.\n")
    else:
        print(f"\n{number_to_check} is Not an Armstrong Number.\n")

main()
