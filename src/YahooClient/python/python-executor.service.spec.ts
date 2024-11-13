import { Test, TestingModule } from '@nestjs/testing';
import { PythonExecutorService } from './python-executor.service';

describe('PythonExecutorService', () => {
  let service: PythonExecutorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PythonExecutorService],
    }).compile();

    service = module.get<PythonExecutorService>(PythonExecutorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
