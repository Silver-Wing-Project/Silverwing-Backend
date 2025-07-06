import { Test, TestingModule } from '@nestjs/testing';
import { DateRangeService } from './date-range.service';

describe('DateRangeService', () => {
  let service: DateRangeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DateRangeService],
    }).compile();

    service = module.get<DateRangeService>(DateRangeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
