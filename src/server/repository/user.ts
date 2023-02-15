import { prisma } from 'prisma/prismaClient'
import { Prisma } from '@prisma/client'
import { encodePassword } from 'server/utils/auth'

type User = Prisma.UserGetPayload<{}>
export type GetUser = (id: number) => Promise<User>
export const getUser: GetUser = async (id: number) => {
  let user = await prisma.user.findUnique({
    where: {
      id: id
    }
  })
  if (!user) {
    throw new Error('user not found')
  }
  return user
}

export type IsValidPassword = (
  email: string,
  password: string
) => Promise<boolean>
export const isValidPassword: IsValidPassword = async (
  email: string,
  password: string
) => {
  let user = await prisma.user.findUnique({
    where: {
      email: email
    }
  })
  if (!user) {
    throw new Error('user not found')
  }
  return user.password === encodePassword(password)
}

// function get user by email
export type GetUserByEmail = (email: string) => Promise<User | null>
export const getUserByEmail: GetUserByEmail = async (email: string) => {
  let user = await prisma.user.findUnique({
    where: {
      email: email
    }
  })
  return user
}
