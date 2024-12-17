class Employee {
    id: number;
    name: string;
    department: string;
    working: boolean;

    constructor(id: number, name: string, department: string, working: boolean) {
        this.id = id;
        this.name = name;
        this.department = department;
        this.working = working;
    }

    save(): void {
        this.saveEmployeeToDatabase();
    }

    printDetails(): void {
        this.printEmployeeDetailReportXML();
        this.printEmployeeDetailReportCSV();
    }

    terminate(): void {
        this.terminateEmployee();
    }

    isWorking(): boolean {
        return this.working;
    }

    private saveEmployeeToDatabase(): void {
        console.log('Saving employee data to the database...');
    }

    private printEmployeeDetailReportXML(): void {
        console.log('Printing employee details in XML...');
    }

    private printEmployeeDetailReportCSV(): void {
        console.log('Printing employee details in CSV...');
    }

    private terminateEmployee(): void {
        console.log('Terminating employee...');
    }
}

