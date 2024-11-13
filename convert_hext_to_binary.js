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

// Key-value pair of byte values and their corresponding hex values
const byteHexMap = {
    0: '6F',
    1: '0F',
    2: '6F',
    3: 'DB',
    4: '2F',
    5: '41',
    6: '01',
    7: '0F',
    8: '00',
    9: '00'
};

// Loop through the byteHexMap and process each pair
Object.entries(byteHexMap).forEach(([byteValue, hexValue]) => {
    // Find the section corresponding to the byte value
    const sectionName = Object.keys(data).find(key => data[key].byte === parseInt(byteValue));

    if (sectionName) {
        const output = processSection(sectionName, hexValue);
        console.log(`Byte ${byteValue} (Hex ${hexValue}): \n${output}\n`);
    } else {
        console.log(`No section found for the provided byte value ${byteValue} (Hex ${hexValue}).\n`);
    }
});
