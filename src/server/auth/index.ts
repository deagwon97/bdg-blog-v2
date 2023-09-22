import crypto from 'crypto'
import jwt from 'jsonwebtoken'

export type EncodePassword = (password: string) => string
export const encodePassword: EncodePassword = (password: string) => {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export type GenerateToken = (name: string) => string

export const generateToken: (
  name: string,
  salt: string,
  duration: string
) => string = (name: string, salt: string, duration: string) => {
  let secret = (process.env.NEXT_PUBLIC_SECRET_TOKEN + salt) as jwt.Secret
  return jwt.sign({ name: name }, secret, {
    expiresIn: duration
  })
}

export const generateAccessToken: GenerateToken = (name: string) => {
  return generateToken(name, 'access', '2h')
}

export const generateRefreshToken: GenerateToken = (name: string) => {
  return generateToken(name, 'refresh', '7d')
}

const decodeToken: (
  token: string,
  salt: string
) => {
  name: string
  valid: boolean
} = (token: string, salt: string) => {
  let secret = (process.env.NEXT_PUBLIC_SECRET_TOKEN + salt) as jwt.Secret
  let decoded = { name: '' }
  let valid = false
  try {
    decoded = jwt.verify(token, secret) as { name: string }
  } catch (error) {
    return { name: decoded.name, valid: valid }
  }
  valid = true
  return { name: decoded.name, valid: valid }
}

export type DecodeToken = (token: string) => {
  name: string
  valid: boolean
}

export const decodeAccessToken: DecodeToken = (token: string) => {
  return decodeToken(token, 'access')
}

export const decodeRefreshToken: DecodeToken = (token: string) => {
  return decodeToken(token, 'refresh')
}
