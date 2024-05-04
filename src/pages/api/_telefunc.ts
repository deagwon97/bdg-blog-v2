import { telefunc, config, Telefunc } from 'telefunc'
import type { NextApiRequest, NextApiResponse } from 'next'
import { parseAccessToken } from 'server/telefunc/checkUser'
import { HttpResponse } from 'telefunc/dist/cjs/node/server/runTelefunc'
import assert from 'assert'
config.telefuncUrl = '/api/_telefunc'
config.disableNamingConvention = true

export default async function telefuncMiddleware(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let httpResponse: HttpResponse
  const { url, method, body } = req
  assert(url && method)
  let accessToken = (await parseAccessToken(req)) as string

  httpResponse = await telefunc({
    url: url,
    method: method,
    body: body,
    context: {
      accessToken: accessToken
    } as Telefunc.Context
  })
  res.status(httpResponse.statusCode).send(httpResponse.body)
}
