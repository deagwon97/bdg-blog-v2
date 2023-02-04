import { telefunc, config } from 'telefunc'
import type { NextApiRequest, NextApiResponse } from 'next'
import { checkUser } from 'server/telefunc/getUser'

config.telefuncUrl = '/api/_telefunc'

export default async function telefuncMiddleware(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = await checkUser(req)
  const httpResponse = await telefunc({
    context: {
      userId
    },
    url: req.url as string,
    method: req.method as string,
    body: req.body
  })
  res.status(httpResponse.statusCode).send(httpResponse.body)
}
