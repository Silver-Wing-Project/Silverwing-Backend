from datetime import datetime, timedelta
import io
import pandas as pd
import matplotlib.pyplot as plt
from interfaces.IFinanceClient import IFinanceClient

# Interface IDisplayData:

# Method 1: plot_stock_price (accepts 4 parameters: stock name, start date, end date, and plot type).
# This method will generate a plot of stock prices using matplotlib.

# Method 2: plot_dividends(accepts 3 parameters: stock name, start date, and end date).
# This method will generate a plot of dividends using matplotlib.

class IDisplayData:
    def __init__(self):
        # self.cache = {} # Simple in-memory cache for development purposes
        self.finance_client = IFinanceClient()

    # Set the style for the plots
    plt.style.use('seaborn-v0_8')

    async def plot_stock_price(
        self,
        ticker: str,
        csv_file_path: str,
        start_date: datetime,
        end_date: datetime,
        plot_type: str = 'line'
    ) :
        """
        Generate a plot of stock prices using matplotlib.
        Returns the plot as bytes that can be saved or served.
        """

        try:
            # Read the CSV file
            df = pd.read_csv(csv_file_path, parse_dates=['date'])
            
            # Convert start_date and end_date to timezone-naive
            start_date = start_date.replace(tzinfo=None)
            end_date = end_date.replace(tzinfo=None)

            # Ensure the DataFrame's date column is timezone-naive
            df['date'] = df['date'].dt.tz_localize(None)

            # Filter the data by date range
            df = df[(df['date'] >= start_date) & (df['date'] <= end_date)]
            
            plt.figure(figsize=(12, 6))
            if plot_type == 'candlestick':
                # Implementation for candlestick chart
                pass
            else:
                plt.plot(df['date'], df['close'], label='Close Price')
            
            plt.title(f'{ticker} Stock Price History')
            plt.xlabel('Date')
            plt.ylabel('Stock Price ($)')
            plt.legend()
            plt.show()
        except Exception as e:
            raise Exception(f"Error generating stock price plot: {str(e)}")            


    async def plot_dividends(
        self,
        ticker: str,
        csv_file_path: str,
        start_date: datetime,
        end_date: datetime
    ) :
        """
        Generate a plot of dividends using matplotlib.
        Returns the plot as bytes that can be saved or served.
        """

        try:
            dividend_data = await self.finance_client.get_stock_dividends(ticker, start_date, end_date)
            df = pd.DataFrame(dividend_data['dividends'])

            # Convert start_date and end_date to timezone-naive
            start_date = start_date.replace(tzinfo=None)
            end_date = end_date.replace(tzinfo=None)

            # Ensure the DataFrame's date column is timezone-naive
            df['date'] = pd.to_datetime(df['date']).dt.tz_localize(None)

            # Filter dividends data by date range
            df = df[(df['date'] >= start_date) & (df['date'] <= end_date)]

            data = df.resample('YE', on='date').sum().reset_index()
            data['Year'] = data['date'].dt.year
            
            plt.figure(figsize=(12, 6))
            plt.bar(data['Year'], data['dividend'])
            plt.ylabel('Dividends Yield ($)')
            plt.xlabel('Year')
            plt.title(f'{ticker} Dividend History')
            plt.xlim(start_date.year, end_date.year)
            plt.show()
        except Exception as e:
            raise Exception(f"Error generating dividends plot: {str(e)}")