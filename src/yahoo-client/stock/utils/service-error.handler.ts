import { BadRequestException, InternalServerErrorException, NotFoundException, Logger } from '@nestjs/common';

export class ServiceErrorHandler {
  constructor(private readonly logger: Logger) {}

  handleBusinessError(error: Error, context: string, errorMessage: string): never {
    this.logger.error(`Error in ${context}`, error.stack);
    if (error instanceof BadRequestException || error instanceof NotFoundException) {
      throw error;
    }
    throw new InternalServerErrorException(errorMessage);
  }

  handleRepositoryError(error: Error, context: string, errorMessage: string): never {
    this.logger.error(`Repository error in ${context}`, error.stack);
    throw new InternalServerErrorException(errorMessage);
  }
}
