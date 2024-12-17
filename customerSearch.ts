class CustomerSearch {

    db: { customers: Customer[] };

    constructor(db: { customers: Customer[] }) {
        this.db = db;
    }

    public searchByCountry(country: string): Customer[] {
        return this.searchCustomersByField('Country', country);
    }

    public searchByCompanyName(company: string): Customer[] {
        return this.searchCustomersByField('CompanyName', company);
    }

    public searchByContact(contact: string): Customer[] {
        return this.searchCustomersByField('ContactName', contact);
    }

    public exportToCSV(data: Customer[]): string {
        return data.map(item => this.formatCustomerAsCSV(item)).join('\n');
    }

    private searchCustomersByField(field: keyof Customer, value: string): Customer[] {
        const filteredCustomers = this.filterCustomersByField(field, value);
        return this.sortCustomersByID(filteredCustomers);
    }

    private filterCustomersByField(field: keyof Customer, value: string): Customer[] {
        return this.db.customers.filter(customer => {
            const fieldValue = customer[field];
            if (typeof fieldValue === 'string') {
                return fieldValue.includes(value);  
            }
            if (typeof fieldValue === 'number') {
                return fieldValue.toString().includes(value);  
            }
            return false;
        });
    }

    private sortCustomersByID(customers: Customer[]): Customer[] {
        return customers.sort((a, b) => a.CustomerID - b.CustomerID);
    }

    private formatCustomerAsCSV(customer: Customer): string {
        return `${customer.CustomerID},${customer.CompanyName},${customer.ContactName},${customer.Country}`;
    }
}

interface Customer {
    CustomerID: number;
    CompanyName: string;
    ContactName: string;
    Country: string;
}
