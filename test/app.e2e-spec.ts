import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TestSetup } from './utils/test-setup';

const TIMEOUT_MILI_SECONDS = 10000;

describe('AppController (e2e)', () => {
  let testSetup: TestSetup;

  beforeEach(async () => {
    testSetup = await TestSetup.create(AppModule);
  });

  afterEach(async () => {
    await testSetup.cleanup();
  });

  afterAll(async () => {
    await testSetup.teardown();
  });

  it('/ (GET)', () => {
    return request(testSetup.app.getHttpServer())
      .get('/')
      .expect(200)
      .expect((res) =>
        expect(res.text).toContain('Hello This is Logger message'),
      );
  });

  const testUser = {
    email: 'test@abc.com',
    password: 'Password123@',
    name: 'Test User',
  };

  it(
    '/auth/register (POST)',
    async () => {
      await request(testSetup.app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201)
        .expect((res) => {
          expect(res.body.email).toBe(testUser.email);
          expect(res.body.name).toBe(testUser.name);
          expect(res.body).not.toHaveProperty('password');
        });
    },
    TIMEOUT_MILI_SECONDS,
  );

  it(
    '/auth/register (POST) Dulplicated Request',
    async () => {
      await request(testSetup.app.getHttpServer())
        .post('/auth/register')
        .send(testUser);

      await request(testSetup.app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(409);
    },
    TIMEOUT_MILI_SECONDS,
  );

  it('/auth/login (POST)', async () => {
    await request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(testUser);

    const response = await request(testSetup.app.getHttpServer())
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    // console.log('response:', response);

    expect(response.status).toBe(201);
    expect(response.body.accessToken).toBeDefined();
  });
});
