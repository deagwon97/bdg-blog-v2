export { checkUser }
import { prisma } from 'prisma/prismaClient'
import { NextApiRequest } from 'next'
import { decodeAccessToken } from 'server/utils/auth'

async function checkUser(req: NextApiRequest): Promise<number | undefined> {
  if (req.cookies.accessToken) {
    const accessToken = req.cookies.accessToken
    const { userId, valid } = decodeAccessToken(accessToken)
    if (!valid) {
      return undefined
    }
    let user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })
    if (!user) {
      return undefined
    }
    return user.id
  }
}
