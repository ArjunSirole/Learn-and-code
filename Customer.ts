class Customer {
  private firstName: string;
  private lastName: string;
  private myWallet: Wallet;

  constructor(firstName: string, lastName: string, wallet: Wallet) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.myWallet = wallet;
  }

  getFirstName(): string {
    return this.firstName;
  }

  getLastName(): string {
    return this.lastName;
  }

  getBalance(): number {
    return this.myWallet.getTotalMoney();
  }

  addFunds(amount: number): void {
    this.myWallet.addMoney(amount);
  }

  makePayment(amount: number): boolean {
    if (this.myWallet.getTotalMoney() >= amount) {
      this.myWallet.subtractMoney(amount);
      return true;
    }
    return false;
  }
}

class Wallet {
  private value: number;

  constructor(initialValue: number = 0) {
    this.value = initialValue;
  }

  getTotalMoney(): number {
    return this.value;
  }

  setTotalMoney(newValue: number): void {
    this.value = newValue;
  }

  addMoney(deposit: number): void {
    this.value += deposit;
  }

  subtractMoney(debit: number): void {
    this.value -= debit;
  }
}

const myWallet = new Wallet(5.0);
const myCustomer = new Customer("John", "Doe", myWallet);

const payment = 2.0;
console.log("I want my two dollars!");

if (myCustomer.makePayment(payment)) {
  console.log("Payment successful");
  console.log(`Remaining balance: $${myCustomer.getBalance().toFixed(2)}`);
} else {
  console.log("Not enough money, come back later.");
}
