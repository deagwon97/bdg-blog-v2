import { repository as repo } from 'server/repository'
import { LoginResult } from 'server/types/user'
import * as auth from 'server/utils/auth'

export const onLoadUser = async (id: number) => {
  return repo.getUser(id)
}

export type Login = (email: string, password: string) => Promise<LoginResult>
export const onLogin: Login = async (email: string, password: string) => {
  let user = await repo.getUserByEmail(email)
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
  let validPassword = await repo.isValidPassword(email, password)
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
  let accessToken = auth.generateAccessToken(user.name)
  let refreshToken = auth.generateRefreshToken(user.name)
  return {
    valid: true,
    errMessage: '',
    id: user.id,
    name: user.name,
    accessToken: accessToken,
    refreshToken: refreshToken
  }
}
