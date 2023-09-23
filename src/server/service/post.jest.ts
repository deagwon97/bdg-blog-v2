import * as postService from 'server/service/post.telefunc'
// import { testServiceWithRollback } from 'server/test'

test('onLoadPresignedUrl', async () => {
  const presignedUrl = await postService.onLoadPresignedUrl('test')
  expect(typeof presignedUrl).toBe('string')
})

test('onLoadPresignedUrlPutObject', async () => {
  const presignedUrl = await postService.onLoadPresignedUrlPutObject('test')
  expect(typeof presignedUrl).toBe('string')
})

test('onLoadPostListPageSortByDate', async () => {
  const postListPage = await postService.onLoadPostListPageSortByDate(
    10,
    1,
    true
  )
  expect(typeof postListPage).toBe('object')
})

test('onLoadPostListPageSortByDateByCategory', async () => {
  const postListPage = await postService.onLoadPostListPageSortByDateByCategory(
    10,
    1,
    '',
    true,
    ''
  )
  expect(typeof postListPage).toBe('object')
})

// testServiceWithRollback('getMaxPageIndex', async () => {
//   const dummpyCategory = await postService.onCreateCategory('test')
//   console.log(dummpyCategory)
// })
