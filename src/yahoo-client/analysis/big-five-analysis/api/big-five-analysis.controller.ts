import { Controller, Get, Param, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

import { BigFiveAnalysisService } from '../application/big-five-analysis.service';
import { BigFiveNumbers } from '../domain/interfaces/big-five.interface';

@ApiTags('Big-Five')
@Controller('big-five')
export class BigFiveAnalysisController {
  private readonly logger: Logger = new Logger(BigFiveAnalysisController.name);

  constructor(private readonly bigFiveAnalysisService: BigFiveAnalysisService) {}

  @Get('analyze-big-five/:ticker')
  @ApiOperation({ summary: 'Calculate Big Five Ny=umbers for a given ticker' })
  @ApiParam({ name: 'ticker', type: String, description: 'Stock Ticker', example: 'AAPL', required: true })
  @ApiResponse({ status: 200, description: 'Successfully analyzed the Big Five numbers for the given ticker' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async analysisFiveNumbers(@Param('ticker') ticker: string): Promise<BigFiveNumbers> {
    this.logger.log(`Received analysis request for ticker: ${ticker}`);
    const result = await this.bigFiveAnalysisService.fetchAndCalculate(ticker);
    // console.log(`result: `, result);
    return result;
  }

  @Get('sync-analyze/:ticker')
  @ApiOperation({ summary: 'Scrape latest data and analyze in one request' })
  async syncAndAnalyze(@Param('ticker') ticker: string): Promise<BigFiveNumbers> {
    this.logger.log(`Received sync & analyze request for ticker: ${ticker}`);
    const result = await this.bigFiveAnalysisService.syncAndCalculate(ticker);
    return result;
  }
}
