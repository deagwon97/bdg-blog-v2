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
    const prisma = new PrismaClient()
    const transaction = async () => {
      await prisma.$transaction(async (tx) => {
        const p = tx as PrismaClient
        const repo = repoFactory(p)
        await testFunction(p, repo)
        throw new Error('prisma rollback')
      })
    }
    await expect(transaction).rejects.toThrow('prisma rollback')
    prisma.$disconnect()
  })
}

export const testServiceWithRollback = async (
  testMessage: string,
  testFunction: (s: Service) => Promise<void>
) => {
  test(testMessage, async () => {
    const prisma = new PrismaClient()
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
    prisma.$disconnect()
  })
}

export const describeServiceWithRollback = async (
  describeMessage: string,
  testBlocks: {
    msg: string
    func: (s: Service) => Promise<void>
  }[]
) => {
  const prisma = new PrismaClient()
  describe(describeMessage, () => {
    const transaction = async () => {
      await prisma.$transaction(async (tx) => {
        const p = tx as PrismaClient
        const repo = repoFactory(p)
        const sto = stoFactory(minio)
        const service = new Service(repo, sto)
        console.log('runtest')
        for (const testBlock of testBlocks) {
          test(testBlock.msg, async () => {
            await testBlock.func(service)
          })
        }
        throw new Error('prisma rollback')
      })
    }

    expect(transaction).rejects.toThrow('prisma rollback')

    prisma.$disconnect()
  })
}
