import { PrismaClient } from '@prisma/client'
import { Repository } from 'server/repository/index'
import { UserRepo } from 'server/repository/user'
import { PostRepo } from './repository/post'
import prisma from 'prisma/prismaClient'

const createUserRepository = (prisma: PrismaClient) => {
  return new UserRepo(prisma)
}
const createPostRepository = (prisma: PrismaClient) => {
  return new PostRepo(prisma)
}

export const createRepository = (prisma: PrismaClient) => {
  return new Repository(prisma, createUserRepository, createPostRepository)
}

type RepositorySingleton = ReturnType<typeof createRepository>

const globalForRepository = globalThis as unknown as {
  repository: RepositorySingleton | undefined
}

const repository = globalForRepository.repository ?? createRepository(prisma)

export default repository

if (process.env.NODE_ENV !== 'production')
  globalForRepository.repository = repository
