import { PrismaClient } from '@prisma/client'
import { IRepository } from 'server/service/repositoryInterface'
import { repoFactory, stoFactory } from 'server/diContainer'
import { Service } from 'server/service'
const Minio = require('minio')

const minio = new Minio.Client({
  endPoint: process.env.NEXT_PUBLIC_MINIO_ENDPOINT || 'no-entpoint',
  useSSL: true,
  accessKey: process.env.NEXT_PUBLIC_MINIO_ACCESSKEY || 'no-access-key',
  secretKey: process.env.NEXT_PUBLIC_MINIO_SECRETKEY || 'no-secret-key'
})

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
