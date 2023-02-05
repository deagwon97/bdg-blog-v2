import { telefunc, config, Telefunc } from 'telefunc'
import type { NextApiRequest, NextApiResponse } from 'next'
import { checkUser } from 'server/telefunc/checkUser'
import { HttpResponse } from 'telefunc/dist/cjs/node/server/runTelefunc'

config.telefuncUrl = '/api/_telefunc'

export default async function telefuncMiddleware(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let httpResponse: HttpResponse
  if (!req.cookies.accessToken) {
    httpResponse = await telefunc({
      url: req.url as string,
      method: req.method as string,
      body: req.body as string
    })
    res.status(httpResponse.statusCode).send(httpResponse.body)
    return
  }

  const userId = await checkUser(req)
  httpResponse = await telefunc({
    url: req.url as string,
    method: req.method as string,
    body: req.body as string,
    context: {
      userId: userId
    } as Telefunc.Context
  })
  res.status(httpResponse.statusCode).send(httpResponse.body)
}
