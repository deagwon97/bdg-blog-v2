export { parseAccessToken }
import { NextApiRequest } from 'next'

const parseAccessToken = async (
  req: NextApiRequest
): Promise<string | undefined> => {
  if (req.cookies.accessToken) {
    const token = req.cookies.accessToken
    return token
  }
}
