import { PrismaClient } from '@prisma/client'
import { IPostRepo, IRepository, IUserRepo } from 'server/service/interface'

type UserRepo = (prisma: PrismaClient) => IUserRepo
type PostRepo = (prisma: PrismaClient) => IPostRepo

export class Repository implements IRepository {
  prisma: PrismaClient
  public userRepo: IUserRepo
  public postRepo: IPostRepo
  constructor(
    prisma: PrismaClient,
    createUserRepository: UserRepo,
    createPostRepository: PostRepo
  ) {
    this.prisma = prisma
    this.userRepo = createUserRepository(prisma)
    this.postRepo = createPostRepository(prisma)
  }
}
