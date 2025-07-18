import yfinance as yf
from datetime import datetime, timedelta
from typing import Dict
import json
import os
import sys
import traceback

# Add the parent directory to the sys.path to resolve the common module
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from common.utils import DateTimeEncoder

class DataFetcher:
    """
    DataFetcher is a class that fetches financial data such as stock prices,
    financial reports, and dividends from Yahoo Finance using the yfinance library.
    It is used by the IFinanceClient interface to fetch data.
    """

    @staticmethod
    async def fetch_stock_prices(ticker: str, start_date: datetime, end_date: datetime) -> str:
        """
        Fetch stock prices for a given ticker.
        Returns OHLCV data in a dictionary format.
        """
        try:
            stock = yf.Ticker(ticker)
            adjusted_end_date = end_date + timedelta(days=1)
            df = stock.history(start=start_date, end=adjusted_end_date)

            if df.empty:
                error_message = json.dumps({'error': f"No price data found for ticker '{ticker}' in the given date range."})
                print(error_message)
                sys.exit(1)

            # Convert the data to a format suitable for MongoDB
            price_data = [{
                'ticker': ticker,
                'date': index.strftime('%Y-%m-%d'),
                'open': row['Open'],
                'high': row['High'],
                'low': row['Low'],
                'close': row['Close'],
                'volume': row['Volume']
            } for index, row in df.iterrows()]
            
            # Convert the dictionary to a JSON string
            prices_data_json = json.dumps(price_data, cls=DateTimeEncoder)
            return prices_data_json
        except Exception as e:
            error_message = json.dumps({
                'error': f"Unexpected error: {str(e)}",
                'traceback': traceback.format_exc()
            })
            print(error_message)
            sys.exit(1)

    
    @staticmethod
    async def fetch_stock_reports(ticker: str, report_type: str) -> str:
        """
        Fetch financial reports for a given ticker.
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
            
        # Convert the DataFrame to a list of dictionaries format suitable for MongoDB
            report_data = {
                'ticker': ticker,
                'date': datetime.now().isoformat(),
                'report_type': report_type,
                'content': json.loads(df.to_json(date_format='iso'))
            }
            
            reports_json_data = json.dumps(report_data, cls=DateTimeEncoder)
            return reports_json_data
        except Exception as e:
            error_message = json.dumps({'error': str(e)})
            print(error_message)
            return error_message


    @staticmethod
    async def fetch_stock_dividends(ticker: str, start_date: datetime, end_date: datetime) -> str:
        """
        Fetch stock dividends for a given ticker.
        Returns dividends data in a dictionary format.
        """
        try:
            stock = yf.Ticker(ticker)
            df = stock.dividends
            df = df[(df.index >= start_date) & (df.index <= end_date)]
            dividends_data = {
                'ticker': ticker,
                'last_updated': datetime.now(),
                'dividends': [{
                    'date': index.strftime('%Y-%m-%d'),
                    'dividend': row
                } for index, row in df.items()]
            }
            result = json.dumps(dividends_data, cls=DateTimeEncoder, indent=4)
            return result
        except Exception as e:
            error_message = json.dumps({'error': str(e)})
            print(error_message)
            return error_message