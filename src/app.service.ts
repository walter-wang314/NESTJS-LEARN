import { Injectable } from '@nestjs/common';
import { WorkerService } from './worker/worker.service';
import { LoggerService } from './logger/logger.service';

@Injectable()
export class AppService {
  constructor(
    private readonly workerService: WorkerService,
    private readonly loggerMessage: LoggerService,
  ) {}

  getHello(): string {
    return `Hello World! ${this.workerService.getWorkerProgress()}, ${this.loggerMessage.log('This is Logger message')}`;
  }
}
