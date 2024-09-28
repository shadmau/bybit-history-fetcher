# Bybit History Fetcher

This is a data fetcher for Bybit, currently fetching historical market data (klines) and saving it to a JSON file. The script uses the Bybit API and is written in TypeScript. In the future, it may also support fetching other types of data, such as trades.

## Features

- Fetch historical market data (klines) for specified symbols and intervals.
- Modular design for ease of use and future extensions.
- Handles pagination for large data sets.
- Stores results in a JSON file.
- Configurable API endpoint using environment variables.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository.
2. Install the dependencies.
3. Set up environment variables: Create a `.env` file in the root directory and add the following:

   `BYBIT_API_URL=https://api.bybit.com/v5/market/kline`

## Usage

Run the script using:

`npm run start`

The script will fetch historical klines for the specified symbol, interval, and category, and save them to `klines.json`.

### Example

Here's an example of how to fetch historical data for the symbol **BTCUSDT**, on a 1-minute interval, starting from a specific timestamp:

`fetchKlines('BTCUSDT', Interval.OneMinute, 1727292039000, Category.Spot);`

### Parameters

- **symbol**: The trading pair (e.g., BTCUSDT).
- **interval**: The interval between klines. Available options:
  - 1 (1 minute)
  - 3 (3 minutes)
  - 5 (5 minutes)
  - 15 (15 minutes)
  - 30 (30 minutes)
  - 60 (60 minutes)
  - 120 (120 minutes)
  - 240 (240 minutes)
  - 360 (360 minutes)
  - 720 (720 minutes)
  - D (daily)
  - W (weekly)
  - M (monthly)
- **startTimestamp**: The starting timestamp in milliseconds.
- **category**: The market category. Available options:
  - spot
  - linear
  - inverse
- **outputFile**: (Optional) The filename to save the fetched data. Default is `klines.json`.

### Important Note

Bybit's API returns the klines in **descending order**, meaning that the newest kline will be at index `[0]` in the response array. This is different from the usual assumption where `[0]` would be the oldest entry, so keep this in mind when processing the data.

## License

This project is open-source and available under the MIT License.