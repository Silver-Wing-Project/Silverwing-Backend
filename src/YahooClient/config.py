import os

TICKER = 'MSFT'
BASE_DIR = os.path.dirname(__file__)
STOCK_PRICES_CSV = os.path.join(BASE_DIR, f'{TICKER}_stock_prices.csv')
DIVIDENDS_CSV = os.path.join(BASE_DIR, f'{TICKER}_dividends.csv')