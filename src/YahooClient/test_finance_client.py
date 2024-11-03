import pytest
from unittest.mock import AsyncMock, patch
from interfaces.IFinanceClient import IFinanceClient

@pytest.mark.asyncio
@patch('interfaces.data_fetcher.DataFetcher.fetch_stock_prices', new_callable=AsyncMock)
async def test_get_stock_prices(mock_fetch):
    mock_fetch.return_value = {'ticker': 'AAPL', 'prices': []}
    client = IFinanceClient()
    result = await client.get_stock_prices('AAPL', '2021-01-01', '2021-01-31')
    assert result['ticker'] == 'AAPL'

@pytest.mark.asyncio
@patch('interfaces.data_fetcher.DataFetcher.fetch_stock_prices', new_callable=AsyncMock)
async def test_get_stock_prices_with_prices(mock_fetch):
    mock_fetch.return_value = {'ticker': 'AAPL', 'prices': [{'date': '2021-01-01', 'price': 130.0}]}
    client = IFinanceClient()
    result = await client.get_stock_prices('AAPL', '2021-01-01', '2021-01-31')
    assert result['ticker'] == 'AAPL'
    assert len(result['prices']) == 1
    assert result['prices'][0]['price'] == 130.0

@pytest.mark.asyncio
@patch('interfaces.data_fetcher.DataFetcher.fetch_stock_prices', new_callable=AsyncMock)
async def test_get_stock_prices_invalid_ticker(mock_fetch):
    mock_fetch.return_value = {'ticker': 'INVALID', 'prices': []}
    client = IFinanceClient()
    result = await client.get_stock_prices('INVALID', '2021-01-01', '2021-01-31')
    assert result['ticker'] == 'INVALID'
    assert len(result['prices']) == 0

@pytest.mark.asyncio
@patch('interfaces.data_fetcher.DataFetcher.fetch_stock_prices', new_callable=AsyncMock)
async def test_get_stock_prices_no_data(mock_fetch):
    mock_fetch.return_value = {'ticker': 'AAPL', 'prices': None}
    client = IFinanceClient()
    result = await client.get_stock_prices('AAPL', '2021-01-01', '2021-01-31')
    assert result['ticker'] == 'AAPL'
    assert result['prices'] is None

@pytest.mark.asyncio
@patch('interfaces.data_fetcher.DataFetcher.fetch_stock_reports', new_callable=AsyncMock)
async def test_get_stock_reports(mock_fetch):
    mock_fetch.return_value = {'ticker': 'AAPL', 'reports': []}
    client = IFinanceClient()
    result = await client.get_stock_reports('AAPL', 'financials')
    assert result['ticker'] == 'AAPL'
    assert result['reports'] == []

@pytest.mark.asyncio
@patch('interfaces.data_fetcher.DataFetcher.fetch_stock_dividends', new_callable=AsyncMock)
async def test_get_stock_dividends(mock_fetch):
    mock_fetch.return_value = {'ticker': 'AAPL', 'dividends': []}
    client = IFinanceClient()
    result = await client.get_stock_dividends('AAPL', '2021-01-01', '2021-01-31')
    assert result['ticker'] == 'AAPL'
    assert result['dividends'] == []
    