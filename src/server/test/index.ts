import prisma from 'prisma/prismaClient'
import { PrismaClient } from '@prisma/client'
import { IRepository } from 'server/service/interface'
import { repoFactory, stoFactory } from 'server/diContainer'
import { Service } from 'server/service'
import minio from 'minioStorage/minioClient'

export const testRepoWithRollback = async (
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

export const testServiceWithRollback = async (
  testMessage: string,
  testFunction: (s: Service) => Promise<void>
) => {
  test(testMessage, async () => {
    const transaction = async () => {
      await prisma.$transaction(async (tx) => {
        const p = tx as PrismaClient
        const repo = repoFactory(p)
        const sto = stoFactory(minio)
        const service = new Service(repo, sto)
        await testFunction(service)
        throw new Error('prisma rollback')
      })
    }
    await expect(transaction).rejects.toThrow('prisma rollback')
  })
}
