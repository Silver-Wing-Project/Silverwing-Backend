import { Test, TestingModule } from '@nestjs/testing';
import { BigFiveAnalysisController } from './big-five-analysis.controller';
import { BigFiveAnalysisService } from '../application/big-five-analysis.service';
import { BigFiveNumbers } from '../domain/interfaces/big-five.interface';

describe('BigFiveAnalysisController', () => {
  let controller: BigFiveAnalysisController;
  let service: BigFiveAnalysisService;

  const mockAnalysisResult: BigFiveNumbers = {
    ticker: 'MSFT',
    mostRecentYear: 2025,
    roic: 15,
    bvpsGrowth: { tenYear: 12, fiveYear: 11, oneYear: 10, average: 11 },
    salesGrowth: { tenYear: 12, fiveYear: 11, oneYear: 10, average: 11 },
    epsGrowth: { tenYear: 12, fiveYear: 11, oneYear: 10, average: 11 },
    fcfGrowth: { tenYear: 12, fiveYear: 11, oneYear: 10, average: 11 },
    recommendation: {
      status: 'STRONG_BUY',
      metricsPassingThreshold: 5,
      totalMetrics: 5,
      details: [],
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BigFiveAnalysisController],
      providers: [
        {
          provide: BigFiveAnalysisService,
          useValue: {
            fetchAndCalculate: jest.fn().mockResolvedValue(mockAnalysisResult),
            syncAndCalculate: jest.fn().mockResolvedValue(mockAnalysisResult),
          },
        },
      ],
    }).compile();

    controller = module.get<BigFiveAnalysisController>(BigFiveAnalysisController);
    service = module.get<BigFiveAnalysisService>(BigFiveAnalysisService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('analysisFiveNumbers', () => {
    it('should call service.fetchAndCalculate with correct parameters and return the result', async () => {
      const ticker = 'MSFT';

      // Act
      const result = await controller.analysisFiveNumbers(ticker);

      // Assert: Verify the controller-to-service boundary
      expect(service.fetchAndCalculate).toHaveBeenCalledWith(ticker);
      expect(service.fetchAndCalculate).toHaveBeenCalledTimes(1);

      // Assert: Verify the data returned by the controller is what the service provided
      expect(result).toEqual(mockAnalysisResult);
    });
  });

  describe('syncAndAnalyze', () => {
    it('should call service.syncAndCalculate and return the result', async () => {
      const ticker = 'AAPL';

      const result = await controller.syncAndAnalyze(ticker);

      expect(service.syncAndCalculate).toHaveBeenCalledWith(ticker);
      expect(result).toEqual(mockAnalysisResult);
    });
  });

  describe('Error Handling', () => {
    it('should throw an error if the service fails', async () => {
      // Mock the service to reject with an error
      jest.spyOn(service, 'fetchAndCalculate').mockRejectedValue(new Error('Service Down'));

      await expect(controller.analysisFiveNumbers('FAIL')).rejects.toThrow('Service Down');
    });

    it('should propagate errors from the service', async () => {
      jest.spyOn(service, 'fetchAndCalculate').mockRejectedValue(new Error('Ticker not found'));

      await expect(controller.analysisFiveNumbers('INVALID')).rejects.toThrow('Ticker not found');
    });
  });
});
