import { Test, TestingModule } from '@nestjs/testing';
import { StockReportService } from './stock-report.service';

describe('StockReportService', () => {
  let service: StockReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockReportService],
    }).compile();

    service = module.get<StockReportService>(StockReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
