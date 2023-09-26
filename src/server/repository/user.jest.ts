import 'server/repository/user'
import { PrismaClient, User } from '@prisma/client'
import * as auth from 'server/auth'
import { testRepoWithRollback } from 'server/test'
import { IRepository } from 'server/service/repositoryInterface'
import { createDummyUser } from 'server/test/tools'

testRepoWithRollback('getUser', async (p: PrismaClient, repo: IRepository) => {
  const passsword = 'testpw'
  const user = await createDummyUser(p, passsword)
  const dbUser = await repo.userRepo.getUser(user.id)
  expect(dbUser).toEqual(user)
})

testRepoWithRollback(
  'isValidPassword',
  async (p: PrismaClient, repo: IRepository) => {
    const passsword = 'testpw'
    const user = await createDummyUser(p, passsword)
    const isValid = await repo.userRepo.isValidPassword(user.email, passsword)
    expect(isValid).toBe(true)
  }
)

testRepoWithRollback(
  'checkAccessToken',
  async (p: PrismaClient, repo: IRepository) => {
    const passsword = 'testpw'
    const user = await createDummyUser(p, passsword)
    const token = await auth.generateAccessToken(user.name)
    const userName = await repo.userRepo.checkAccessToken(token)
    expect(userName).toEqual(user.name)
  }
)

testRepoWithRollback(
  'checkRefreshToken',
  async (p: PrismaClient, repo: IRepository) => {
    const passsword = 'testpw'
    const user = await createDummyUser(p, passsword)
    const token = await auth.generateRefreshToken(user.name)
    const userName = await repo.userRepo.checkRefreshToken(token)
    expect(userName).toEqual(user.name)
  }
)
