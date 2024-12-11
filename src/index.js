const fetchBTCExchangeRate = require('./services/fetchRate');
const { writeToAirtable } = require('./services/airtableService');
const { loadUnsentData, saveUnsentData } = require('./services/fileStorage');

/**
 * Fetches the current rate and attempts to write it to Airtable.
 * If it fails, the record is saved to the unsent queue.
 */
const handleFetchAndWrite = async () => {
    try {
        // Fetch the current rate
        const rateData = await fetchBTCExchangeRate();

        // Try to write to Airtable
        const success = await writeToAirtable(rateData);

        if (!success) {
            // Save to unsent queue on failure
            saveToUnsentQueue(rateData);
            console.log('Saved to unsent data queue.');
        }
    } catch (error) {
        console.error('Error during fetch or write:', error.message);
    }
};

/**
 * Saves a record to the unsent data queue.
 * @param {Object} record - The data to save.
 */
const saveToUnsentQueue = (record) => {
    const unsentData = loadUnsentData();

    // Check if the record already exists
    const exists = unsentData.some(
        (item) => item.Rates === record.Rates && item.Time === record.Time
    );

    if (!exists) {
        unsentData.push(record);
        saveUnsentData(unsentData);
        console.log('Saved to unsent data queue:', record);
    } else {
        console.log('Duplicate record detected. Skipping:', record);
    }
};


/**
 * Retries writing all unsent data to Airtable.
 */
const retryUnsentData = async () => {
    const unsentData = loadUnsentData();

    for (let i = 0; i < unsentData.length; i++) {
        const record = unsentData[i];

        // Validate and normalize the record
        if (!record.Rates || !record.Time) {
            console.error('Invalid record in queue. Skipping:', record);
            continue; // Skip invalid records
        }

        const success = await writeToAirtable(record);

        if (success) {
            console.log('Successfully retried data:', record);
            unsentData.splice(i, 1); // Remove successfully sent record
            i--; // Adjust index after removal
        } else {
            console.error('Failed to retry data. Retaining in queue.');
            break; // Stop processing if Airtable is still unavailable
        }
    }
    const filteredData = unsentData.filter(record => Object.keys(record).length > 0);

    saveUnsentData(filteredData);
};


const main = async () => {
    await handleFetchAndWrite(); // Fetch and attempt to write
    await retryUnsentData(); // Retry any unsent data
};

// Schedule the main function to run every minute
setInterval(main, 60 * 1000);

// Start immediately
main();


// Export for testing
module.exports = { handleFetchAndWrite, retryUnsentData };