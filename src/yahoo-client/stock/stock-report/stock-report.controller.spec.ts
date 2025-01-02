import { Test, TestingModule } from '@nestjs/testing';
import { StockReportController } from './stock-report.controller';
import { StockReportService } from './stock-report.service';

describe('StockReportController', () => {
  let controller: StockReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockReportController],
      providers: [StockReportService],
    }).compile();

    controller = module.get<StockReportController>(StockReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
