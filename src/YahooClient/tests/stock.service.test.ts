import { Test, TestingModule } from '@nestjs/testing';
import { StockService } from '../services/stock.service';
import { StockPrice } from '../schemas/stock-price.schema';
import { StockReport } from '../schemas/stock-report.schema';
import { InternalServerErrorException } from '@nestjs/common';

// price tests
describe('StockService stock-price tests', () => {
    let service: StockService;

    const mockStockPrice: StockPrice = {
        _id: '507f1f77bcf86cd799439011',
        ticker: 'AAPL',
        date: new Date('2021-01-01'),
        open: 100,
        high: 110,
        low: 90,
        close: 105,
        volume: 1000000,
    };

    const mockStockPrices: StockPrice[] = [mockStockPrice, { ...mockStockPrice, _id: '507f1f77bcf86cd799439012' }];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: StockService,
                    useValue: {
                        createStockPrice: jest.fn(),
                        findAllStockPrices: jest.fn(),
                        findStockPriceById: jest.fn(),
                        updateStockPrice: jest.fn(),
                        deleteStockPrice: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<StockService>(StockService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create stock price object successfully', async () => {
        jest.spyOn(service, 'createStockPrice').mockResolvedValueOnce(mockStockPrice);

        const result = await service.createStockPrice(mockStockPrice);
        expect(result).toEqual(mockStockPrice);
        expect(service.createStockPrice).toHaveBeenCalledWith(mockStockPrice);
        expect(result).toHaveProperty('ticker', 'AAPL');
        expect(result).toHaveProperty('date', new Date('2021-01-01'));
    });

    it('should throw error when creating stock price object', async () => {
        jest.spyOn(service, 'createStockPrice').mockRejectedValueOnce(new InternalServerErrorException('Error creating stock price'));

        try {
            await service.createStockPrice(mockStockPrice);
        } catch (error) {
            expect(error).toBeInstanceOf(InternalServerErrorException);
            expect(error.message).toEqual('Error creating stock price');
        }
    });

    it('should find all stock prices successfully', async () => {
        jest.spyOn(service, 'findAllStockPrices').mockResolvedValueOnce(mockStockPrices);

        const result = await service.findAllStockPrices();
        expect(result).toEqual(mockStockPrices);
        expect(service.findAllStockPrices).toHaveBeenCalled();
    });

    it('should throw error when finding all stock prices', async () => {
        jest.spyOn(service, 'findAllStockPrices').mockRejectedValueOnce(new InternalServerErrorException('Error finding all stock prices'));

        try {
            await service.findAllStockPrices();
        } catch (error) {
            expect(error).toBeInstanceOf(InternalServerErrorException);
            expect(error.message).toEqual('Error finding all stock prices');
        }
    });

    it('should find stock price by ID successfully', async () => {
        jest.spyOn(service, 'findStockPriceById').mockResolvedValueOnce(mockStockPrice);

        const result = await service.findStockPriceById(mockStockPrice._id);
        expect(result).toEqual(mockStockPrice);
        expect(service.findStockPriceById).toHaveBeenCalledWith(mockStockPrice._id);
    });

    it('should throw error when finding stock price by ID', async () => {
        jest.spyOn(service, 'findStockPriceById').mockRejectedValueOnce(new InternalServerErrorException('Error finding stock price by ID'));

        try {
            await service.findStockPriceById(mockStockPrice._id);
        } catch (error) {
            expect(error).toBeInstanceOf(InternalServerErrorException);
            expect(error.message).toEqual('Error finding stock price by ID');
        }
    });

    it('should update stock price object successfully', async () => {
        jest.spyOn(service, 'updateStockPrice').mockResolvedValueOnce(mockStockPrice);

        const result = await service.updateStockPrice(mockStockPrice._id, mockStockPrice);
        expect(result).toEqual(mockStockPrice);
        expect(service.updateStockPrice).toHaveBeenCalledWith(mockStockPrice._id, mockStockPrice);
        expect(result).toHaveProperty('ticker', 'AAPL');
        expect(result).toHaveProperty('date', new Date('2021-01-01'));
    });

    it('should throw error when updating stock price object', async () => {
        jest.spyOn(service, 'updateStockPrice').mockRejectedValueOnce(new InternalServerErrorException('Error updating stock price'));

        try {
            await service.updateStockPrice(mockStockPrice._id, mockStockPrice);
        } catch (error) {
            expect(error).toBeInstanceOf(InternalServerErrorException);
            expect(error.message).toEqual('Error updating stock price');
        }
    });

    it('should delete stock price object successfully', async () => {
        jest.spyOn(service, 'deleteStockPrice').mockResolvedValueOnce(mockStockPrice);

        const result = await service.deleteStockPrice(mockStockPrice._id);
        expect(result).toEqual(mockStockPrice);
        expect(service.deleteStockPrice).toHaveBeenCalledWith(mockStockPrice._id);
    });

    it('should throw error when deleting stock price object', async () => {
        jest.spyOn(service, 'deleteStockPrice').mockRejectedValueOnce(new InternalServerErrorException('Error deleting stock price'));

        try {
            await service.deleteStockPrice(mockStockPrice._id);
        } catch (error) {
            expect(error).toBeInstanceOf(InternalServerErrorException);
            expect(error.message).toEqual('Error deleting stock price');
        }
    });
});


// report tests
describe('StockService stock-report tests', () => {
    let service: StockService;

    const mockStockReport: StockReport = {
        _id: '507f1f77bcf86cd799439011',
        ticker: 'AAPL',
        date: new Date('2021-01-01'),
        reportType: 'Earnings',
        content: 'Apple Inc. reported earnings of $1.68 per share on revenue of $111.4 billion.',
    };

    const mockStockReports: StockReport[] = [mockStockReport, { ...mockStockReport, _id: '507f1f77bcf86cd799439012' }];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: StockService,
                    useValue: {
                        createStockReport: jest.fn(),
                        findAllStockReports: jest.fn(),
                        findStockReportById: jest.fn(),
                        updateStockReport: jest.fn(),
                        deleteStockReport: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<StockService>(StockService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create stock report object successfully', async () => {
        jest.spyOn(service, 'createStockReport').mockResolvedValueOnce(mockStockReport);

        const result = await service.createStockReport(mockStockReport);
        expect(result).toEqual(mockStockReport);
        expect(service.createStockReport).toHaveBeenCalledWith(mockStockReport);
        expect(result).toHaveProperty('ticker', 'AAPL');
        expect(result).toHaveProperty('date', new Date('2021-01-01'));
    });

    it('should throw error when creating stock report object', async () => {
        jest.spyOn(service, 'createStockReport').mockRejectedValueOnce(new InternalServerErrorException('Error creating stock report'));

        try {
            await service.createStockReport(mockStockReport);
        } catch (error) {
            expect(error).toBeInstanceOf(InternalServerErrorException);
            expect(error.message).toEqual('Error creating stock report');
        }
    });

    it('should find all stock reports successfully', async () => {
        jest.spyOn(service, 'findAllStockReports').mockResolvedValueOnce(mockStockReports);

        const result = await service.findAllStockReports();
        expect(result).toEqual(mockStockReports);
        expect(service.findAllStockReports).toHaveBeenCalled();
    });

    it('should throw error when finding all stock reports', async () => {
        jest.spyOn(service, 'findAllStockReports').mockRejectedValueOnce(new InternalServerErrorException('Error finding all stock reports'));

        try {
            await service.findAllStockReports();
        } catch (error) {
            expect(error).toBeInstanceOf(InternalServerErrorException);
            expect(error.message).toEqual('Error finding all stock reports');
        }
    });

    it('should find stock report by ID successfully', async () => {
        jest.spyOn(service, 'findStockReportById').mockResolvedValueOnce(mockStockReport);

        const result = await service.findStockReportById(mockStockReport._id);
        expect(result).toEqual(mockStockReport);
        expect(service.findStockReportById).toHaveBeenCalledWith(mockStockReport._id);
    });

    it('should throw error when finding stock report by ID', async () => {
        jest.spyOn(service, 'findStockReportById').mockRejectedValueOnce(new InternalServerErrorException('Error finding stock report by ID'));

        try {
            await service.findStockReportById(mockStockReport._id);
        } catch (error) {
            expect(error).toBeInstanceOf(InternalServerErrorException);
            expect(error.message).toEqual('Error finding stock report by ID');
        }
    });

    it('should update stock report object successfully', async () => {
        jest.spyOn(service, 'updateStockReport').mockResolvedValueOnce(mockStockReport);

        const result = await service.updateStockReport(mockStockReport._id, mockStockReport);
        expect(result).toEqual(mockStockReport);
        expect(service.updateStockReport).toHaveBeenCalledWith(mockStockReport._id, mockStockReport);
        expect(result).toHaveProperty('ticker', 'AAPL');
        expect(result).toHaveProperty('date', new Date('2021-01-01'));
    });

    it('should throw error when updating stock report object', async () => {
        jest.spyOn(service, 'updateStockReport').mockRejectedValueOnce(new InternalServerErrorException('Error updating stock report'));

        try {
            await service.updateStockReport(mockStockReport._id, mockStockReport);
        } catch (error) {
            expect(error).toBeInstanceOf(InternalServerErrorException);
            expect(error.message).toEqual('Error updating stock report');
        }
    });

    it('should delete stock report object successfully', async () => {
        jest.spyOn(service, 'deleteStockReport').mockResolvedValueOnce(mockStockReport);

        const result = await service.deleteStockReport(mockStockReport._id);
        expect(result).toEqual(mockStockReport);
        expect(service.deleteStockReport).toHaveBeenCalledWith(mockStockReport._id);
    });

    it('should throw error when deleting stock report object', async () => {
        jest.spyOn(service, 'deleteStockReport').mockRejectedValueOnce(new InternalServerErrorException('Error deleting stock report'));

        try {
            await service.deleteStockReport(mockStockReport._id);
        } catch (error) {
            expect(error).toBeInstanceOf(InternalServerErrorException);
            expect(error.message).toEqual('Error deleting stock report');
        }
    });
});