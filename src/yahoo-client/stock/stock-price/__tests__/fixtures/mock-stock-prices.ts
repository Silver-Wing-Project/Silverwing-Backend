import { StockPrice } from '../../entities/stock-price.schema';
import { parseDate } from '../../../../utility/date-parser/date-parser.utils';
import { CreateStockPriceDto } from '../../dto/create-stock-price.dto';
import { UpdateStockPriceDto } from '../../dto/update-stock-price.dto';

export const baseMockStockPrice: CreateStockPriceDto = {
  _id: '507f1f77bcf86cd799439016',
  ticker: 'AAPL',
  date: parseDate('2025-01-01'),
  open: 100,
  close: 110,
  high: 120,
  low: 90,
  volume: 1000000,
};

export const updateMockStockPrice: UpdateStockPriceDto = {
  _id: baseMockStockPrice._id,
  ticker: baseMockStockPrice.ticker,
  date: baseMockStockPrice.date,
  open: 200,
  close: 210,
  high: 220,
  low: 190,
  volume: 2000000,
};

export const generateMockStockPrices = (count: number): StockPrice[] =>
  Array.from({ length: count }, (_, i) => ({
    ...baseMockStockPrice,
    _id: `507f1f77bcf86cd7994390${16 + i}`,
    date: parseDate(`2025-01-${i + 1}`),
  }));
