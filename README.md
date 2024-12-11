```markdown
# 🪙 Bitcoin-to-USD Tracker 🕒

A powerful Node.js application that tracks the current Bitcoin-to-USD exchange rate every minute and stores it in Airtable. Designed with resilience in mind, it queues unsent data during downtime and retries once Airtable is back online.

---

## 🚀 Features

✅ **Real-time Tracking**: Fetches Bitcoin-to-USD rates from the reliable CoinDesk API.  
✅ **Seamless Airtable Integration**: Automatically stores rates and timestamps in Airtable.  
✅ **Downtime Resilience**: Handles Airtable downtime by saving unsent data locally for retry.  
✅ **Automatic Retry**: Ensures no data is lost when Airtable becomes available again.  

---

## 🛠️ Installation

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   - Fill in your Airtable API details in `.env` file:
     ```plaintext
     AIRTABLE_API_KEY=<your-api-key>
     AIRTABLE_BASE_ID=<your-base-id>
     AIRTABLE_TABLE_NAME=<your-table-name>
     ```

---

## 📦 Project Structure

```
bitcoin-tracker/
├── src/                  # Core application files
│   ├── fetchBTCExchangeRate.js   # Fetches Bitcoin rates
│   ├── writeToAirtable.js        # Writes data to Airtable
│   ├── fileStorage.js            # Handles local data persistence
│   ├── index.js                  # Main application entry point
├── tests/                # Test scripts
│   ├── testAirtable.js
├── json/                 # Local storage for unsent records
│   ├── unsentData.json
├── .env.example          # Template for environment variables
├── .gitignore            # Files and folders to ignore in Git
├── package.json          # Project metadata and dependencies
├── README.md             # Project documentation
```

---

## 🚀 Usage

1. **Run the Application**:
   ```bash
   node src/index.js
   ```

2. **Run Tests**:
   ```bash
   node tests/testAirtable.js
   ```

---

## 📊 Example Airtable Records

| **Rates**    | **Time**                 |
|--------------|--------------------------|
| 49,263.2100  | December 11, 2024 13:45  |
| 50,127.9800  | December 11, 2024 14:45  |

---

## ⚡ Example Output

When the app runs, you'll see output like this in your console:

```plaintext
Fetched rate: { Rates: "49,263.2100", Time: "December 11, 2024, 13:45" }
Record successfully written to Airtable: { Rates: "49,263.2100", Time: "December 11, 2024, 13:45" }
```

---

## 🧪 Testing

Simulate Airtable downtime and retry functionality using the test script:
```bash
node tests/testAirtable.js
```
