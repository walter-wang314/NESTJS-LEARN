import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { testConfig } from './../config/test.config';

export class TestSetup {
  app: INestApplication;
  dataSource: DataSource;

  static async create(module: any) {
    const instance = new TestSetup();
    await instance.init(module);
    return instance;
  }

  private async init(module: any) {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [module],
    })
      .overrideFilter(ConfigService)
      .useValue({
        get: (key: string) => {
          if (key.includes('database')) {
            return testConfig.database;
          }

          if (key.includes('app')) {
            return testConfig.app;
          }

          if (key.includes('auth')) {
            return testConfig.auth;
          }

          return null;
        },
      })
      .compile();

    this.app = moduleFixture.createNestApplication();
    this.app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );
    this.dataSource = moduleFixture.get(DataSource);

    await this.app.init();
  }

  async cleanup() {
    // Get all entity metadata to find table names
    const entities = this.dataSource.entityMetadatas;
    // Create list of table names for SQL query
    const tableNames = entities
      .map((entity) => `"${entity.tableName}"`)
      .join(', ');
    // TRUNCATE removes all data
    // RESTART IDENTITY resets auto-increment counters
    // CASCADE handles foreign key relationships
    await this.dataSource.query(
      `TRUNCATE ${tableNames} RESTART IDENTITY CASCADE;`,
    );
  }

  async teardown() {
    await this.dataSource.destroy(); // Close database connection
    await this.app.close(); // Shut down NestJS app
  }
}
