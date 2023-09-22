import 'server/repository/user'
import { Prisma, PrismaClient } from '@prisma/client'
import * as auth from 'server/utils/auth'
import { createRepository } from 'server/singletonRepository'

const prisma = new PrismaClient()

type User = Prisma.UserGetPayload<{}>

const createDummyUser = async (p: PrismaClient) => {
  const password = auth.encodePassword('test')
  const userForm = {
    id: 100,
    name: 'test',
    email: 'test@test.io',
    password: password
  } as User
  const user = await p.user.create({
    data: userForm
  })
  return user
}

test('getUser', async () => {
  const rollback = async () => {
    await prisma.$transaction(async (tx) => {
      const p = tx as PrismaClient
      const repo = createRepository(p)
      const user = await createDummyUser(p)
      const dbUser = await repo.userRepo.getUser(user.id)
      expect(dbUser).toEqual(user)
      throw new Error('prisma rollback')
    })
  }
  await expect(rollback).rejects.toBeInstanceOf(Error)
})

test('isValidPassword', async () => {
  const rollback = async () => {
    await prisma.$transaction(async (tx) => {
      const p = tx as PrismaClient
      const repo = createRepository(p)
      const user = await createDummyUser(p)
      const isValid = await repo.userRepo.isValidPassword(user.email, 'test')
      expect(isValid).toBe(true)
      throw new Error('prisma rollback')
    })
  }
  await expect(rollback).rejects.toBeInstanceOf(Error)
})

test('checkAccessToken', async () => {
  const rollback = async () => {
    await prisma.$transaction(async (tx) => {
      const p = tx as PrismaClient
      const repo = createRepository(p)
      const user = await createDummyUser(p)
      const token = await auth.generateAccessToken(user.name)
      const userName = await repo.userRepo.checkAccessToken(token)
      expect(userName).toEqual(user.name)
      throw new Error('prisma rollback')
    })
  }
  await expect(rollback).rejects.toBeInstanceOf(Error)
})

test('checkRefreshToken', async () => {
  const rollback = async () => {
    await prisma.$transaction(async (tx) => {
      const p = tx as PrismaClient
      const repo = createRepository(p)
      const user = await createDummyUser(p)
      const token = await auth.generateRefreshToken(user.name)
      const userName = await repo.userRepo.checkRefreshToken(token)
      expect(userName).toEqual(user.name)
      throw new Error('prisma rollback')
    })
  }
  await expect(rollback).rejects.toBeInstanceOf(Error)
})
