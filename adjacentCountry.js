"use strict";
// import * as readline from 'readline';
Object.defineProperty(exports, "__esModule", { value: true });
// const countryCodeToFullNameMap: { [key: string]: string } = {
//     'IN': 'India',
//     'US': 'United States',
//     'NZ': 'New Zealand',
//     'CA': 'Canada',
//     'AU': 'Australia',
//     'PK': 'Pakistan',   
//     'CN': 'China',      
//     'NP': 'Nepal',      
//     'BD': 'Bangladesh', 
//     'MM': 'Myanmar',    
//     'MX': 'Mexico',     
// };
// const countryAdjacencyMap: { [key: string]: string[] } = {
//     'IN': ['PK', 'CN', 'NP', 'BD', 'MM'],   
//     'US': ['CA', 'MX'],                      
//     'NZ': ['AU'],                            
//     'CA': ['US', 'MX'],                      
//     'AU': ['NZ'],                            
// };
// function getFullCountryNameFromCode(countryCode: string): string {
//     const countryFullName = countryCodeToFullNameMap[countryCode];
//     return countryFullName || 'Unknown Country';
// }
// function getAdjacentCountriesList(countryCode: string): string[] {
//     const adjacentCountryCodes = countryAdjacencyMap[countryCode] || [];
//     return adjacentCountryCodes.map(code => getFullCountryNameFromCode(code));
// }
// const inputInterface = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });
// function initiateCountryLookup() {
//     inputInterface.question('Enter a Country Code (e.g., IN/US/NZ): ', (userInput) => {
//         const countryCode = userInput.trim().toUpperCase();
//         const countryFullName = getFullCountryNameFromCode(countryCode);
//         if (countryFullName === 'Unknown Country') {
//             console.log('Invalid country code entered!');
//         } else {
//             const adjacentCountries = getAdjacentCountriesList(countryCode);
//             console.log(`Country: ${countryFullName}`);
//             if (adjacentCountries.length === 0) {
//                 console.log('No adjacent countries found.');
//             } else {
//                 console.log('Adjacent Countries:');
//                 adjacentCountries.forEach(country => console.log(country));
//             }
//         }
//         inputInterface.close();
//     });
// }
// initiateCountryLookup();
var readline = require("readline");
var countryCodeToFullNameMap = {
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
    // Add all other countries here
};
var countryAdjacencyMap = {
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
    // Add adjacencies for other countries here
};
function getFullCountryNameFromCode(countryCode) {
    var countryFullName = countryCodeToFullNameMap[countryCode];
    return countryFullName || 'Unknown Country';
}
function getAdjacentCountriesList(countryCode) {
    var adjacentCountryCodes = countryAdjacencyMap[countryCode] || [];
    return adjacentCountryCodes.map(function (code) { return getFullCountryNameFromCode(code); });
}
var inputInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function initiateCountryLookup() {
    inputInterface.question('Enter a Country Code (e.g., IN/US/NZ) or "exit" to quit: ', function (userInput) {
        var countryCode = userInput.trim().toUpperCase();
        if (countryCode === 'EXIT') {
            console.log('Exiting the program...');
            inputInterface.close();
            return;
        }
        var countryFullName = getFullCountryNameFromCode(countryCode);
        if (countryFullName === 'Unknown Country') {
            console.log('Invalid country code entered!');
        }
        else {
            var adjacentCountries = getAdjacentCountriesList(countryCode);
            console.log("Country: ".concat(countryFullName));
            if (adjacentCountries.length === 0) {
                console.log('No adjacent countries found.');
            }
            else {
                console.log('Adjacent Countries:');
                adjacentCountries.forEach(function (country) { return console.log(country); });
            }
        }
        // Ask for input again (loop)
        initiateCountryLookup();
    });
}
initiateCountryLookup();
