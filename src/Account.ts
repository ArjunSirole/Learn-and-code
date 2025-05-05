// src/Account.ts
import { InsufficientFundsError, InvalidAmountError, DailyLimitExceededError, PinBlockedError } from './errors';

export class Account {
  private balance: number;
  private dailyLimit: number;
  private totalWithdrawnToday: number;
  private pinAttempts: number;
  private pinBlocked: boolean;

  constructor(balance: number, dailyLimit: number) {
    this.balance = balance;
    this.dailyLimit = dailyLimit;
    this.totalWithdrawnToday = 0;
    this.pinAttempts = 0;
    this.pinBlocked = false;
  }

  public getBalance(): number {
    return this.balance;
  }

  public withdraw(amount: number): void {
    if (this.pinBlocked) {
      throw new PinBlockedError('Card is blocked due to too many incorrect pin attempts.');
    }

    if (amount <= 0) {
      throw new InvalidAmountError('Withdrawal amount must be greater than zero.');
    }

    if (this.totalWithdrawnToday + amount > this.dailyLimit) {
      throw new DailyLimitExceededError('Daily withdrawal limit exceeded.');
    }

    if (this.balance < amount) {
      throw new InsufficientFundsError('Insufficient funds in your account.');
    }

    this.balance -= amount;
    this.totalWithdrawnToday += amount;
    console.log(`Withdrawal successful. Remaining balance: Rs.${this.balance}`);
  }

  public attemptPin(pin: string, correctPin: string): void {
    if (this.pinBlocked) {
      throw new PinBlockedError('Card is blocked due to too many incorrect pin attempts.');
    }

    if (pin !== correctPin) {
      this.pinAttempts += 1;
      if (this.pinAttempts >= 3) {
        this.pinBlocked = true;
        throw new PinBlockedError('Too many incorrect pin attempts. Your card is blocked.');
      } else {
        console.log('Incorrect pin. Try again.');
      }
    } else {
      this.pinAttempts = 0;
      console.log('Pin verified successfully.');
    }
  }

  public resetDailyLimit(): void {
    this.totalWithdrawnToday = 0;
    console.log('Daily limit has been reset.');
  }
}
