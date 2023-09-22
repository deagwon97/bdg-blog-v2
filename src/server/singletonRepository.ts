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

const repositorySingleton = (prisma: PrismaClient) => {
  return new Repository(prisma, createUserRepository, createPostRepository)
}
export const createRepository = (prisma: PrismaClient) => {
  const repository = new Repository(
    prisma,
    createUserRepository,
    createPostRepository
  )
  return repository
}

type RepositorySingleton = ReturnType<typeof repositorySingleton>

const globalForRepository = globalThis as unknown as {
  repository: RepositorySingleton | undefined
}

const repository = globalForRepository.repository ?? repositorySingleton(prisma)

export default repository

if (process.env.NODE_ENV !== 'production')
  globalForRepository.repository = repository
