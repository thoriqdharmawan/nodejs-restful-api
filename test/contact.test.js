import supertest from 'supertest';
import { createTestContact, createTestUser, getTestContact, removeAllTestContacts, removeTestUser } from './test-util.js';
import { web } from "../src/application/web.js";

describe("POST /api/contacts", () => {
  beforeEach(async () => {
    await createTestUser()
  })

  afterEach(async () => {
    await removeAllTestContacts()
    await removeTestUser()
  })

  it('Should can create contacts', async () => {
    const result = await supertest(web)
      .post('/api/contacts')
      .set('Authorization', 'test')
      .send({
        first_name: 'test',
        last_name: 'test',
        email: 'test@thq.com',
        phone: '0897887985'
      })

    expect(result.status).toBe(200)
    expect(result.body.data.id).toBeDefined()
    expect(result.body.data.first_name).toBe('test')
    expect(result.body.data.last_name).toBe('test')
    expect(result.body.data.email).toBe('test@thq.com')
    expect(result.body.data.phone).toBe('0897887985')

  })

  it('Should reject if request is not valid', async () => {
    const result = await supertest(web)
      .post('/api/contacts')
      .set('Authorization', 'test')
      .send({
        first_name: 'test',
        last_name: 'test',
        email: 'test@thq.com',
        phone: '089788798124124124141241245'
      })

    expect(result.status).toBe(400)
    expect(result.body.errors).toBeDefined()
  })
})

describe('GET /api/contact/:contactId', () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  })

  afterEach(async () => {
    await removeAllTestContacts()
    await removeTestUser()
  })

  it('should can get contact', async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .get("/api/contacts/" + testContact.id)
      .set('Authorization', 'test');

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(testContact.id);
    expect(result.body.data.first_name).toBe(testContact.first_name);
    expect(result.body.data.last_name).toBe(testContact.last_name);
    expect(result.body.data.email).toBe(testContact.email);
    expect(result.body.data.phone).toBe(testContact.phone);
  });

  it('should return 404 if contact is not found', async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .get("/api/contacts/" + testContact.id + 1)
      .set('Authorization', 'test');

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined()
  });
})

describe('PUT /api/contact/:contactId', () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  })

  afterEach(async () => {
    await removeAllTestContacts()
    await removeTestUser()
  })

  it('should can update contact', async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .put("/api/contacts/" + testContact.id)
      .set('Authorization', 'test')
      .send({
        first_name: 'update',
        last_name: 'update',
        email: 'update@thq.com',
        phone: "321321"
      })

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(testContact.id);
    expect(result.body.data.first_name).toBe('update');
    expect(result.body.data.last_name).toBe('update');
    expect(result.body.data.email).toBe('update@thq.com');
    expect(result.body.data.phone).toBe('321321');
  });

  it('should reject if request is invalid', async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .put("/api/contacts/" + testContact.id)
      .set('Authorization', 'test')
      .send({
        first_name: '',
        last_name: '',
        email: '',
        phone: ""
      })

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined()
  });

  it('should reject udpate if contact is not found', async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .put("/api/contacts/" + testContact.id + 1)
      .set('Authorization', 'test')
      .send({
        first_name: 'update',
        last_name: 'update',
        email: 'update@thq.com',
        phone: "321321"
      })

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined()
  });
})