import { testServiceWithRollback } from 'server/test'
import { createDummyUser } from 'server/test/tools'
import service from 'server/diContainer'
import { generateAccessToken } from 'server/auth'
import { Post } from '@prisma/client'

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

testServiceWithRollback('onCreatePost', async (service) => {
  const assessToken = generateAccessToken('bdg')
  const dummyPost = await service.onCreatePost(
    assessToken,
    'title',
    'content',
    'category',
    'thumbnail'
  )
  const createdPost = (await service.repo.prisma.post.findUnique({
    where: {
      id: dummyPost.id
    }
  })) as Post
  expect(createdPost).toEqual(dummyPost)
})

testServiceWithRollback('onUpdatePost', async (service) => {
  const dummyPost = await service.repo.prisma.post.create({
    data: {
      title: 'title',
      content: 'content',
      thumbnail: 'thumbnail',
      published: true,
      category: {
        connectOrCreate: {
          where: {
            name: 'category'
          },
          create: {
            name: 'category'
          }
        }
      }
    }
  })

  const assessToken = generateAccessToken('bdg')
  const updatedPost = await service.onUpdatePost(
    assessToken,
    dummyPost.id,
    'title2',
    'content2',
    'category2',
    'thumbnail2',
    true
  )
  const savedPost = (await service.repo.prisma.post.findUnique({
    where: {
      id: dummyPost.id
    }
  })) as Post

  expect(savedPost).toEqual(updatedPost)
  expect(savedPost).not.toEqual(dummyPost)
})

testServiceWithRollback('onDeletePost', async (service) => {
  const dummyPost = await service.repo.prisma.post.create({
    data: {
      title: 'title',
      content: 'content',
      thumbnail: 'thumbnail',
      published: true,
      category: {
        connectOrCreate: {
          where: {
            name: 'category'
          },
          create: {
            name: 'category'
          }
        }
      }
    }
  })

  const assessToken = generateAccessToken('bdg')
  await service.onDeletePost(assessToken, dummyPost.id)
  const count = await service.repo.prisma.post.count({
    where: {
      id: dummyPost.id
    }
  })
  expect(count).toEqual(0)
})

testServiceWithRollback('onLoadCategoryList', async (service) => {
  const categoryList = await service.onLoadCategoryList()
  expect(categoryList).not.toEqual([])
})

testServiceWithRollback('onCreateCategory', async (service) => {
  const category = 'test'
  const newCategory = await service.onCreateCategory(category)
  expect(newCategory).toEqual(category)

  const maxPageIndex = await service.onLoadMaxPageIndexByCategory(
    10,
    '',
    true,
    ''
  )
  expect(maxPageIndex > 0).toBe(true)
})

test('onLoadMaxPageIndexByCategory', async () => {
  const maxPageIndex = await service.onLoadMaxPageIndexByCategory(
    10,
    '',
    true,
    ''
  )
  expect(maxPageIndex > 0).toBe(true)
})