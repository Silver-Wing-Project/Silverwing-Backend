import { StockReport } from '../../entities/stock-report.schema';

export const assertStockReport = (actual: StockReport, expected: StockReport) => {
  expect(actual).toMatchObject({
    _id: expect.any(String),
    ticker: expected.ticker,
    date: expected.date,
    reportType: expected.reportType,
    content: expected.content,
  });
};

export const assertStockReports = (actual: StockReport[], expected: StockReport[]) => {
  expect(actual).toHaveLength(expected.length);
  actual.forEach((item, index) => assertStockReport(item, expected[index]));
};
