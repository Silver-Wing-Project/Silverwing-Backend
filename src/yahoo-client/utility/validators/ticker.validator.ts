import { BadRequestException } from '@nestjs/common';

export class TickerValidator {
  static validate(ticker: string): void {
    if (!ticker?.trim()) {
      throw new BadRequestException('Ticker is required and cannot be empty');
    }

    if (ticker.trim().length > 10) {
      throw new BadRequestException('Ticker symbol too long');
    }

    if (!/^[A-Z0-9.-]+$/i.test(ticker.trim())) {
      throw new BadRequestException('Invalid ticker format');
    }
  }

  static normalize(ticker: string): string {
    return ticker.trim().toUpperCase();
  }
}
