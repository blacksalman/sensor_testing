const fs = require('fs');

// Read the JSON files
let data;
let hexData;
try {
    const jsonData = fs.readFileSync('data1.json', 'utf8');
    data = JSON.parse(jsonData);

    const hexDataJson = fs.readFileSync('hex_value_formated_data1.json', 'utf8');
    hexData = JSON.parse(hexDataJson);
} catch (err) {
    console.error("Error reading or parsing the JSON files:", err);
    process.exit(1);
}

// Function to process a given section with its hex value
function processSection(sectionName, hexValue) {
    // Convert hex to binary string (pad to 8 bits)
    const binaryValue = parseInt(hexValue, 16).toString(2).padStart(8, '0');
    let results = [];

    // Process all bits in the section
    for (const [key, value] of Object.entries(data[sectionName].Mattenkonfiguration)) {
        if (key !== "byte") { // Skip the "byte" key
            const bitPosition = value.bit;

            // Ensure the binary value has enough bits (padding added for safety)
            if (binaryValue.length < 8) {
                console.error(`Binary value for ${hexValue} is less than 8 bits: ${binaryValue}`);
                continue;
            }

            // Assign the corresponding bit value (0 or 1)
            const bitValue = binaryValue[7 - bitPosition] === '1' ? 1 : 0;  // reverse indexing to match bit position

            // Push the result
            results.push(`${key}: ${bitValue}`);
        }
    }

    return results.join(', \n');
}

// Iterate through the hex_data to find matching section
Object.entries(hexData).forEach(([hexSectionName, byteHexMap]) => {
    // We need to check if the section name in data.json (e.g., SHZ_Variantencodierung_Max) exists as part of the key in hex_value_formated_data.json (e.g., SHZ_Variantencodierung_Max_Read_Dump)
    
    // Extract the base name from hexSectionName (e.g., "SHZ_Variantencodierung_Max_Read_Dump" becomes "SHZ_Variantencodierung_Max")
    const baseSectionName = hexSectionName.replace('_Read_Dump', '');

    // Check if the baseSectionName exists in data.json
    if (data[baseSectionName]) {
        console.log(`Processing section: ${baseSectionName}`);

        // Now filter out only those sections where the "byte" value is 0
        if (data[baseSectionName].Mattenkonfiguration.byte === 0) {
            console.log('data[sectionName]', data[baseSectionName]);

            // Process each byte and its corresponding hex value from hex_value_formated_data.json
            Object.entries(byteHexMap).forEach(([byteValue, hexValue]) => {
                if (parseInt(byteValue) === 0) {  // Only process byte 0
                    const sectionName = baseSectionName;
                    const output = processSection(sectionName, hexValue);
                    console.log(`Byte ${byteValue} (Hex ${hexValue}): \n${output}\n`);
                }
            });
        } else {
            console.log(`Skipping section ${baseSectionName} because it's not byte 0.`);
        }
    } else {
        console.log(`No matching section found in data.json for ${baseSectionName}.`);
    }
});
