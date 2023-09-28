import {
  UserRepoFactory,
  PostRepoFactory,
  RepositoryFactory,
  IRepository
} from 'server/service/repositoryInterface'
import { IStorage } from 'server/service/storageInterface'
import { PrismaClient } from '@prisma/client'
import { Repository } from 'server/repository/index'
import { UserRepo } from 'server/repository/user'
import { PostRepo } from 'server/repository/post'
import { Service } from 'server/service'
import { StorageFactory } from 'server/service/storageInterface'
import { Storage } from 'server/storage'
import { IService } from 'server/service/interface'

const Minio = require('minio')

const minio = new Minio.Client({
  endPoint: process.env.NEXT_PUBLIC_MINIO_ENDPOINT || 'no-entpoint',
  useSSL: true,
  accessKey: process.env.NEXT_PUBLIC_MINIO_ACCESSKEY || 'no-access-key',
  secretKey: process.env.NEXT_PUBLIC_MINIO_SECRETKEY || 'no-secret-key'
})

const prisma = new PrismaClient()

const userRepoFactory: UserRepoFactory = (prisma: PrismaClient) => {
  return new UserRepo(prisma)
}
const postRepoFactory: PostRepoFactory = (prisma: PrismaClient) => {
  return new PostRepo(prisma)
}

export const repoFactory: RepositoryFactory = (prisma: PrismaClient) => {
  return new Repository(prisma, userRepoFactory, postRepoFactory)
}

export const stoFactory: StorageFactory = (minio: any) => {
  return new Storage(minio)
}

export const serviceFactory = (repo: IRepository, sto: IStorage): IService => {
  return new Service(repo, sto)
}

type RepositorySingleton = ReturnType<typeof repoFactory>
const globalForRepository = globalThis as unknown as {
  repository: RepositorySingleton | undefined
}

type StorageSingleton = ReturnType<typeof stoFactory>
const globalForStorage = globalThis as unknown as {
  storage: StorageSingleton | undefined
}

type ServiceSingleton = ReturnType<typeof serviceFactory>
const globalForService = globalThis as unknown as {
  service: ServiceSingleton | undefined
}

const repository = globalForRepository.repository ?? repoFactory(prisma)
const storage = globalForStorage.storage ?? stoFactory(minio)
const service = globalForService.service ?? serviceFactory(repository, storage)

if (process.env.NODE_ENV !== 'production') {
  globalForStorage.storage = storage
  globalForRepository.repository = repository
  globalForService.service = service
}

export { repository, storage }
export default service
