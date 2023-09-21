import * as service from 'server/service/index.telefunc'

it('should do something', async () => {
  // test logic
  const response = await service.onConnect()
  // const response = await supertest(handler).get('/api/hello')
  // console.log(response)
  expect(response).toBe('connected')
})
