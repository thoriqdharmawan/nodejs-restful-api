import supertest from 'supertest'
import bcrypt from 'bcrypt'

import { web } from "../src/application/web.js";
import { logger } from '../src/application/logging.js';
import { createTestUser, getTestUser, removeTestUser } from './test-util.js';

describe('POST /api/users', () => {
  afterEach(async () => {
    await removeTestUser()
  })

  it('should can register new users', async () => {
    const result = await supertest(web)
      .post('/api/users')
      .send({
        username: 'test',
        password: 'rahasia',
        name: 'User Test'
      })

    expect(result.status).toBe(200)
    expect(result.body.data.username).toBe('test')
    expect(result.body.data.name).toBe('User Test')
    expect(result.body.data.password).toBeUndefined()
  })

  it('should reject if request is invalid', async () => {
    const result = await supertest(web)
      .post('/api/users')
      .send({
        username: '',
        password: '',
        name: ''
      })

    expect(result.status).toBe(400)
    expect(result.body.errors).toBeDefined()
  })

  it('should reject if username already registered', async () => {
    let result = await supertest(web)
      .post('/api/users')
      .send({
        username: 'test',
        password: 'rahasia',
        name: 'User Test'
      })

    expect(result.status).toBe(200)
    expect(result.body.data.username).toBe('test')
    expect(result.body.data.name).toBe('User Test')
    expect(result.body.data.password).toBeUndefined()


    result = await supertest(web)
      .post('/api/users')
      .send({
        username: 'test',
        password: 'rahasia',
        name: 'User Test'
      })

    expect(result.status).toBe(400)
    expect(result.body.errors).toBeDefined();
  })
})

describe('POST /api/users/login', () => {
  beforeEach(async () => {
    await createTestUser()
  })

  afterEach(async () => {
    await removeTestUser()
  })

  it('Should can login', async () => {
    const result = await supertest(web)
      .post('/api/users/login')
      .send({
        username: 'test',
        password: 'rahasia'
      })

    expect(result.status).toBe(200)
    expect(result.body.data.token).toBeDefined()
    expect(result.body.data.token).not.toBe('test')
  })

  it('Should reject login if request is invalid', async () => {
    const result = await supertest(web)
      .post('/api/users/login')
      .send({
        username: '',
        password: ''
      })

    expect(result.status).toBe(400)
    expect(result.body.errors).toBeDefined()
  })

  it('should reject login if password is wrong', async () => {
    const result = await supertest(web)
      .post('/api/users/login')
      .send({
        username: "test",
        password: "salah"
      });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it('Should reject login if username is wrong', async () => {
    const result = await supertest(web)
      .post('/api/users/login')
      .send({
        username: 'salah',
        password: 'salah'
      })

    expect(result.status).toBe(401)
    expect(result.body.errors).toBeDefined()
  })
})

describe('GET /api/users/current', () => {
  beforeEach(async () => {
    await createTestUser()
  })

  afterEach(async () => {
    await removeTestUser()
  })

  it('should can get current user', async () => {
    const result = await supertest(web)
      .get('/api/users/current')
      .set('Authorization', 'test')

    expect(result.status).toBe(200)
    expect(result.body.data.username).toBe('test')
    expect(result.body.data.name).toBe('User Test')
  })

  it('should reject if token is invalid', async () => {
    const result = await supertest(web)
      .get('/api/users/current')
      .set('Authorization', 'salah')

    expect(result.status).toBe(401)
    expect(result.body.errors).toBeDefined()
  })
})

describe('PATCH /api/users/current', () => {
  beforeEach(async () => {
    await createTestUser()
  })

  afterEach(async () => {
    await removeTestUser()
  })

  it('should can update current user', async () => {
    const result = await supertest(web)
      .patch('/api/users/current')
      .set('Authorization', 'test')
      .send({
        password: 'rahasiabanget',
        name: 'User Test Update'
      })

    expect(result.status).toBe(200)
    expect(result.body.data.username).toBe('test')
    expect(result.body.data.name).toBe('User Test Update')

    const user = await getTestUser()
    expect(await bcrypt.compare('rahasiabanget', user.password)).toBe(true)
  })

  it('should update current name', async () => {
    const result = await supertest(web)
      .patch('/api/users/current')
      .set('Authorization', 'test')
      .send({
        name: 'User Test Update'
      })

    expect(result.status).toBe(200)
    expect(result.body.data.username).toBe('test')
    expect(result.body.data.name).toBe('User Test Update')
  })

  it('should update current password', async () => {
    const result = await supertest(web)
      .patch('/api/users/current')
      .set('Authorization', 'test')
      .send({
        password: 'rahasiabanget',
      })

    expect(result.status).toBe(200)
    expect(result.body.data.username).toBe('test')
    expect(result.body.data.name).toBe('User Test')

    const user = await getTestUser()
    expect(await bcrypt.compare('rahasiabanget', user.password)).toBe(true)
  })

  it('should reject update if not valid', async () => {
    const result = await supertest(web)
      .patch('/api/users/current')
      .set('Authorization', 'salah')
      .send({
        password: '',
      })

    expect(result.status).toBe(401)
    expect(result.body.errors).toBeDefined();
  })
})

describe('DELETE /api/users/logout', () => {
  beforeEach(async () => {
    await createTestUser()
  })

  afterEach(async () => {
    await removeTestUser()
  })

  it('should can logout user', async () => {
    const result = await supertest(web)
      .delete('/api/users/logout')
      .set('Authorization', 'test')
      .send({
        username: 'test'
      })

    expect(result.status).toBe(200)

    const user = await getTestUser()
    expect(user.token).toBeNull()
  })

  it('should reject logout if token is invalid', async () => {
    const result = await supertest(web)
      .delete('/api/users/logout')
      .set('Authorization', 'salah')
      .send({
        username: 'test'
      })

    expect(result.status).toBe(401)
  })
})