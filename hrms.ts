const promptSync = require("prompt-sync")();

// Abstract base class for Employee
abstract class Employee {
    constructor(
        private name: string,
        private id: number,
        private salary: number
    ) {}

    public getName(): string {
        return this.name;
    }

    public getSalary(): number {
        return this.salary;
    }

    public getId(): number {
        return this.id;
    }

    abstract getRole(): string;
    abstract displayDetails(): void;
}

// Manager class inherits from Employee
class Manager extends Employee {
    constructor(
        name: string,
        id: number,
        salary: number,
        private department: string
    ) {
        super(name, id, salary);
    }

    getRole(): string {
        return "Manager";
    }

    getDepartment(): string {
        return this.department;
    }

    displayDetails(): void {
        console.log(`Name: ${this.getName()}`);
        console.log(`ID: ${this.getId()}`);
        console.log(`Salary: Rs.${this.getSalary()}`);
        console.log(`Role: ${this.getRole()}`);
        console.log(`Department: ${this.department}`);
        console.log('----------------------------------------');
    }
}

// Developer class inherits from Employee
class Developer extends Employee {
    constructor(
        name: string,
        id: number,
        salary: number,
        private languages: string[]
    ) {
        super(name, id, salary);
    }

    getRole(): string {
        return "Developer";
    }

    displayDetails(): void {
        console.log('----------------------------------------');
        console.log(`Name: ${this.getName()}`);
        console.log(`ID: ${this.getId()}`);
        console.log(`Salary: Rs.${this.getSalary()}`);
        console.log(`Role: ${this.getRole()}`);
        console.log(`Programming Languages: ${this.languages.join(", ")}`);
        console.log('----------------------------------------');
    }
}

// Service for managing employee records (adding/removing employees)
class EmployeeManagementService {
    private employees: Employee[] = [];

    public addEmployee(employee: Employee): void {
        this.employees.push(employee);
    }

    public removeEmployee(name: string): void {
        const employeeIndex = this.findEmployeeIndex(name);
        if (employeeIndex !== -1) {
            this.employees.splice(employeeIndex, 1);
            console.log(`Employee named ${name} has been removed.`);
        } else {
            console.log(`Employee named ${name} not found.`);
        }
    }

    public getAllEmployees(): Employee[] {
        return this.employees;
    }

    private findEmployeeIndex(name: string): number {
        return this.employees.findIndex((emp) => emp.getName().toLowerCase() === name.toLowerCase());
    }
}

// Service for filtering employees by role or department
class EmployeeFilterService {
    constructor(private employees: Employee[]) {}

    public filterByRole(role: string): Employee[] {
        return this.employees.filter(
            (emp) => emp.getRole().toLowerCase() === role.toLowerCase()
        );
    }

    public filterByDepartment(department: string): Employee[] {
        return this.employees.filter(
            (emp) =>
                emp instanceof Manager &&
                (emp as Manager).getDepartment().toLowerCase() === department.toLowerCase()
        );
    }
}

// Employee Display Service
class EmployeeDisplayService {
    public static displayDetails(employee: Employee): void {
        employee.displayDetails();
    }

    public static displayAllEmployees(employees: Employee[]): void {
        if (employees.length === 0) {
            console.log("No employees found.");
        } else {
            employees.forEach((emp) => emp.displayDetails());
        }
    }
}

// Employee Creation Service
class EmployeeCreationService {
    public static createEmployee(employeeService: EmployeeManagementService): void {
        const name = promptSync('Enter the employee name: ') || '';
        const id = this.getValidatedId();
        const salary = this.getValidatedSalary();
        const roleChoice = this.selectRole();

        if (roleChoice === 1) {
            const department = promptSync('Enter the department name: ') || '';
            const manager = new Manager(name, id, salary, department);
            employeeService.addEmployee(manager);
        } else if (roleChoice === 2) {
            const languages = this.getProgrammingLanguages();
            const developer = new Developer(name, id, salary, languages);
            employeeService.addEmployee(developer);
        } else {
            console.log("Invalid role choice. No employee added.");
        }
    }

    private static selectRole(): number {
        console.log("Select the role of the employee:");
        console.log("1. Manager");
        console.log("2. Developer");
        return this.getValidatedChoice(1, 2);
    }

    private static getValidatedId(): number {
        let id: number;
        do {
            id = parseInt(promptSync('Enter the employee ID: ') || '0');
        } while (isNaN(id) || id <= 0);
        return id;
    }

    private static getValidatedSalary(): number {
        let salary: number;
        do {
            salary = parseFloat(promptSync('Enter the employee salary: ') || '0');
        } while (isNaN(salary) || salary <= 0);
        return salary;
    }

    private static getProgrammingLanguages(): string[] {
        let languages: string[] = [];
        while (languages.length === 0) {
            const input = promptSync('Enter the programming languages (comma separated): ') || '';
            languages = input.split(',').map((lang) => lang.trim()).filter((lang) => lang !== '');
        }
        return languages;
    }

    private static getValidatedChoice(min: number, max: number): number {
        let choice: number;
        do {
            choice = parseInt(promptSync(`Enter your choice (${min} or ${max}): `) || '0');
        } while (isNaN(choice) || choice < min || choice > max);
        return choice;
    }
}

// Service for handling user input
class UserInputService {
    public static getChoice(prompt: string): string {
        return promptSync(prompt);
    }
}

// Main class for interaction flow
class EmployeeMenuService {
    private employeeService: EmployeeManagementService;
    private filterService: EmployeeFilterService;

    constructor() {
        this.employeeService = new EmployeeManagementService();
        this.filterService = new EmployeeFilterService(this.employeeService.getAllEmployees());
    }

    public displayMenu(): void {
        console.log("\n1. Add Employee");
        console.log("2. Remove Employee by Name");
        console.log("3. Display All Employees");
        console.log("4. Filter Employees by Role");
        console.log("5. Filter Employees by Department");
    }

    public handleChoice(choice: string): void {
        switch (choice) {
            case "1":
                EmployeeCreationService.createEmployee(this.employeeService);
                break;
            case "2":
                this.removeEmployeeByName();
                break;
            case "3":
                EmployeeDisplayService.displayAllEmployees(this.employeeService.getAllEmployees());
                break;
            case "4":
                this.filterEmployeesByRole();
                break;
            case "5":
                this.filterEmployeesByDepartment();
                break;
            default:
                console.log("Invalid choice.");
        }
    }

    private removeEmployeeByName(): void {
        const nameToRemove = UserInputService.getChoice("Enter employee name to remove: ");
        this.employeeService.removeEmployee(nameToRemove);
    }

    private filterEmployeesByRole(): void {
        const role = UserInputService.getChoice("Enter role to filter by: ");
        const filteredByRole = this.filterService.filterByRole(role);
        EmployeeDisplayService.displayAllEmployees(filteredByRole);
    }

    private filterEmployeesByDepartment(): void {
        const department = UserInputService.getChoice("Enter department to filter by: ");
        const filteredByDept = this.filterService.filterByDepartment(department);
        EmployeeDisplayService.displayAllEmployees(filteredByDept);
    }

    public show(): void {
        let keepRunning = true;
        while (keepRunning) {
            this.displayMenu();
            const choice = UserInputService.getChoice("Enter your choice: ");
            this.handleChoice(choice);
            const continueOperation = UserInputService.getChoice("Do you want to perform another operation? (yes/no): ").toLowerCase();
            keepRunning = continueOperation === 'yes';
        }
    }
}

// Running the main function
function main() {
    const menuService = new EmployeeMenuService();
    menuService.show();
}

main();