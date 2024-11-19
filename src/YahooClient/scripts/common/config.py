import os

TICKER = 'GOOG'
BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.abspath(os.path.join(BASE_DIR, '..', '..', 'data'))

# Ensure the data directory exists
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

print("DATA_DIR - ", DATA_DIR)
STOCK_PRICES_CSV = os.path.join(DATA_DIR, f'{TICKER}_stock_prices.csv')
DIVIDENDS_CSV = os.path.join(DATA_DIR, f'{TICKER}_dividends.csv')
FINANCIAL_REPORT_JSON = os.path.join(DATA_DIR, f'{TICKER}_financial_report.json')
FINANCIAL_REPORT_XLSX = os.path.join(DATA_DIR, f'{TICKER}_financial_report.xlsx')