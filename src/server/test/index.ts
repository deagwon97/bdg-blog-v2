import prisma from 'prisma/prismaClient'
import { PrismaClient } from '@prisma/client'
import { IRepository } from 'server/service/interface'
import { repoFactory } from 'server/diContainer/repository'

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
    await expect(transaction).rejects.toBeInstanceOf(Error)
  })
}
export default testWithRollback
