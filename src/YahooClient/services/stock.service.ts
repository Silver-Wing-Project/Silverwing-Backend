import { Injectable, NotFoundException } from '@nestjs/common';
import { StockPriceRepository } from '../repositories/stock-price.repository';
import { StockReportRepository } from '../repositories/stock-report.repository';
import { CreateStockPriceDto } from '../dto/create-stock-price.dto';
import { CreateStockReportDto } from '../dto/create-stock-report.dto';
import { UpdateStockPriceDto } from '../dto/update-stock-price.dto';
import { UpdateStockReportDto } from '../dto/update-stock-report.dto';
import { plainToClass } from 'class-transformer';
import { StockPrice } from '../schemas/stock-price.schema';
import { StockReport } from '../schemas/stock-report.schema';

@Injectable()
export class StockService {
  constructor(
    private readonly stockPriceRepository: StockPriceRepository,
    private readonly stockReportRepository: StockReportRepository,
  ) {}

  async createStockPrice(createStockPriceDto: CreateStockPriceDto): Promise<StockPrice> {
    const stockPrice = plainToClass(StockPrice, createStockPriceDto);
    return this.stockPriceRepository.create(stockPrice);
  }

  async createStockReport(createStockReportDto: CreateStockReportDto): Promise<StockReport> {
    const stockReport = plainToClass(StockReport, createStockReportDto);
    return this.stockReportRepository.create(stockReport);
  }

  async findAllStockPrices(): Promise<StockPrice[]> {
    return this.stockPriceRepository.findAll();
  }

  async findAllStockReports(): Promise<StockReport[]> {
    return this.stockReportRepository.findAll();
  }

  async findStockPriceById(id: string): Promise<StockPrice> {
    return this.stockPriceRepository.findOne(id);
  }

  async findStockReportById(id: string): Promise<StockReport> {
    return this.stockReportRepository.findOne(id);
  }

  async updateStockPrice(id: string, updateStockPriceDto: UpdateStockPriceDto): Promise<StockPrice> {
    const stockPrice = plainToClass(StockPrice, updateStockPriceDto);
    return this.stockPriceRepository.update(id, stockPrice);
  }

  async updateStockReport(id: string, updateStockReportDto: UpdateStockReportDto): Promise<StockReport> {
    const stockReport = plainToClass(StockReport, updateStockReportDto);
    return this.stockReportRepository.update(id, stockReport);
  }

  async deleteStockPrice(id: string): Promise<StockPrice> {
    return this.stockPriceRepository.delete(id);
  }

  async deleteStockReport(id: string): Promise<StockReport> {
    return this.stockReportRepository.delete(id);
  }
}