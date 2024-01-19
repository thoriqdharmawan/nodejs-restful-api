import supertest from 'supertest'
import { web } from "../src/application/web.js";
import { prismaClient } from '../src/application/database';
import { logger } from '../src/application/logging.js';

describe('POST /api/users', () => {
  afterEach(async () => {
    await prismaClient.user.deleteMany({
      where: {
        username: 'thoriq'
      }
    })
  })

  it('should can register new users', async () => {
    const result = await supertest(web)
      .post('/api/users')
      .send({
        username: 'thoriq',
        password: 'rahasia',
        name: 'Thoriq Dharmawan'
      })

    expect(result.status).toBe(200)
    expect(result.body.data.username).toBe('thoriq')
    expect(result.body.data.name).toBe('Thoriq Dharmawan')
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

    logger.info(result.body)

    expect(result.status).toBe(400)
    expect(result.body.errors).toBeDefined()
  })

  it('should reject if username already registered', async () => {
    let result = await supertest(web)
      .post('/api/users')
      .send({
        username: 'thoriq',
        password: 'rahasia',
        name: 'Thoriq Dharmawan'
      })

    logger.info(result.body)

    expect(result.status).toBe(200)
    expect(result.body.data.username).toBe('thoriq')
    expect(result.body.data.name).toBe('Thoriq Dharmawan')
    expect(result.body.data.password).toBeUndefined()


    result = await supertest(web)
      .post('/api/users')
      .send({
        username: 'thoriq',
        password: 'rahasia',
        name: 'Thoriq Dharmawan'
      })

    logger.info(result.body)

    expect(result.status).toBe(400)
    expect(result.body.errors).toBeDefined();
  })
})