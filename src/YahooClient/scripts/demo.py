import sys
import os
import asyncio

sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'YahooClient'))

from interfaces.IDisplayData import IDisplayData
from interfaces.IFinanceClient import IFinanceClient
from scripts.data_manager import DataManager
from scripts.data_plotter import DataPlotter
from datetime import datetime, timedelta, timezone
from common.config import TICKER

async def main():
    start_date = datetime.now(timezone.utc) - timedelta(days=(365*5))
    end_date = datetime.now(timezone.utc)

    finance_client = IFinanceClient()
    display_data = IDisplayData()

    data_manager = DataManager(finance_client)
    plotter = DataPlotter(display_data)

    # await data_manager.fetch_and_save_stock_prices(TICKER, start_date, end_date)
    # await plotter.plot_stock_prices(TICKER, start_date, end_date)

    # await data_manager.fetch_and_save_dividends(TICKER, start_date, end_date)
    # await plotter.plot_dividends(TICKER, start_date, end_date)


    await data_manager.fetch_and_save_stock_reports(TICKER, 'financials')


if __name__ == "__main__":
    asyncio.run(main())