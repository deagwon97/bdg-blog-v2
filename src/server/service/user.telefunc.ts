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
      email: '',
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
      email: '',
      accessToken: '',
      refreshToken: ''
    }
  }
  let accessToken = generateAccessToken(user.id)
  let refreshToken = generateRefreshToken(user.id)
  return {
    valid: true,
    errMessage: '',
    id: user.id,
    email: user.email,
    accessToken: accessToken,
    refreshToken: refreshToken
  }
}
