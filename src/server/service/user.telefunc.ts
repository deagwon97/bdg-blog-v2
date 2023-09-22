import repo from 'server/diContainer/repository'
import * as auth from 'server/auth'
import * as IApi from 'apiClient/interface'

export const onLoadUser: IApi.OnLoadUser = async (id: number) => {
  return repo.userRepo.getUser(id)
}

export const onLogin: IApi.OnLogin = async (
  email: string,
  password: string
) => {
  let user = await repo.userRepo.getUserByEmail(email)
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
  let validPassword = await repo.userRepo.isValidPassword(email, password)
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
