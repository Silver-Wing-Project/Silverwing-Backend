import os

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'data'))

if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

print("DATA_DIR - ", DATA_DIR)

def get_stock_prices_csv(ticker):
    return os.path.join(DATA_DIR, f'{ticker}_stock_prices.csv')

def get_dividends_csv(ticker):
    return os.path.join(DATA_DIR, f'{ticker}_dividends.csv')

def get_financial_report_json(ticker):
    return os.path.join(DATA_DIR, f'{ticker}_financial_report.json')

def get_financial_report_xlsx(ticker):
    return os.path.join(DATA_DIR, f'{ticker}_financial_report.xlsx')