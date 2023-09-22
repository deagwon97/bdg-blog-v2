import 'server/repository/user'
import { Prisma, PrismaClient } from '@prisma/client'
import * as auth from 'server/auth'
import testWithRollback from 'server/test'
import { IRepository } from 'server/service/interface'

type User = Prisma.UserGetPayload<{}>

const createDummyUser = async (p: PrismaClient) => {
  const password = auth.encodePassword('test')
  const userForm = {
    id: -1,
    name: 'test',
    email: 'test@test.io',
    password: password
  } as User
  const user = await p.user.create({
    data: userForm
  })
  return user
}

testWithRollback('getUser', async (p: PrismaClient, repo: IRepository) => {
  const user = await createDummyUser(p)
  const dbUser = await repo.userRepo.getUser(user.id)
  expect(dbUser).toEqual(user)
})

testWithRollback(
  'isValidPassword',
  async (p: PrismaClient, repo: IRepository) => {
    const user = await createDummyUser(p)
    const isValid = await repo.userRepo.isValidPassword(user.email, 'test')
    expect(isValid).toBe(true)
  }
)

testWithRollback(
  'checkAccessToken',
  async (p: PrismaClient, repo: IRepository) => {
    const user = await createDummyUser(p)
    const token = await auth.generateAccessToken(user.name)
    const userName = await repo.userRepo.checkAccessToken(token)
    expect(userName).toEqual(user.name)
  }
)

testWithRollback(
  'checkRefreshToken',
  async (p: PrismaClient, repo: IRepository) => {
    const user = await createDummyUser(p)
    const token = await auth.generateRefreshToken(user.name)
    const userName = await repo.userRepo.checkRefreshToken(token)
    expect(userName).toEqual(user.name)
  }
)
