import json
import os
import sys
from datetime import datetime
from interfaces.IFinanceClient import IFinanceClient
from common.utils import DateTimeEncoder

class DataManager:
    def __init__(self, finance_client: IFinanceClient):
        self.finance_client = finance_client

    async def fetch_stock_prices(self, ticker, start_date, end_date):
        stock_prices = await self.finance_client.get_stock_prices(ticker, start_date, end_date)
        return stock_prices

    async def fetch_financial_reports(self, ticker, report_type):
        financial_report = await self.finance_client.get_stock_reports(ticker, report_type)
        return financial_report

async def main():
    finance_client = IFinanceClient()
    data_manager = DataManager(finance_client)

    if len(sys.argv) < 2:
        print("Usage: python data_manager.py <command> [args]")
        return

    command = sys.argv[1]

    if command == "fetch_stock_prices":
        if len(sys.argv) != 5:
            print("Usage: python data_manager.py fetch_stock_prices <ticker> <start_date> <end_date>")
            return

        ticker = sys.argv[2]
        start_date = datetime.strptime(sys.argv[3], '%Y-%m-%d')
        end_date = datetime.strptime(sys.argv[4], '%Y-%m-%d')
        result = await data_manager.fetch_stock_prices(ticker, start_date, end_date)
        print(json.dumps(result, cls=DateTimeEncoder))

    elif command == "fetch_financial_reports":
        if len(sys.argv) != 4:
            print("Usage: python data_manager.py fetch_financial_reports <ticker> <report_type>")
            return

        ticker = sys.argv[2]
        report_type = sys.argv[3]
        result = await data_manager.fetch_financial_reports(ticker, report_type)
        print(json.dumps(result, cls=DateTimeEncoder))

    else:
        print(f"Unknown command: {command}")

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())