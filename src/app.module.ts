import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkerService } from './worker/worker.service';
import { MessageFormatterService } from './message-formatter/message-formatter.service';
import { LoggerService } from './logger/logger.service';
import { CatsModule } from './cats/cats.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [CatsModule, TasksModule],
  controllers: [AppController],
  providers: [
    AppService,
    WorkerService,
    MessageFormatterService,
    LoggerService,
  ],
})
export class AppModule {}
