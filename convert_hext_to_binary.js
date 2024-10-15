const data = {
    "Mattenkonfiguration": {
        "byte": 0,
        "LeSp_verbaut_en": { "bit": 0 },
        "KiSp_verbaut_en": { "bit": 1 },
        "LeWa_verbaut_en": { "bit": 2 },
        "KiWa_verbaut_en": { "bit": 3 },
        "KK_verbaut_en": { "bit": 4 },
        "Balance_Avl": { "bit": 5 },
        "SSIH_Avl": { "bit": 6 },
        "Reserviert": { "bit": 7 }
    },
    "Sensorkonfiguration": {
        "byte": 1,
        "SensorKi5p_verbaut": { "bit": 0 },
        "SensorLeSp_verbaut": { "bit": 1 },
        "SensorKiWa_verbaut": { "bit": 2 },
        "SensorLeWa_verbaut": { "bit": 3 },
        "SensorKK_verbaut": { "bit": 4 },
        "Reserviert1": { "bit": 5 },
        "Reserviert2": { "bit": 6 },
        "Reserviert3": { "bit": 7 }
    }
};

// Function to process a given section with its hex value
function processSection(sectionName, hexValue) {
    const binaryValue = parseInt(hexValue, 16).toString(2).padStart(8, '0');
    let results = {};

    for (const [key, value] of Object.entries(data[sectionName])) {
        if (key !== "byte") { // Skip byte key
            const bitPosition = value.bit;
            // Assign the corresponding bit value (0 or 1)
            results[key] = binaryValue[7 - bitPosition] === '1' ? 1 : 0;
        }
    }

    // Format output as requested with new lines
    const formattedOutput = Object.entries(results)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', \n');

    return formattedOutput;
}

// Process both sections
const mattenOutput = processSection("Mattenkonfiguration", "6F");
const sensorOutput = processSection("Sensorkonfiguration", "0F");

// Print results on new lines
console.log(mattenOutput);
console.log(sensorOutput);
