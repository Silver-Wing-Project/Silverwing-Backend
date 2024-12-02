import pandas as pd
import json
import os
import sys
from datetime import datetime
from interfaces.IFinanceClient import IFinanceClient
from common.config import get_stock_prices_csv, get_dividends_csv, get_financial_report_json, get_financial_report_xlsx
from common.utils import DateTimeEncoder


class DataManager:
    def __init__(self, finance_client: IFinanceClient):
        self.finance_client = finance_client

    async def fetch_and_save_stock_prices(self, ticker, start_date, end_date):
        stock_prices = await self.finance_client.get_stock_prices(ticker, start_date, end_date)

        if isinstance(stock_prices, str):
            stock_prices = json.loads(stock_prices)

        prices_df = pd.DataFrame(stock_prices['prices'])
        prices_df.to_csv(get_stock_prices_csv(ticker), index=False)
        print(f"Stock prices saved to {get_stock_prices_csv(ticker)}")

    async def fetch_and_save_dividends(self, ticker, start_date, end_date):
        dividends = await self.finance_client.get_stock_dividends(ticker, start_date, end_date)

        if isinstance(dividends, str):
            dividends = json.loads(dividends)

        dividends_df = pd.DataFrame(dividends['dividends'])
        dividends_df.to_csv(get_dividends_csv(ticker), index=False)
        print(f"Dividends saved to {get_dividends_csv(ticker)}")


    async def fetch_and_save_financial_reports(self, ticker, report_type):
        financial_report = await self.finance_client.get_stock_reports(ticker, report_type)

        if isinstance(financial_report, str):
            financial_report = json.loads(financial_report)

        # Ensure the directory exists
        json_dir = os.path.dirname(get_financial_report_json(ticker))
        os.makedirs(json_dir, exist_ok=True)

        with open(get_financial_report_json(ticker), 'w') as json_file:
            json.dump(financial_report, json_file, indent=4, cls=DateTimeEncoder)
        print(f"Financial report saved to {get_financial_report_json(ticker)}")
        
        report_df = pd.DataFrame(financial_report['data'])
        report_df.to_excel(get_financial_report_xlsx(ticker), index=False)
        print(f"Financial report saved to {get_financial_report_xlsx(ticker)}")


async def main():

    finance_client = IFinanceClient()
    data_manager = DataManager(finance_client)

    if len(sys.argv) < 2:
        print("Usage: python data_manager.py <command> [args]")
        return

    command = sys.argv[1]

    if command == "fetch_and_save_stock_prices":
        if len(sys.argv) != 5:
            print("Usage: python data_manager.py fetch_and_save_stock_prices <ticker> <start_date> <end_date>")
            return

        ticker = sys.argv[2]
        start_date = datetime.strptime(sys.argv[3], '%Y-%m-%d')
        end_date = datetime.strptime(sys.argv[4], '%Y-%m-%d')
        await data_manager.fetch_and_save_stock_prices(ticker, start_date, end_date)

    elif command == "fetch_and_save_financial_reports":
        if len(sys.argv) != 4:
            print("Usage: python data_manager.py fetch_and_save_financial_reports <ticker> <report_type>")
            return

        ticker = sys.argv[2]
        report_type = sys.argv[3]
        await data_manager.fetch_and_save_financial_reports(ticker, report_type)

    else:
        print(f"Unknown command: {command}")

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())