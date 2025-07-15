import { PasswordService } from './../password/password.service';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passwordService: PasswordService,
  ) {}

  public async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email });
  }

  public async findOneByUserId(id: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }

  public async createUser(userDto: CreateUserDto) {
    const hashedPassword = await this.passwordService.hash(userDto.password);

    const user = this.userRepository.create({
      ...userDto,
      password: hashedPassword,
    });

    return await this.userRepository.save(user);
  }
}
