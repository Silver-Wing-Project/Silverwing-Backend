import yfinance as yf
from datetime import datetime, timedelta
from typing import Dict
import json

# Interface IFinanceClient:

# Method 1: get_stock_prices (accepts 3 parameters: ticker symbol, and start and end date). This method will return an array of numbers representing prices of a stock.

# Method 2: get_stock_reports (accepts 1 parameter: ticker symbol, with an optional date for past reports). This method will return a financial report of a stock and save the result into a readable file (json/csv/excel).


class IFinanceClient:
    def __init__(self):
        self.cache = {} # Simple in-memory cache for development purposes


    async def get_stock_prices(
        self, 
        ticker: str, 
        start_date: datetime, 
        end_date: datetime
    ) -> Dict:
        """
        Fetch historical stock prices for a given ticker and date range.
        Returns OHLCV data in a format ready for MongoDB storage.
        """
        try:
            stock = yf.Ticker(ticker)
            df = stock.history(start=start_date, end=end_date)

            # Convert the data to a format suitable for MongoDB
            price_data = {
                'ticker': ticker,
                'last_updated': datetime.now(),
                'prices': [{
                    'date': index.strftime('%Y-%m-%d'),
                    'open': row['Open'],
                    'high': row['High'],
                    'low': row['Low'],
                    'close': row['Close'],
                    'volume': row['Volume']
                } for index, row in df.iterrows()]
            }
            
            return price_data
        except Exception as e:
            raise Exception(f"Error fetching stock prices: {str(e)}")

    async def get_stock_reports(
        self, 
        ticker: str,
        report_type: str = 'financials'
    ) -> Dict:
        """
        Fetch financial reports for a given ticker.
        report_type can be 'financials', 'balance_sheet', or 'cash_flow'
        """
        try:
            stock = yf.Ticker(ticker)
            
            report_methods = {
                'financials': stock.financials,
                'balance_sheet': stock.balance_sheet,
                'cash_flow': stock.cashflow
            }
            
            if report_type not in report_methods:
                raise ValueError(f"Invalid report type: {report_type}")
            
            df = report_methods[report_type]
            
            # Convert the DataFrame to a dictionary format suitable for MongoDB
            report_data = {
                'ticker': ticker,
                'report_type': report_type,
                'last_updated': datetime.now(),
                'data': json.loads(df.to_json(date_format='iso'))
            }
            
            return report_data
        except Exception as e:
            raise Exception(f"Error fetching stock reports: {str(e)}")

   