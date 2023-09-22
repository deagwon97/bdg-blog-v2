import { onConnect } from 'server/service/connect.telefunc'

test('connected', async () => {
  const response = await onConnect()
  expect(response).toBe('connected')
})
