import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import { PasswordService } from './password.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should hash password', async () => {
    const mockHash = 'hashed_password';
    (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);
    const password = 'abcde12345';
    const result = await service.hash(password);
    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    expect(result).toBe(mockHash);
  });

  it('should verify password', async () => {
    const mockHash = 'hashed_password';
    const password = 'abcde12345';
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    const result = await service.verify(password, mockHash);
    expect(bcrypt.compare).toHaveBeenCalledWith(password, mockHash);
    expect(result).toBe(true);
  });

  it('should fail on incorrect password', async () => {
    const mockHash = 'hashed_password';
    const password = 'abcde12345';
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    const result = await service.verify(password, mockHash);
    expect(bcrypt.compare).toHaveBeenCalledWith(password, mockHash);
    expect(result).toBe(false);
  });
});
