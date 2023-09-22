import * as service from 'server/service/index.telefunc'

test('connected', async () => {
  const response = await service.onConnect()
  expect(response).toBe('connected')
})
