import { Test, TestingModule } from '@nestjs/testing';
import { PythonService } from './python.service';
import { PythonExecutorService } from '../python-executor/python-executor.service';

describe('PythonService', () => {
  let service: PythonService;
  let pythonExecutorService: PythonExecutorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PythonService,
        {
          provide: PythonExecutorService,
          useValue: {
            runPythonScript: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PythonService>(PythonService);
    pythonExecutorService = module.get<PythonExecutorService>(PythonExecutorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch stock data', async () => {
    const mockData = JSON.stringify([{ ticker: 'AAPL', date: '2023-01-01', open: 150, close: 155 }]);
    jest.spyOn(pythonExecutorService, 'runPythonScript').mockResolvedValue(mockData);

    const result = await service.fetchStockData('AAPL', '2023-01-01', '2023-01-31');
    expect(result).toEqual([{ ticker: 'AAPL', date: '2023-01-01', open: 150, close: 155 }]);
  });

  it('should fetch stock reports', async () => {
    const mockData = JSON.stringify([
      {
        ticker: 'AAPL',
        date: '2023-01-01',
        reportType: 'annual',
        content: '{}',
      },
    ]);
    jest.spyOn(pythonExecutorService, 'runPythonScript').mockResolvedValue(mockData);

    const result = await service.fetchStockReports('AAPL', 'financials');
    expect(result).toEqual([
      {
        ticker: 'AAPL',
        date: '2023-01-01',
        reportType: 'annual',
        content: '{}',
      },
    ]);
  });

  it('should handle errors when fetching stock data', async () => {
    jest.spyOn(pythonExecutorService, 'runPythonScript').mockRejectedValue(new Error('Failed to fetch stock data'));

    await expect(service.fetchStockData('AAPL', '2023-01-01', '2023-01-31')).rejects.toThrow(
      'Failed to fetch stock data',
    );
  });

  it('should handle errors when fetching stock reports', async () => {
    jest.spyOn(pythonExecutorService, 'runPythonScript').mockRejectedValue(new Error('Failed to fetch stock reports'));

    await expect(service.fetchStockReports('AAPL', 'financials')).rejects.toThrow('Failed to fetch stock reports');
  });
});
