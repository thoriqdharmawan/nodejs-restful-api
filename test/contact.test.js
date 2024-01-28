import supertest from 'supertest';
import { createManyTestContact, createTestContact, createTestUser, getTestContact, removeAllTestContacts, removeTestUser } from './test-util.js';
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

describe('DELETE /api/contact/:contactId', () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  })

  afterEach(async () => {
    await removeAllTestContacts()
    await removeTestUser()
  })


  it("should remove contacts correctly", async () => {
    let testContact = await getTestContact();

    const result = await supertest(web)
      .delete("/api/contacts/" + testContact.id)
      .set('Authorization', 'test')

    expect(result.status).toBe(200)
    expect(result.body.data).toBe('OK')


    testContact = await getTestContact();
    expect(testContact).toBeNull();
  })

  it("should reject if contacts is not found", async () => {
    let testContact = await getTestContact();

    const result = await supertest(web)
      .delete("/api/contacts/" + testContact.id + 1)
      .set('Authorization', 'test')

    expect(result.status).toBe(404)
  })
})

describe('GET /api/contacts', () => {
  beforeEach(async () => {
    await createTestUser();
    await createManyTestContact();
  })

  afterEach(async () => {
    await removeAllTestContacts()
    await removeTestUser()
  })

  it('should search many contacts correctly', async () => {
    const result = await supertest(web)
      .get('/api/contacts')
      .set('Authorization', 'test')

    expect(result.status).toBe(200)
    expect(result.body.data.length).toBe(10)
    expect(result.body.paging.page).toBe(1)
    expect(result.body.paging.total_page).toBe(2)
    expect(result.body.paging.total_item).toBe(15)
  })

  it('should search to page 2 contacts correctly', async () => {
    const result = await supertest(web)
      .get('/api/contacts')
      .query({ page: 2 })
      .set('Authorization', 'test')

    expect(result.status).toBe(200)
    expect(result.body.data.length).toBe(5)
    expect(result.body.paging.page).toBe(2)
    expect(result.body.paging.total_page).toBe(2)
    expect(result.body.paging.total_item).toBe(15)
  })

  it('should search using name contacts correctly', async () => {
    const result = await supertest(web)
      .get('/api/contacts')
      .query({ name: 'test 1' })
      .set('Authorization', 'test')

    expect(result.status).toBe(200)
    expect(result.body.data.length).toBe(6)
    expect(result.body.paging.page).toBe(1)
    expect(result.body.paging.total_page).toBe(1)
    expect(result.body.paging.total_item).toBe(6)
  })

  it('should search using email contacts correctly', async () => {
    const result = await supertest(web)
      .get('/api/contacts')
      .query({ email: 'test1' })
      .set('Authorization', 'test')

    expect(result.status).toBe(200)
    expect(result.body.data.length).toBe(6)
    expect(result.body.paging.page).toBe(1)
    expect(result.body.paging.total_page).toBe(1)
    expect(result.body.paging.total_item).toBe(6)
  })

  it('should search phone email contacts correctly', async () => {
    const result = await supertest(web)
      .get('/api/contacts')
      .query({ phone: '1231231' })
      .set('Authorization', 'test')

    expect(result.status).toBe(200)
    expect(result.body.data.length).toBe(6)
    expect(result.body.paging.page).toBe(1)
    expect(result.body.paging.total_page).toBe(1)
    expect(result.body.paging.total_item).toBe(6)
  })
})