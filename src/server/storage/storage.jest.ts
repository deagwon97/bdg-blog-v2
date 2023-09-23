import 'server/repository/user'
import { storage as sto } from 'server/diContainer'

test('getPresignedUrlPutObject', async () => {
  const presignedUrl = await sto.getPresignedUrlPutObject('test')
  expect(typeof presignedUrl).toBe('string')
})

test('getPresignedUrl', async () => {
  const presignedUrl = await sto.getPresignedUrl('test')
  expect(typeof presignedUrl).toBe('string')
})
