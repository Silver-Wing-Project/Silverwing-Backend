import { Test, TestingModule } from '@nestjs/testing';
import { DataCompletenessService } from './data-completeness.service';

describe('DataCompletenessResultService', () => {
  let service: DataCompletenessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataCompletenessService],
    }).compile();

    service = module.get<DataCompletenessService>(DataCompletenessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
