import { PrismaClient, User } from '@prisma/client'
import * as auth from 'server/auth'

export const createDummyUser = async (p: PrismaClient, password: string) => {
  const endocedPassword = auth.encodePassword(password)
  const userForm = {
    id: -1,
    name: 'test',
    email: 'test@test.io',
    password: endocedPassword
  } as User
  const user = await p.user.create({
    data: userForm
  })
  return user
}
