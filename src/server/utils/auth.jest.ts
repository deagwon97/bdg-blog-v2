import * as auth from 'server/utils/auth'

it('encodePassword', () => {
  const password = auth.encodePassword('test')
  expect(password).toBe(
    '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
  )
})

it('generate decode token', () => {
  const accessToken = auth.generateAccessToken('test')
  const accessTokenDecoded = auth.decodeAccessToken(accessToken)
  expect(accessTokenDecoded.name).toBe('test')
  expect(accessTokenDecoded.valid).toBe(true)

  const refreshToken = auth.generateRefreshToken('test')
  const refreshTokenDecoded = auth.decodeRefreshToken(refreshToken)
  expect(refreshTokenDecoded.name).toBe('test')
  expect(refreshTokenDecoded.valid).toBe(true)
})
