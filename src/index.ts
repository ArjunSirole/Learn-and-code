// src/index.ts
import { ATM } from './ATM';
import { Account } from './Account';
import { ATMService } from './ATMService';

const account = new Account(5000, 20000);  

const atmConfig = {
  availableCash: 10000,
  serverFailureProbability: 0.1  
};

const atm = new ATM(account, atmConfig);  

const atmService = new ATMService(account, atm);
atmService.run();
