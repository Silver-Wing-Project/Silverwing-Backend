import { Test, TestingModule } from '@nestjs/testing';
import { StockDataOrchestrationService } from './stock-data-orchestration.service';

describe('StockDataOrchestrationService', () => {
  let service: StockDataOrchestrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockDataOrchestrationService],
    }).compile();

    service = module.get<StockDataOrchestrationService>(StockDataOrchestrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
