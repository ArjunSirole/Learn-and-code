class Employee {
    private name: string;
    private age: number;
    private salary: number;
  
    constructor(name: string, age: number, salary: number) {
      this.name = name;
      this.age = age;
      this.salary = salary;
    }
  
    public getName(): string {
      return this.name;
    }
  
    public setName(name: string): void {
      this.name = name;
    }
  
    public getAge(): number {
      return this.age;
    }
  
    public setAge(age: number): void {
      this.age = age;
    }
  
    public getSalary(): number {
      return this.salary;
    }
  
    public setSalary(salary: number): void {
      this.salary = salary;
    }
  }
  
  let employee = new Employee("John", 30, 50000);

  
// Employee is an object, because it is a instance of the Employee blueprint. 
// It has its own specific data like the name "John", age 30, and salary 50000, 
// that makes it different from any other employee.