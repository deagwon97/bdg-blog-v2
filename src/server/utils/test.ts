import prisma from 'prisma/prismaClient'
import { PrismaClient } from '@prisma/client'
import { IRepository } from 'server/service/interface'
import { createRepository } from 'server/singletonRepository'

const testWithRollback = async (
  testMessage: string,
  testFunction: (p: PrismaClient, repo: IRepository) => Promise<void>
) => {
  test(testMessage, async () => {
    const transaction = async () => {
      await prisma.$transaction(async (tx) => {
        const p = tx as PrismaClient
        const repo = createRepository(p)
        await testFunction(p, repo)
        throw new Error('prisma rollback')
      })
    }
    await expect(transaction).rejects.toBeInstanceOf(Error)
  })
}
export default testWithRollback
