import { NextApiRequest } from 'next'

const parseAccessToken = async (req: NextApiRequest): Promise<string> => {
  if (!req.cookies) {
    return ''
  }
  if (req.cookies.accessToken) {
    const token = req.cookies.accessToken
    return token
  }
  return ''
}
export { parseAccessToken }
