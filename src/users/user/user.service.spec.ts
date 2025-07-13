import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PasswordService } from '../password/password.service';

// 注意：引入 getRepositoryToken
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user.entity'; // 替换为你的真实 User entity 路径

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        PasswordService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            // 可以根据需要 mock 一些方法
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
