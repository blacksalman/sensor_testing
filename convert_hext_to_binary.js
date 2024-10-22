const readline = require('readline');
const fs = require('fs');

// Read the JSON file
let data;
try {
    const jsonData = fs.readFileSync('data.json', 'utf8');
    data = JSON.parse(jsonData);
} catch (err) {
    console.error("Error reading or parsing data.json:", err);
    process.exit(1);
}

// Function to process a given section with its hex value
function processSection(sectionName, hexValue) {
    const binaryValue = parseInt(hexValue, 16).toString(2).padStart(8, '0');
    let results = [];

    // Process all bits in the section
    for (const [key, value] of Object.entries(data[sectionName])) {
        if (key !== "byte") { // Skip byte key
            if (Array.isArray(value.bit)) {
                // Process each bit in the array
                value.bit.forEach(bitPosition => {
                    const bitValue = binaryValue[7 - bitPosition] === '1' ? 1 : 0;
                    results.push(`${key}: ${bitValue}`);
                });
            } else {
                const bitPosition = value.bit;
                // Assign the corresponding bit value (0 or 1)
                const bitValue = binaryValue[7 - bitPosition] === '1' ? 1 : 0;
                results.push(`${key}: ${bitValue}`);
            }
        }
    }

    return results.join(', \n');
}

// Setup readline for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Get user input for hexadecimal value and byte
rl.question("Enter a hexadecimal value (e.g., 6F): ", (hexValue) => {
    rl.question("Enter a byte value (e.g., 3): ", (byteInput) => {
        const byteValue = parseInt(byteInput, 10);

        // Find the section corresponding to the byte value
        const sectionName = Object.keys(data).find(key => data[key].byte === byteValue);

        if (sectionName) {
            const output = processSection(sectionName, hexValue);
            console.log(output);
        } else {
            console.log("No section found for the provided byte value.");
        }

        rl.close();
    });
});



