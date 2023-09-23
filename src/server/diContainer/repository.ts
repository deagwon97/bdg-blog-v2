import {
  UserRepoFactory,
  PostRepoFactory,
  RepositoryFactory
} from 'server/service/interface'

import { PrismaClient } from '@prisma/client'
import { Repository } from 'server/repository/index'
import { UserRepo } from 'server/repository/user'
import { PostRepo } from 'server/repository/post'
import prisma from 'prisma/prismaClient'

const userRepoFactory: UserRepoFactory = (prisma: PrismaClient) => {
  return new UserRepo(prisma)
}
const postRepoFactory: PostRepoFactory = (prisma: PrismaClient) => {
  return new PostRepo(prisma)
}

export const repoFactory: RepositoryFactory = (prisma: PrismaClient) => {
  return new Repository(prisma, userRepoFactory, postRepoFactory)
}

type RepositorySingleton = ReturnType<typeof repoFactory>
const globalForRepository = globalThis as unknown as {
  repository: RepositorySingleton | undefined
}

const repository = globalForRepository.repository ?? repoFactory(prisma)

export default repository

if (process.env.NODE_ENV !== 'production')
  globalForRepository.repository = repository

// export const updateGlobalRepository = (prisma: PrismaClient) => {
//   globalForRepository.repository = repoFactory(prisma)
// }
