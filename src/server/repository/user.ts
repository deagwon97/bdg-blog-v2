import { PrismaClient, User } from '@prisma/client'
import { IUserRepo } from 'server/service/interface'
import * as auth from 'server/auth'

export class UserRepo implements IUserRepo {
  prisma: PrismaClient
  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  public getUser = async (id: number) => {
    let user = await this.prisma.user.findUnique({
      where: {
        id: id
      }
    })
    if (!user) {
      throw new Error('user not found')
    }
    return user
  }

  public isValidPassword = async (email: string, password: string) => {
    let user = await this.prisma.user.findUnique({
      where: {
        email: email
      }
    })
    if (!user) {
      throw new Error('user not found')
    }
    return user.password === auth.encodePassword(password)
  }
  public getUserByEmail = async (email: string) => {
    let user = await this.prisma.user.findUnique({
      where: {
        email: email
      }
    })
    return user as User
  }
  checkToken = async (
    token: string,
    decoder: (token: string) => {
      name: string
      valid: boolean
    }
  ) => {
    const { name, valid } = decoder(token)
    if (!valid) {
      return ''
    }
    let user = await this.prisma.user.findUnique({
      where: {
        name: name
      }
    })
    if (!user) {
      return ''
    }
    return user.name
  }
  public checkAccessToken = async (token: string) => {
    return await this.checkToken(token, auth.decodeAccessToken)
  }
  public checkRefreshToken = async (token: string) => {
    return await this.checkToken(token, auth.decodeRefreshToken)
  }
}
