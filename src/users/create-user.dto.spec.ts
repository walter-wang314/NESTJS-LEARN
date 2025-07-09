import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('Test Create User Dto', () => {
  it('Create UserDto Success', async () => {
    const newUserDto = new CreateUserDto();
    newUserDto.name = 'Walter';
    newUserDto.email = 'walter@test.com';
    newUserDto.password = '123456';
    const validateResult = await validate(newUserDto);
    expect(validateResult.length).toBe(0);
  });

  it('Create UserDto Failed', async () => {
    const newUserDto = new CreateUserDto();
    newUserDto.name = '';
    newUserDto.email = 'waltertest.com';
    newUserDto.password = '12345';
    const validateResult = await validate(newUserDto);
    expect(validateResult.length).toBe(3);
  });
});
