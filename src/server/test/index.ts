import prisma from 'prisma/prismaClient'
import { PrismaClient } from '@prisma/client'
import { IRepository } from 'server/service/interface'
import { repoFactory } from 'server/diContainer/repository'
import * as auth from 'server/auth'
import { User } from '@prisma/client'
import { updateGlobalRepository } from 'server/diContainer/repository'

const testWithRollback = async (
  testMessage: string,
  testFunction: (p: PrismaClient, repo: IRepository) => Promise<void>
) => {
  test(testMessage, async () => {
    const transaction = async () => {
      await prisma.$transaction(async (tx) => {
        const p = tx as PrismaClient
        const repo = repoFactory(p)
        await testFunction(p, repo)
        throw new Error('prisma rollback')
      })
    }
    await expect(transaction).rejects.toThrow('prisma rollback')
  })
}
export default testWithRollback

export const testServiceWithRollback = async (
  testMessage: string,
  testFunction: () => Promise<void>
) => {
  test(testMessage, async () => {
    const transaction = async () => {
      await prisma.$transaction(async (tx) => {
        const p = tx as PrismaClient
        updateGlobalRepository(p)
        await testFunction()
        throw new Error('prisma rollback')
      })
    }
    await expect(transaction).rejects.toThrow('prisma rollback')
  })
}

export const createDummyUser = async (p: PrismaClient, password: string) => {
  const endocedPassword = auth.encodePassword(password)
  const userForm = {
    id: -1,
    name: 'test',
    email: 'test@test.io',
    password: endocedPassword
  } as User
  const user = await p.user.create({
    data: userForm
  })
  return user
}
