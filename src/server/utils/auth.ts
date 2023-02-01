import crypto from 'crypto'
import jwt from 'jsonwebtoken'

export type EncodePassword = (password: string) => string
export const encodePassword: EncodePassword = (password: string) => {
  return crypto.createHash('sha256').update(password).digest('hex')
}

// function generate access token
export type GenerateToken = (id: number) => string
export const generateAccessToken: GenerateToken = (id: number) => {
  let secret = (process.env.NEXT_PUBLIC_SECRET_TOKEN + 'access') as jwt.Secret
  return jwt.sign({ id: id }, secret, {
    expiresIn: '2h'
  })
}

// function generate refresh token
export const generateRefreshToken: GenerateToken = (id: number) => {
  let secret = (process.env.NEXT_PUBLIC_SECRET_TOKEN + 'refresh') as jwt.Secret
  return jwt.sign({ id: id }, secret, {
    expiresIn: '7d'
  })
}
