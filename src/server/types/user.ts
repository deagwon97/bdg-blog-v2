export type LoginResult = {
  valid: boolean
  errMessage: string
  id: number
  email: string
  accessToken: string
  refreshToken: string
}
