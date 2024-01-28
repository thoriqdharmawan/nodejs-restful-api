import { prismaClient } from "../src/application/database.js"
import bcrypt from 'bcrypt'

export const removeTestUser = async () => {
  await prismaClient.user.deleteMany({
    where: {
      username: 'test'
    }
  })
}

export const createTestUser = async () => {
  await prismaClient.user.create({
    data: {
      username: 'test',
      password: await bcrypt.hash('rahasia', 10),
      name: 'User Test',
      token: 'test'
    }
  })
}

export const getTestUser = async () => {
  return await prismaClient.user.findUnique({
    where: {
      username: 'test'
    }
  })
}

export const removeAllTestContacts = async () => {
  await prismaClient.contact.deleteMany({
    where: {
      username: 'test'
    }
  })
}

export const createTestContact = async () => {
  await prismaClient.contact.create({
    data: {
      username: 'test',
      first_name: 'test',
      last_name: 'test',
      email: 'test@thq.com',
      phone: '123123'
    }
  })
}
export const createManyTestContact = async () => {
  for (let i = 0; i < 15; i++) {
    await prismaClient.contact.create({
      data: {
        username: 'test',
        first_name: `test ${i}`,
        last_name: `test ${i}`,
        email: `test${i}@thq.com`,
        phone: `123123${i}`
      }
    })
  }
}

export const getTestContact = async () => {
  return prismaClient.contact.findFirst({
    where: {
      username: 'test'
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
    }
  })
}

export const removeAllTestAddresses = async () => {
  await prismaClient.address.deleteMany({
    where: {
      contact: {
        username: 'test'
      }
    }
  })
}