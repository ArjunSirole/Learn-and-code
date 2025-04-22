// src/ATM.ts
import { Account } from './Account';
import { InsufficientFundsError, InvalidAmountError, ServerConnectionError } from './errors';

export interface ATMConfig {
    availableCash: number;
    serverFailureProbability: number;
  }

export class ATM {
  private availableCash: number;
  private account: Account;
  private serverFailureProbability: number;
  private serverRetries: number;

  constructor(account: Account, config: ATMConfig) {
    this.account = account;
    this.availableCash = config.availableCash;
    this.serverFailureProbability = config.serverFailureProbability;
    this.serverRetries = 3;
  }

  private simulateServerConnection(): boolean {
    return Math.random() > this.serverFailureProbability;
  }

  private attemptServerConnection(): void {
    let attempts = 0;
    while (attempts < this.serverRetries) {
      if (this.simulateServerConnection()) {
        return;
      }
      attempts++;
      console.log(`Server connection failed. Retrying (${attempts}/${this.serverRetries})...`);
    }
    throw new ServerConnectionError('Unable to connect to the server after multiple attempts.');
  }

  public withdrawCash(amount: number): void {
    this.attemptServerConnection();

    if (amount <= 0) {
      throw new InvalidAmountError('Invalid withdrawal amount.');
    }

    if (this.availableCash < amount) {
      throw new InsufficientFundsError('Insufficient cash available in the ATM.');
    }

    this.account.withdraw(amount);
    this.availableCash -= amount;
    console.log(`ATM cash updated. Remaining cash in ATM: Rs.${this.availableCash}`);
  }

  public checkAvailableCash(): void {
    this.attemptServerConnection();
    console.log(`Available cash in ATM: Rs.${this.availableCash}`);
  }

  public depositCash(amount: number): void {
    this.attemptServerConnection();
    this.availableCash += amount;
    console.log(`ATM has been reloaded. Available cash: Rs.${this.availableCash}`);
  }
}
