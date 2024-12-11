const Airtable = require('airtable');
const { loadUnsentData, saveUnsentData } = require('./fileStorage');

require('dotenv').config();

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
const tableName = process.env.AIRTABLE_TABLE_NAME;

/**
 * Writes a record to Airtable.
 * @param {Object} record The record to write (rate and timestamp).
 * @returns {Promise<boolean>} True if successful, false otherwise.
 */
const writeToAirtable = async (record) => {
    try {
        await base(tableName).create([
            {
                fields: {
                    Rates: record.Rates,
                    Time: record.Time,
                },
            },
        ]);
        console.log(`Successfully wrote to Airtable: ${record.Rates} at ${record.Time}`);
        return true;
    } catch (error) {
        console.error('Error writing to Airtable:', error.message);
        return false;
    }
};

/**
 * Retries sending unsent data to Airtable.
 */
const retryUnsentData = async () => {
    const unsentData = loadUnsentData();

    for (let i = 0; i < unsentData.length; i++) {
        const record = unsentData[i];
        const success = await writeToAirtable(record);

        if (success) {
            unsentData.splice(i, 1); // Remove successfully sent record
            i--; // Adjust index after removal
        } else {
            break; // Stop retrying if Airtable is still down
        }
    }

    saveUnsentData(unsentData); // Save updated unsent data
};

module.exports = { writeToAirtable, retryUnsentData };
