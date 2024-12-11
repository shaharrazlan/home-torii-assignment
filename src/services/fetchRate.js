const axios = require('axios');


/**
 * Fetches the current Bitcoin-to-USD exchange rate.
 * @returns {Promise<{ rate: string, timestamp: string }>} The formatted rate and timestamp.
 * @throws Will throw an error if the request fails or the data is malformed.
 */
const fetchBTCExchangeRate = async () => {
    const COINDESK_API_URL = 'https://api.coindesk.com/v1/bpi/currentprice/USD.json';

    try {
        // Fetch the rate from the API
        const response = await axios.get(COINDESK_API_URL);

        // Extract and format the rate
      const Rates = response.data.bpi.USD.rate_float;
       // Get and format the UTC timestamp
       const formatToIsraelTime = (timestamp) => {
        return new Date(timestamp).toLocaleString('en-US', {
            timeZone: 'Asia/Jerusalem',
        });
    };

    const Time = formatToIsraelTime(new Date());




        console.log('first fetch:', { Rates: Rates, Time: Time })
        return  { Rates: Rates, Time: Time };
    } catch (error) {
        console.error('Error fetching BTC-to-USD rate:', error.message);
        throw error; // Rethrow to handle in the caller
    }
};

module.exports = fetchBTCExchangeRate;
