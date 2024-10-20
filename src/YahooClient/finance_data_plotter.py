import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime
from interfaces.IDisplayData import IDisplayData
from config import STOCK_PRICES_CSV, DIVIDENDS_CSV

class FinanceDataPlotter:
    def __init__(self, display_data: IDisplayData):
        self.display_data = display_data

    async def plot_stock_prices(self, ticker, start_date, end_date):
        await self.display_data.plot_stock_price(ticker, STOCK_PRICES_CSV, start_date, end_date, plot_type='line')

    async def plot_dividends(self, ticker, start_date, end_date):
        await self.display_data.plot_dividends(ticker, DIVIDENDS_CSV, start_date, end_date)