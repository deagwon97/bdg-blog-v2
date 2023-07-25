import {
  getUser,
  GetUser,
  getUserByEmail,
  isValidPassword
} from 'server/repository/user'
import { LoginResult } from 'server/types/user'
import { generateAccessToken, generateRefreshToken } from 'server/utils/auth'

export const onLoadUser: GetUser = async (id: number) => {
  return getUser(id)
}

export type PostLogin = (
  email: string,
  password: string
) => Promise<LoginResult>

export const onLogin: PostLogin = async (email: string, password: string) => {
  let user = await getUserByEmail(email)
  if (user === null || !user) {
    return {
      valid: false,
      errMessage: 'user not exist',
      id: 0,
      name: '',
      accessToken: '',
      refreshToken: ''
    }
  }
  let validPassword = await isValidPassword(email, password)
  if (!validPassword) {
    return {
      valid: false,
      errMessage: 'Invalid password',
      id: 0,
      name: '',
      accessToken: '',
      refreshToken: ''
    }
  }
  let accessToken = generateAccessToken(user.name)
  let refreshToken = generateRefreshToken(user.name)
  return {
    valid: true,
    errMessage: '',
    id: user.id,
    name: user.name,
    accessToken: accessToken,
    refreshToken: refreshToken
  }
}
