import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs/promises'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await new Promise((resolve) => setTimeout(resolve, 3000))
  const files = await fs.readdir('.')
  res.json(files)
}
