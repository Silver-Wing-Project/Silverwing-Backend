import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  describe('AppController', () => {
    let appController: AppController;
    let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
      appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

    describe('getHello', () => {
      it('should call getHello method of AppService', () => {
        const getHelloSpy = jest.spyOn(appService, 'getHello');
        appController.getHello();
        expect(getHelloSpy).toHaveBeenCalled();
      });

      it('should return the same value as AppService getHello method', () => {
        const mockHello = 'Hello Test!';
        jest.spyOn(appService, 'getHello').mockReturnValue(mockHello);
        expect(appController.getHello()).toBe(mockHello);
      });
    });
  });
});
