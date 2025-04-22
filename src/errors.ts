// src/errors.ts
export class InsufficientFundsError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'InsufficientFundsError';
    }
  }
  
  export class InvalidAmountError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'InvalidAmountError';
    }
  }
  
  export class DailyLimitExceededError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'DailyLimitExceededError';
    }
  }
  
  export class PinBlockedError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'PinBlockedError';
    }
  }
  
  export class ServerConnectionError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'ServerConnectionError';
    }
  }
  