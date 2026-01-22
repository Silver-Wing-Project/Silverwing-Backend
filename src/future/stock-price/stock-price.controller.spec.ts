import { Test, TestingModule } from '@nestjs/testing';
import { StockPriceController } from './stock-price.controller';
import { StockPriceService } from './stock-price.service';

describe('StockPriceController', () => {
  let controller: StockPriceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockPriceController],
      providers: [StockPriceService],
    }).compile();

    controller = module.get<StockPriceController>(StockPriceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
