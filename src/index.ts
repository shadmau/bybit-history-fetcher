import axios from 'axios';
import * as fs from 'fs';

enum Category {
    Spot = 'spot',
    Linear = 'linear',
    Inverse = 'inverse'
}

enum Interval {
    OneMinute = '1',
    ThreeMinutes = '3',
    FiveMinutes = '5',
    FifteenMinutes = '15',
    ThirtyMinutes = '30',
    SixtyMinutes = '60',
    OneHundredTwentyMinutes = '120',
    TwoHundredFortyMinutes = '240',
    ThreeHundredSixtyMinutes = '360',
    SevenHundredTwentyMinutes = '720',
    Day = 'D',
    Month = 'M',
    Week = 'W'
}

function isValidTimestamp(timestamp: number): boolean {
    if (isNaN(timestamp) || timestamp <= 0) {
        return false;
    }
    if (timestamp < 1_000_000_000) {
        return false
    }

    return true
}
const LIMIT = 1000; // Has to be 1, 200 or 1000

async function fetchKlines(symbol: string, interval: Interval, startTimestamp: number, category: Category, outputFile: string = 'klines.json') {

    if (!isValidTimestamp(startTimestamp)) {
        throw new Error('Invalid start timestamp. It must be a valid timestamp in milliseconds.');
    }

    const endTimestamp = Date.now(); // Current time in milliseconds
    const allKlines: any[] = [];

    while (startTimestamp < endTimestamp) {
        const url = process.env.BYBIT_API_URL || 'https://api.bybit.com/v5/market/kline';
        const params = {
            symbol: symbol,
            interval: interval,
            start: startTimestamp,
            category: category,
            limit: LIMIT
        };

        console.log(`Sending request to ${url} with params:`, params);

        try {
            const response = await axios.get(url, { params });
            console.log(`Received response for ${symbol} at ${new Date().toISOString()}`);

            const result = response.data.result;

            if (result && result.list && result.list.length > 0) {
                allKlines.unshift(...handleKlines(result.list, allKlines));

                if (result.list.length + 1  < LIMIT) {
                    break;
                }

                startTimestamp = parseInt(result.list[0][0]) + 1;
            } else {
                console.error('No result list found, exiting loop');
                break;
            }
        } catch (error: any) {
            handleAxiosError(error);
            break;
        }
    }

    writeToFile(allKlines, symbol, category, outputFile);
}

function handleKlines(newKlines: any[], allKlines: any[]): any[] {
    const firstExistingKline = allKlines.length > 0 ? allKlines[0] : null;
    const lastNewKline = newKlines[newKlines.length - 1];

    if (firstExistingKline && lastNewKline[0] === firstExistingKline[0]) {
        newKlines.pop(); // Remove duplicate
    }

    return newKlines;
}

function handleAxiosError(error: any): void {
    if (error.response) {
        console.error(`API responded with ${error.response.status}: ${error.response.data}`);
    } else if (error.request) {
        console.error('No response received from API:', error.request);
    } else {
        console.error('Error in request setup:', error.message);
    }
}

function writeToFile(data: any[], symbol: string, category: string, outputFile: string): void {
    const finalOutput = {
        symbol,
        category,
        list: data
    };

    fs.writeFileSync(outputFile, JSON.stringify(finalOutput, null, 2));
    console.log(`Data written to ${outputFile}. Total results fetched: ${data.length}`);
}


fetchKlines('BTCUSDT', Interval.OneMinute, 1727292039000, Category.Linear);