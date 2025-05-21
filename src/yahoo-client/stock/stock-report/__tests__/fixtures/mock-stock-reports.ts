import { StockReport } from '../../entities/stock-report.schema';
import { parseDate } from '../../../../utility/date-parser/date-parser.utils';
import { CreateStockReportDto } from '../../dto/create-stock-report.dto';
import { UpdateStockReportDto } from '../../dto/update-stock-report.dto';

export const baseMockStockReport: CreateStockReportDto = {
  _id: '507f1f77bcf86cd799439016',
  ticker: 'AAPL',
  date: parseDate('2025-01-01'),
  reportType: 'stock-price',
  content: {
    'Tax Effect Of Unusual Items': 0,
    'Tax Rate For Calcs': 0.12,
    'Total Unusual Items': 0,
  },
};

export const updateMockStockReport: UpdateStockReportDto = {
  _id: baseMockStockReport._id,
  ticker: baseMockStockReport.ticker,
  date: baseMockStockReport.date,
  reportType: baseMockStockReport.reportType,
  content: {
    ...baseMockStockReport.content,
    'Tax Rate For Calcs': baseMockStockReport.content['Tax Rate For Calcs'] + 0.01,
  },
};

export const generateMockStockReports = (count: number): StockReport[] =>
  Array.from({ length: count }, (_, i) => ({
    ...baseMockStockReport,
    _id: `507f1f77bcf86cd7994390${16 + i}`,
    date: parseDate(`2025-01-${i + 1}`),
  }));
