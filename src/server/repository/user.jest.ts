import 'server/repository/user'
import { PrismaClient } from '@prisma/client'
import * as auth from 'server/auth'
import testWithRollback from 'server/test'
import { createDummyUser } from 'server/test'
import { IRepository } from 'server/service/interface'

testWithRollback('getUser', async (p: PrismaClient, repo: IRepository) => {
  const passsword = 'testpw'
  const user = await createDummyUser(p, passsword)
  const dbUser = await repo.userRepo.getUser(user.id)
  expect(dbUser).toEqual(user)
})

testWithRollback(
  'isValidPassword',
  async (p: PrismaClient, repo: IRepository) => {
    const passsword = 'testpw'
    const user = await createDummyUser(p, passsword)
    const isValid = await repo.userRepo.isValidPassword(user.email, passsword)
    expect(isValid).toBe(true)
  }
)

testWithRollback(
  'checkAccessToken',
  async (p: PrismaClient, repo: IRepository) => {
    const passsword = 'testpw'
    const user = await createDummyUser(p, passsword)
    const token = await auth.generateAccessToken(user.name)
    const userName = await repo.userRepo.checkAccessToken(token)
    expect(userName).toEqual(user.name)
  }
)

testWithRollback(
  'checkRefreshToken',
  async (p: PrismaClient, repo: IRepository) => {
    const passsword = 'testpw'
    const user = await createDummyUser(p, passsword)
    const token = await auth.generateRefreshToken(user.name)
    const userName = await repo.userRepo.checkRefreshToken(token)
    expect(userName).toEqual(user.name)
  }
)
