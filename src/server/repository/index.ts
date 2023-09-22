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
    userRepoFactory: UserRepo,
    postRepoFactory: PostRepo
  ) {
    this.prisma = prisma
    this.userRepo = userRepoFactory(prisma)
    this.postRepo = postRepoFactory(prisma)
  }
}
