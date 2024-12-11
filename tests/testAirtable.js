const nock = require('nock');
const { handleFetchAndWrite, retryUnsentData } = require('../src/index');
const { loadUnsentData, saveUnsentData } = require('../src/services/fileStorage');
const fs = require('fs');
const path = require('path');

// File path for unsent data
const unsentDataPath = path.join(__dirname, '../json/unsentData.json');

// Utility to clear and reset the unsentData.json file
const resetUnsentData = () => {
    fs.writeFileSync(unsentDataPath, JSON.stringify([], null, 2));
};

// Mock Airtable API
const mockAirtable = () => {
    const airtableBaseUrl = 'https://api.airtable.com';

    // Simulate Airtable server failure
    nock(airtableBaseUrl)
        .post(/.*/)
        .reply(500, { error: 'Airtable is temporarily unavailable' })
        .persist();

    // Restore Airtable after 2 minutes
    setTimeout(() => {
        nock.cleanAll();
        nock(airtableBaseUrl)
            .post(/.*/)
            .reply(200, (uri, requestBody) => {
                console.log('Data sent to Airtable:', requestBody.fields);
                return { id: 'rec123', fields: requestBody.fields };
            })
            .persist();
        console.log('Airtable server is back up.');
    }, 1 * 60 * 1000); // 2 minutes
};

// Test handling fetch and write behavior
const testHandleFetchAndWrite = async () => {
    resetUnsentData();
    mockAirtable();

    console.log('Testing handleFetchAndWrite...');
    await handleFetchAndWrite();

    // Check the unsent queue after a failure
    setTimeout(() => {
        const unsentData = loadUnsentData();
        console.log('Unsent Data Queue:', unsentData);
    }, 30 * 1000);
};

// Test retry logic
const testRetryUnsentData = async () => {
    console.log('Testing retryUnsentData...');
    await retryUnsentData();

    // Check the unsent queue after retries
    setTimeout(() => {
        const unsentData = loadUnsentData();
        console.log('Unsent Data Queue after retry:', unsentData);
    }, 30 * 1000);
};

// Start tests
const testMain = async () => {
    await testHandleFetchAndWrite();
    setTimeout(testRetryUnsentData, 1 * 60 * 1000); // Test retry after Airtable is back
};

testMain();
