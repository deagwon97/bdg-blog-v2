import {
  UserRepoFactory,
  PostRepoFactory,
  RepositoryFactory,
  IStorage,
  IRepository
} from 'server/service/interface'
import { PrismaClient } from '@prisma/client'
import { Repository } from 'server/repository/index'
import { UserRepo } from 'server/repository/user'
import { PostRepo } from 'server/repository/post'
import prisma from 'prisma/prismaClient'
import { IApi } from 'apiClient/interface'
import { Service } from 'server/service'
import { StorageFactory } from 'server/service/interface'
import { Storage } from 'server/storage'
import minio from 'minioStorage/minioClient'
import { IService } from 'server/control/interface'

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
