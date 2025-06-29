import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkerService } from './worker/worker.service';
import { MessageFormatterService } from './message-formatter/message-formatter.service';
import { LoggerService } from './logger/logger.service';
import { CatsModule } from './cats/cats.module';
import { TasksModule } from './tasks/tasks.module';
import { appConfig } from './config/app.config';
import { appConfigSchema } from './config/config.types';
import { typeOrmConfig } from './config/database.config';
import { TypedConfigService } from './config/typed-config.service';
import { Task } from './tasks/task.entity';
import { User } from './users/user.entity';
import { TaskLabel } from './tasks/task-label.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: TypedConfigService) => ({
        ...configService.get('database'),
        entities: [Task, User, TaskLabel],
      }),
    }),
    ConfigModule.forRoot({
      load: [appConfig, typeOrmConfig],
      validationSchema: appConfigSchema,
      validationOptions: {
        // allowUnknown: false,
        abortEarly: true,
      },
    }),
    TasksModule,
    CatsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    WorkerService,
    MessageFormatterService,
    LoggerService,
    {
      provide: TypedConfigService,
      useExisting: ConfigService,
    },
  ],
})
export class AppModule {}
