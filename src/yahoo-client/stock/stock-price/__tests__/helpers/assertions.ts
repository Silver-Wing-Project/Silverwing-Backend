import { StockPrice } from '@stock-price/entities/stock-price.schema';

export const assertStockPrice = (actual: StockPrice, expected: StockPrice) => {
  expect(actual).toMatchObject({
    _id: expect.any(String),
    ticker: expected.ticker,
    date: expected.date,
    open: expected.open,
    close: expected.close,
    high: expected.high,
    low: expected.low,
    volume: expected.volume,
  });
};

export const assertStockPrices = (actual: StockPrice[], expected: StockPrice[]) => {
  expect(actual).toHaveLength(expected.length);
  actual.forEach((item, index) => assertStockPrice(item, expected[index]));
};
