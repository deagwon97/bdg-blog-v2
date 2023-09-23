import { testServiceWithRollback } from 'server/test'
import { createDummyUser } from 'server/test/tools'
import service from 'server/diContainer'

test('onConnect', async () => {
  const result = await service.onConnect()
  expect(result).toBe('connected')
})

testServiceWithRollback('onLoadUser', async (service) => {
  const passsword = 'testpw'
  const dummyUser = await createDummyUser(service.repo.prisma, passsword)
  const loadedUser = await service.onLoadUser(dummyUser.id)
  expect(loadedUser).toEqual(dummyUser)
})

testServiceWithRollback('onLogin', async (service) => {
  const passsword = 'testpw'
  const dummyUser = await createDummyUser(service.repo.prisma, passsword)
  const result = await service.onLogin(dummyUser.email, passsword)
  expect(result.valid).toBe(true)
  expect(result.errMessage).toBe('')
  expect(result.id).toBe(dummyUser.id)
  expect(result.name).toBe(dummyUser.name)
  expect(result.accessToken).not.toBe('')
  expect(result.refreshToken).not.toBe('')
})

test('onLoadPresignedUrl', async () => {
  const result = await service.onLoadPresignedUrl('filename')
  expect(typeof result).toBe('string')
})

test('onLoadPresignedUrlPutObject', async () => {
  const result = await service.onLoadPresignedUrlPutObject('filename')
  expect(typeof result).toBe('string')
})

test('onLoadPostListPageSortByDate', async () => {
  const result = await service.onLoadPostListPageSortByDate(10, 1, true)
  expect(result).not.toEqual([])
})

// testServiceWithRollback('onCreatePost', async (service) => {
//   // const dummyPost = await service.repo.prisma.post.create({
//   //     data: {
//   //         title: 'title',
//   //         content: 'content',
//   //         category:{
//   //             connectOrCreate:{
//   //                 where:{
//   //                     name:'category'
//   //                 },
//   //                 create:{
//   //                     name:'category'
//   //                 }
//   //             }
//   //         }
//   //     }
//   // })

//   const dummyPost = await service.onCreatePost(
//     'title',
//     'content',
//     'category',
//     'thumbnail'
//   )
//   const createdPost = await service.repo.prisma.post.findUnique({
//     where: {
//       id: dummyPost.id
//     }
//   })
//   expect(createdPost).toBe(dummyPost)
// })
