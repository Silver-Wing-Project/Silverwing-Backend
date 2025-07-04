import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FinanceModule } from '@finance/finance.module';
import { StockModule } from '@stock/stock.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'development'}`, // Use environment-specific file
        '.env', // Fallback to default .env file
      ],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        // const nodeEnv = configService.get<string>('NODE_ENV');
        // console.log(`Current NODE_ENV: ${nodeEnv}`);

        const mongodbUri = configService.get<string>('MONGODB_URI');
        // console.log(`Using MongoDB URI: ${mongodbUri}`);

        if (!mongodbUri) {
          console.error('Error: MongoDB URI is not defined. Check your environment variables.');
          process.exit(1); // Exit the application if the URI is undefined
        }

        // const mongodbUri =
        //   nodeEnv === 'development'
        //     ? configService.get<string>('MONGODB_LOCALHOST_URI')
        //     : configService.get<string>('MONGODB_URI');

        // if (!mongodbUri) {
        //   console.error('Error: MongoDB URI is not defined. Check your environment variables.');
        //   process.exit(1); // Exit the application if the URI is undefined
        // }

        return { uri: mongodbUri };
      },
      inject: [ConfigService],
    }),
    FinanceModule,
    StockModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
