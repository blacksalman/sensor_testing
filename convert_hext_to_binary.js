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
        "Reserviert": { "bit": [5, 6, 7] }
    },
    "SHz Variantenkodierung 3": {
        "byte": 2,
        "Effektivwertregelung_SHz_einschalten_SiH": { "bit": 0 },
        "Effektivwertregelung_SHz_einschalten_SSIH": { "bit": 1 },
        "Bordnetznotlauf_VAS_SHZ_aktiv": { "bit": 2 },
        "Bordnetzleitungsreduktion_aktiv": { "bit": 3 },
        "Reaktion_auf_EngRunStat_aktiv": { "bit": 4 },
        "Heizleistungsbudget_aktiv": { "bit": 5 },
        "Uhrzeit_bei_Heizleistungsbudget_aktiv": { "bit": 6 },
        "Temperaturabhängige_Überlastschwelle_aktiv": { "bit": 7 }
    },
    "SHz Variantenkodierung 4": {
        "byte": 3,
        "Regelung_SSIH_Kreis": { "bit": 0 },
        "Regelung_SIH_Kreis": { "bit": 3 },
        "Innentemp_Steuerung": { "bit": 6 },
        "Temperaturklassen_en": { "bit": 7 }
    }
};

// Function to process a given section with its hex value
function processSection(sectionName, hexValue) {
    const binaryValue = parseInt(hexValue, 16).toString(2).padStart(8, '0');
    let results = [];

    // Process all bits except for Innentemp_Steuerung and Temperaturklassen_en
    for (const [key, value] of Object.entries(data[sectionName])) {
        if (key !== "byte") { // Skip byte key
            if(sectionName !== "SHz Variantenkodierung 4"){
                 if (Array.isArray(value.bit)) {
                    // Process each bit in the array and add to results
                    value.bit.forEach(bitPosition => {
                        const bitValue = binaryValue[7 - bitPosition] === '1' ? 1 : 0;
                        results.push(`3${key}: ${bitValue}`);
                    });
                } else {
                    const bitPosition = value.bit;
                    // Assign the corresponding bit value (0 or 1)
                    const bitValue = binaryValue[7 - bitPosition] === '1' ? 1 : 0;
                    results.push(`${key}: ${bitValue}`);
                }
            }
           
        }
    }

    // Special output format for byte 3
    if (sectionName === "SHz Variantenkodierung 4") {
        // Capture Regelung_SSIH_Kreis for bits 0 to 2
        for (let i = 0; i <= 2; i++) {
            const bitValue = binaryValue[7 - i] === '1' ? 1 : 0;
            results.push(`Regelung_SSIH_Kreis: ${bitValue}`);
        }

        // Capture Regelung_SIH_Kreis for bits 3 to 5
        for (let i = 3; i <= 5; i++) {
            const bitValue = binaryValue[7 - i] === '1' ? 1 : 0;
            results.push(`Regelung_SIH_Kreis: ${bitValue}`);
        }

        // Capture values for Innentemp_Steuerung and Temperaturklassen_en only once
        const innentempValue = binaryValue[7 - 6] === '1' ? 1 : 0;
        const temperaturklassenValue = binaryValue[7 - 7] === '1' ? 1 : 0;

        // Push values only once at the end
        results.push(`Innentemp_Steuerung: ${innentempValue}`);
        results.push(`Temperaturklassen_en: ${temperaturklassenValue}`);
    }

    return results.join(', ');
}

// Get user input for hexadecimal value and byte
const hexValue = prompt("Enter a hexadecimal value (e.g., 6F):");
const byteValue = parseInt(prompt("Enter a byte value (e.g., 3):"));

// Find the section corresponding to the byte value
const sectionName = Object.keys(data).find(key => data[key].byte === byteValue);

if (sectionName) {
    const output = processSection(sectionName, hexValue);
    console.log(output);
} else {
    console.log("No section found for the provided byte value.");
}
