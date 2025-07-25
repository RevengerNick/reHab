import { Test, TestingModule } from '@nestjs/testing';
import { Workers/emailWorkerController } from './workers/email-worker.controller';
import { Workers/emailWorkerService } from './workers/email-worker.service';

describe('Workers/emailWorkerController', () => {
  let workers/emailWorkerController: Workers/emailWorkerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [Workers/emailWorkerController],
      providers: [Workers/emailWorkerService],
    }).compile();

    workers/emailWorkerController = app.get<Workers/emailWorkerController>(Workers/emailWorkerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(workers/emailWorkerController.getHello()).toBe('Hello World!');
    });
  });
});
