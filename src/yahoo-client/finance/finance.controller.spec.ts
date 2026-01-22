import { Test, TestingModule } from '@nestjs/testing';
import { FinanceController } from './finance.controller';
import { StockPriceService } from '@/future/stock-price/stock-price.service';
import { StockReportService } from '@stock/stock-report/stock-report.service';
import { PythonService } from '@utility/ts-services/python.service';

describe('FinanceController', () => {
  let controller: FinanceController;
  let pythonService: PythonService;
  let stockPriceService: StockPriceService;
  let stockReportService: StockReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinanceController],
      providers: [
        {
          provide: PythonService,
          useValue: { fetchStockData: jest.fn(), fetchStockReports: jest.fn() },
        },
        {
          provide: StockPriceService,
          useValue: {
            findManyStockPrices: jest.fn(),
            createManyStockPrices: jest.fn(),
          },
        },
        {
          provide: StockReportService,
          useValue: {
            findManyStockReports: jest.fn(),
            createManyStockReports: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FinanceController>(FinanceController);
    pythonService = module.get<PythonService>(PythonService);
    stockPriceService = module.get<StockPriceService>(StockPriceService);
    stockReportService = module.get<StockReportService>(StockReportService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have pythonService defined', () => {
    expect(pythonService).toBeDefined();
  });

  it('should have stockPriceService defined', () => {
    expect(stockPriceService).toBeDefined();
  });

  it('should have stockReportService defined', () => {
    expect(stockReportService).toBeDefined();
  });
});
