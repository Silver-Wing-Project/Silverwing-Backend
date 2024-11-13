import pandas as pd
import json
import os
from datetime import datetime
from interfaces.IFinanceClient import IFinanceClient
from common.config import STOCK_PRICES_CSV, DIVIDENDS_CSV
from common.utils import DateTimeEncoder

class DateTimeEncoder(json.JSONEncoder):

    def default(self, obj):

        if isinstance(obj, datetime):

            return obj.isoformat()

        return super().default(obj)

class DataManager:

    def __init__(self, finance_client: IFinanceClient):

        self.finance_client = finance_client


    async def fetch_and_save_stock_prices(self, ticker, start_date, end_date):

        stock_prices = await self.finance_client.get_stock_prices(ticker, start_date, end_date)

        print("Stock Prices fetched successfully")
        

        if isinstance(stock_prices, str):

            stock_prices = json.loads(stock_prices)


        prices_df = pd.DataFrame(stock_prices['prices'])


        prices_df.to_csv(STOCK_PRICES_CSV, index=False)

        print(f"Stock prices saved to {STOCK_PRICES_CSV}")



    async def fetch_and_save_dividends(self, ticker, start_date, end_date):

        dividends = await self.finance_client.get_stock_dividends(ticker, start_date, end_date)

        print("Dividends fetched successfully.")


        if isinstance(dividends, str):

            dividends = json.loads(dividends)


        dividends_df = pd.DataFrame(dividends['dividends'])


        dividends_df.to_csv(DIVIDENDS_CSV, index=False)

        print(f"Dividends saved to {DIVIDENDS_CSV}")


    async def fetch_and_save_financial_reports(self, ticker):

        financial_report = await self.finance_client.get_stock_reports(ticker, 'financials')

        print("Financial Report fetched successfully.")
        

        if isinstance(financial_report, str):

            financial_report = json.loads(financial_report)


        json_path = os.path.join(os.path.dirname(__file__), f'{ticker}_financial_report.json')

        xlsx_path = os.path.join(os.path.dirname(__file__), f'{ticker}_financial_report.xlsx')
        

        # Ensure the directory exists

        json_dir = os.path.dirname(json_path)

        print(f"Ensuring directory exists: {json_dir}")

        os.makedirs(json_dir, exist_ok=True)
        

        with open(os.path.join(os.path.dirname(__file__), f'{ticker}_financial_report.json'), 'w') as json_file:

            json.dump(financial_report, json_file, indent=4, cls=DateTimeEncoder)

        print(f"Financial report saved to {ticker}_financial_report.json")
        

        report_df = pd.DataFrame(financial_report)

        report_df.to_excel(os.path.join(os.path.dirname(__file__), f'{ticker}_financial_report.xlsx'), index=False)

        print(f"Financial report saved to {ticker}_financial_report.xlsx")