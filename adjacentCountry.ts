import * as readline from 'readline';

const countryCodeToFullNameMap: { [key: string]: string } = {
    'IN': 'India',
    'US': 'United States',
    'NZ': 'New Zealand',
    'CA': 'Canada',
    'AU': 'Australia',
    'PK': 'Pakistan',
    'CN': 'China',
    'NP': 'Nepal',
    'BD': 'Bangladesh',
    'MM': 'Myanmar',
    'MX': 'Mexico',
    'GB': 'United Kingdom',
    'FR': 'France',
    'DE': 'Germany',
    'IT': 'Italy',
    'JP': 'Japan',
    'BR': 'Brazil',
    'AR': 'Argentina',
    'CO': 'Colombia',
    'PE': 'Peru',
    'CL': 'Chile',
    'BO': 'Bolivia',
    'PL': 'Poland',
    'CZ': 'Czech Republic',
    'ES': 'Spain',
    'IE': 'Ireland',
    'AT': 'Austria',
    'CH': 'Switzerland',
    'KR': 'South Korea',
};

const countryAdjacencyMap: { [key: string]: string[] } = {
    'IN': ['PK', 'CN', 'NP', 'BD', 'MM'],
    'US': ['CA', 'MX'],
    'NZ': ['AU'],
    'CA': ['US', 'MX'],
    'AU': ['NZ'],
    'GB': ['FR', 'IE'],
    'FR': ['GB', 'DE', 'ES'],
    'DE': ['FR', 'PL', 'CZ'],
    'IT': ['CH', 'FR', 'AT'],
    'JP': ['KR', 'CN'],
    'BR': ['AR', 'CO', 'PE'],
    'AR': ['BR', 'CL', 'BO'],
    'CO': ['BR', 'PE'],
    'PE': ['BR', 'CO', 'AR'],
    'CL': ['AR', 'BO'],
    'BO': ['AR', 'CL'],
    'PL': ['DE'],
    'CZ': ['DE'],
    'ES': ['FR'],
    'IE': ['GB'],
    'AT': ['IT', 'DE'],
    'CH': ['IT', 'DE'],
    'KR': ['JP'],
};

function getFullCountryNameFromCode(countryCode: string): string {
    const countryFullName = countryCodeToFullNameMap[countryCode];
    return countryFullName || 'Unknown Country';
}

function getAdjacentCountriesList(countryCode: string): string[] {
    const adjacentCountryCodes = countryAdjacencyMap[countryCode] || [];
    return adjacentCountryCodes.map(code => getFullCountryNameFromCode(code));
}

const inputInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function initiateCountryLookup() {
    inputInterface.question('Enter a Country Code (e.g., IN/US/NZ) or "exit" to quit: ', (userInput) => {
        const countryCode = userInput.trim().toUpperCase();

        if (countryCode === 'EXIT') {
            console.log('Exiting the program...');
            inputInterface.close();
            return;
        }

        const countryFullName = getFullCountryNameFromCode(countryCode);

        if (countryFullName === 'Unknown Country') {
            console.log('Invalid country code entered!');
        } else {
            const adjacentCountries = getAdjacentCountriesList(countryCode);
            console.log(`Country: ${countryFullName}`);
            if (adjacentCountries.length === 0) {
                console.log('No adjacent countries found.');
            } else {
                console.log('Adjacent Countries:');
                adjacentCountries.forEach(country => console.log(country));
            }
        }

        initiateCountryLookup();
    });
}

console.log('Welcome to the Country Lookup Program!');
console.log('You can enter a country code (e.g., IN for India) to get information about it.');

initiateCountryLookup();
