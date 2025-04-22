// src/ATMService.ts
import { Account } from './Account';
import { ATM } from './ATM';
import { ServerConnectionError, InsufficientFundsError, InvalidAmountError, PinBlockedError } from './errors';
import readlineSync from 'readline-sync'; 

export class ATMService {
  private atm: ATM;
  private account: Account;

  constructor(account: Account, atm: ATM) {
    this.account = account;
    this.atm = atm;
  }

  public run(): void {
    const correctPin = '1234';
    let exit = false;

    while (!exit) {
      const pin = readlineSync.question('Enter your pin: ');
      try {
        this.account.attemptPin(pin, correctPin);
      } catch (error) {
        if (error instanceof PinBlockedError) {
          console.log(error.message);
          break;
        }
        if (error instanceof Error) { 
          console.log(error.message);
        } else {
          console.log('An unknown error occurred');
        }
        continue;
      }

      while (true) {
        console.log('1. Withdraw Cash');
        console.log('2. Check ATM Cash');
        console.log('3. Exit');
        const choice = readlineSync.questionInt('Choose an option: ');

        try {
          switch (choice) {
            case 1:
              const amount = readlineSync.questionInt('Enter the amount to withdraw: ');
              this.attemptWithdrawal(amount);
              break;
            case 2:
              this.atm.checkAvailableCash();
              break;
            case 3:
              exit = true;
              break;
            default:
              console.log('Invalid option.');
          }
        } catch (error) {
          if (error instanceof ServerConnectionError) {
            const retry = readlineSync.keyInYNStrict('Unable to connect to the server. Do you want to retry?');
            if (!retry) break;
          } else if (error instanceof Error) { 
            console.log(error.message);
          } else {
            console.log('An unknown error occurred');
          }
        }

        if (exit) break;
      }
    }
  }

  private attemptWithdrawal(amount: number): void {
    try {
      this.atm.withdrawCash(amount);
    } catch (error) {
      if (error instanceof InsufficientFundsError || error instanceof InvalidAmountError) {
        console.log(error.message);
      } else if (error instanceof ServerConnectionError) {
        const retry = readlineSync.keyInYNStrict('Unable to connect to the server. Do you want to retry?');
        if (!retry) return;
        this.attemptWithdrawal(amount); 
      } else if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log('An unknown error occurred');
      }
    }
  }
}
