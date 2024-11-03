import asyncio
from datetime import datetime, timedelta, timezone
from interfaces.IDisplayData import IDisplayData
from interfaces.IFinanceClient import IFinanceClient
from finance_data_manager import FinanceDataManager
from finance_data_plotter import FinanceDataPlotter
from config import TICKER

async def main():
    start_date = datetime.now(timezone.utc) - timedelta(days=(365*5))
    end_date = datetime.now(timezone.utc)

    finance_client = IFinanceClient()
    display_data = IDisplayData()

    data_manager = FinanceDataManager(finance_client)
    plotter = FinanceDataPlotter(display_data)

    # await data_manager.fetch_and_save_stock_prices(TICKER, start_date, end_date)
    await plotter.plot_stock_prices(TICKER, start_date, end_date)

    # await data_manager.fetch_and_save_dividends(TICKER, start_date, end_date)
    await plotter.plot_dividends(TICKER, start_date, end_date)

if __name__ == "__main__":
    asyncio.run(main())