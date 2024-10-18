import yfinance as yf
from datetime import datetime
from typing import Dict
import json

class DataFetcher:
    """
    DataFetcher is a class that fetches financial data such as stock prices,
    financial reports, and dividends from Yahoo Finance using the yfinance library.
    It is used by the IFinanceClient interface to fetch data.
    """

    @staticmethod
    async def fetch_stock_prices(
        ticker: str,
        start_date: datetime,
        end_date: datetime
    ) -> Dict:
        """
        Fetch stock prices for a given ticker.
        Returns OHLCV data in a dictionary format.
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

    
    @staticmethod
    async def fetch_stock_reports(
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


    @staticmethod
    async def fetch_stock_dividends(
        ticker: str,
        start_date: datetime,
        end_date: datetime
    ) -> Dict:
        """
        Fetch stock dividends for a given ticker.
        Returns dividends data in a dictionary format.
        """
        try:
            stock = yf.Ticker(ticker)
            df = stock.dividends

            # Filter dividends data by date range
            df = df[(df.index >= start_date) & (df.index <= end_date)]
            
            return {
                'ticker': ticker,
                'last_updated': datetime.now(),
                'dividends': [{
                    'date': index.strftime('%Y-%m-%d'),
                    'dividend': row
                } for index, row in df.items()]
            }
        except Exception as e:
            raise Exception(f"Error fetching stock dividends: {str(e)}")