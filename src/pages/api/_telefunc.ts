import { telefunc, config } from 'telefunc'
import type { NextApiRequest, NextApiResponse } from 'next'
import assert from 'assert'

config.telefuncUrl = '/api/_telefunc'

export default async function telefuncMiddleware(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url, method, body } = req
  assert(url && method)
  const context = {}
  const httpResponse = await telefunc({ url, method, body, context })
  res.status(httpResponse.statusCode).send(httpResponse.body)
}
