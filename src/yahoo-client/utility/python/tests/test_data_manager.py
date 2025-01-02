import unittest
from unittest.mock import AsyncMock, patch
from datetime import datetime
import json
from data_manager import DataManager
from interfaces.IFinanceClient import IFinanceClient
from common.utils import DateTimeEncoder

class TestDataManager(unittest.TestCase):
    def setUp(self):
        self.finance_client = AsyncMock(spec=IFinanceClient)
        self.data_manager = DataManager(self.finance_client)

    @patch('data_manager.DateTimeEncoder', DateTimeEncoder)
    def test_fetch_stock_prices(self):
        ticker = "AAPL"
        start_date = datetime(2021, 1, 1)
        end_date = datetime(2021, 1, 31)
        expected_result = [{"date": "2021-01-01", "price": 150}]
        self.finance_client.get_stock_prices.return_value = expected_result

        result = self.data_manager.fetch_stock_prices(ticker, start_date, end_date)
        self.assertEqual(result, expected_result)
        self.finance_client.get_stock_prices.assert_called_once_with(ticker, start_date, end_date)

    @patch('data_manager.DateTimeEncoder', DateTimeEncoder)
    def test_fetch_financial_reports(self):
        ticker = "AAPL"
        report_type = "annual"
        expected_result = {"report": "financial data"}
        self.finance_client.get_stock_reports.return_value = expected_result

        result = self.data_manager.fetch_financial_reports(ticker, report_type)
        self.assertEqual(result, expected_result)
        self.finance_client.get_stock_reports.assert_called_once_with(ticker, report_type)

if __name__ == "__main__":
    unittest.main()