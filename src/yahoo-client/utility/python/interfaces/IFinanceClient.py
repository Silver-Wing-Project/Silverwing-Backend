from interfaces.data_fetcher import DataFetcher
from datetime import datetime
from typing import Dict
import json

class IFinanceClient:
    """
    IFinanceClient is an interface that defines methods for fetching financial data,
    such as stock prices, financial reports, and dividends. It uses DataFetcher to
    fetch data from Yahoo Finance. It is used by the IDisplayData interface to display data.    
    """


    async def get_stock_prices(self, ticker: str, start_date: datetime, end_date: datetime ) -> Dict:
        """
        Fetches historical stock prices for a given ticker symbol and date range.
        
        Args:
            ticker (str): The ticker symbol of the stock.
            start_date (datetime): The start date for the historical data.
            end_date (datetime): The end date for the historical data.
        
        Returns:
            Dict: A dictionary containing historical stock prices.
        """
        result = json.loads(await DataFetcher.fetch_stock_prices(ticker, start_date, end_date))
        # print("IFinanceClient: result of DataFetcher.fetch_stock_prices - ", json.dumps(result, indent=4))
        return result
        
    async def get_stock_reports(self, ticker: str, report_type: str) -> Dict:
        """
        Fetches financial reports for a given ticker symbol.
        
        Args:
            ticker (str): The ticker symbol of the stock.
            report_type (str): The type of report to fetch (default is 'financials').
        
        Returns:
            Dict: A dictionary containing financial reports.
        """
        result = json.loads(await DataFetcher.fetch_stock_reports(ticker, report_type))
        # print("IFinanceClient: result of DataFetcher.fetch_stock_reports - ", json.dumps(result, indent=4))
        return result

    async def get_stock_dividends( self, ticker: str, start_date: datetime, end_date: datetime ) -> Dict:
        """
        Fetches stock dividends for a given ticker symbol and date range.
        
        Args:
            ticker (str): The ticker symbol of the stock.
            start_date (datetime): The start date for the dividend data.
            end_date (datetime): The end date for the dividend data.
        
        Returns:
            Dict: A dictionary containing stock dividends.
        """
        return await DataFetcher.fetch_stock_dividends(ticker, start_date, end_date)