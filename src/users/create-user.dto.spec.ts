import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('Test Create User Dto', () => {
  let newUserDto = new CreateUserDto();

  async function testPwd(pwdValue: string, errorMsg: string) {
    newUserDto.password = pwdValue;
    const validatResult = await validate(newUserDto);
    const passwordValidateError = validatResult.find(
      (result) => result.property === 'password',
    );
    expect(passwordValidateError).not.toBeUndefined();
    const errorMessage = Object.values(
      passwordValidateError?.constraints ?? {},
    );
    expect(errorMessage).toContain(errorMsg);
  }

  beforeEach(() => {
    newUserDto = new CreateUserDto();
    newUserDto.name = 'Walter';
    newUserDto.email = 'walter@test.com';
    newUserDto.password = '12345A#';
  });

  it('Create UserDto Success', async () => {
    const validateResult = await validate(newUserDto);
    expect(validateResult.length).toBe(0);
  });

  it('Create UserDto with all Fails', async () => {
    newUserDto.name = '';
    newUserDto.email = 'waltertest.com';
    newUserDto.password = '12345';
    const validateResult = await validate(newUserDto);
    expect(validateResult.length).toBe(3);
  });

  it('should return 1 uppercase letter validation messages', async () => {
    await testPwd(
      '123abc#',
      'Password must contain at least 1 uppercase letter',
    );
  });

  it('should return 1 special character validation messages', async () => {
    await testPwd(
      '123Abc',
      'Password must contain at least 1 special character',
    );
  });
});
