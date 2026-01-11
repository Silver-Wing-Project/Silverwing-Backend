import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FinanceModule } from '@finance/finance.module';
import { StockModule } from '@stock/stock.module';
import { BigFiveAnalysisModule } from './yahoo-client/analysis/big-five-analysis/big-five-analysis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.get<string>('NODE_ENV') || 'development';
        const mongodbUri = configService.get<string>('MONGODB_URI');

        console.log(`Environment: ${nodeEnv}`);
        console.log(`MongoDB URI: ${mongodbUri}`);

        if (!mongodbUri) {
          console.error('MONGODB_URI is not defined in environment variables');
          process.exit(1);
        }

        return {
          uri: mongodbUri,
          retryWrites: true,
          w: 'majority',
        };
      },
      inject: [ConfigService],
    }),
    FinanceModule,
    StockModule,
    BigFiveAnalysisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
