const fs = require('fs');
const path = require('path');
const unsentDataPath = path.join(__dirname, '../../json/unsentData.json');

/**
 * Loads unsent data from the file.
 * @returns {Array} Array of unsent data records.
 */
const loadUnsentData = () => {
    if (fs.existsSync(unsentDataPath)) {
        const rawData = fs.readFileSync(unsentDataPath, 'utf-8');
        return JSON.parse(rawData);
    }
    return [];
};

const saveUnsentData = (data) => {
    console.log('Data to be saved to unsentData.json:', data);

    if (!Array.isArray(data)) {
        console.error('Invalid data format: Expected an array.');
        return;
    }

    try {
        // Write the array to the file
        fs.writeFileSync(unsentDataPath, JSON.stringify(data, null, 2)); // Corrected file path
        console.log('Unsent data successfully saved.', data);
    } catch (error) {
        console.error('Error saving unsent data:', error.message);
    }
};



module.exports = { loadUnsentData, saveUnsentData };
