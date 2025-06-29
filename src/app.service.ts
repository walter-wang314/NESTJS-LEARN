import { Injectable } from '@nestjs/common';
import { WorkerService } from './worker/worker.service';
import { LoggerService } from './logger/logger.service';
import { AppConfig } from './config/app.config';
import { TypedConfigService } from './config/typed-config.service';

@Injectable()
export class AppService {
  constructor(
    private readonly workerService: WorkerService,
    private readonly loggerService: LoggerService,
    private readonly configService: TypedConfigService,
  ) {}

  getHello(): string {
    const messagePrefix =
      this.configService.get<AppConfig>('app')?.messagePrefix;
    return `Hello World! ${this.workerService.getWorkerProgress()}, ${this.loggerService.log(`${messagePrefix} This is Logger message`)}`;
  }
}
