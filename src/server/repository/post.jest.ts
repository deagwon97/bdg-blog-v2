import 'server/repository/user'
import { Category, Post, PrismaClient } from '@prisma/client'
import { testRepoWithRollback } from 'server/test'
import { IRepository } from 'server/service/repositoryInterface'

testRepoWithRollback(
  'getMaxPageIndex',
  async (p: PrismaClient, repo: IRepository) => {
    let postCount = await p.post.count({
      where: {
        published: true
      }
    })
    let maxPage = Math.ceil(postCount / 10)
    let count = await repo.postRepo.getMaxPageIndex(10, true)
    expect(count).toBe(maxPage)
  }
)

testRepoWithRollback(
  'getPostListPageSortByDate',
  async (p: PrismaClient, repo: IRepository) => {
    const posts = await repo.postRepo.getPostListPageSortByDate(10, 1, true)
    const lastIdx = posts.length - 1
    const oldPost = posts[lastIdx].createdAt as Date
    const lastPost = posts[0].createdAt as Date
    expect(lastPost >= oldPost).toBe(true)
  }
)

testRepoWithRollback(
  'createPost',
  async (p: PrismaClient, repo: IRepository) => {
    const post = await repo.postRepo.createPost(
      'testTitle',
      'testContent',
      'testCategory',
      'testThumbnail'
    )
    const createdPost = (await p.post.findUnique({
      where: {
        id: post.id
      }
    })) as Post
    expect(createdPost).not.toBeNull()
    expect(post.title).toBe(createdPost.title)
    expect(post.content).toBe(createdPost.content)
    expect(post.categoryName).toBe(createdPost.categoryName)
    expect(post.thumbnail).toBe(createdPost.thumbnail)

    const createdCategory = (await p.category.findUnique({
      where: {
        name: createdPost?.categoryName
      }
    })) as Category
    expect(createdCategory).not.toBeNull()
    expect(createdCategory.name).toBe(createdPost.categoryName)
  }
)

testRepoWithRollback('getPost', async (p: PrismaClient, repo: IRepository) => {
  const dummyPost = await p.post.create({
    data: {
      title: 'testTitle',
      content: 'testContent',
      thumbnail: 'testThumbnail',
      published: true,
      category: {
        connectOrCreate: {
          where: {
            name: 'testCategory'
          },
          create: {
            name: 'testCategory'
          }
        }
      }
    }
  })
  const post = await repo.postRepo.getPost(dummyPost.id)
  expect(post).not.toBeNull()
  expect(post.title).toBe(dummyPost.title)
  expect(post.content).toBe(dummyPost.content)
  expect(post.categoryName).toBe(dummyPost.categoryName)
  expect(post.thumbnail).toBe(dummyPost.thumbnail)
})

testRepoWithRollback(
  'getPostByTitle',
  async (p: PrismaClient, repo: IRepository) => {
    const dummyPost = await p.post.create({
      data: {
        title: 'testTitle',
        content: 'testContent',
        thumbnail: 'testThumbnail',
        published: true,
        category: {
          connectOrCreate: {
            where: {
              name: 'testCategory'
            },
            create: {
              name: 'testCategory'
            }
          }
        }
      }
    })
    const post = await repo.postRepo.getPostByTitle(dummyPost.title)
    expect(post).not.toBeNull()
    expect(post.title).toBe(dummyPost.title)
    expect(post.content).toBe(dummyPost.content)
    expect(post.categoryName).toBe(dummyPost.categoryName)
    expect(post.thumbnail).toBe(dummyPost.thumbnail)
  }
)

testRepoWithRollback(
  'updatePost',
  async (p: PrismaClient, repo: IRepository) => {
    const dummyPost = await p.post.create({
      data: {
        title: 'testTitle',
        content: 'testContent',
        thumbnail: 'testThumbnail',
        published: true,
        category: {
          connectOrCreate: {
            where: {
              name: 'testCategory'
            },
            create: {
              name: 'testCategory'
            }
          }
        }
      }
    })

    const updatedPost = await repo.postRepo.updatePost(
      dummyPost.id,
      'updatedTitle',
      'updatedContent',
      'updatedCategory',
      'updatedThumbnail',
      false
    )
    const post = await p.post.findUnique({
      where: {
        id: dummyPost.id
      }
    })
    expect(post).not.toBeNull()
    expect(post?.title).toBe(updatedPost.title)
    expect(post?.content).toBe(updatedPost.content)
    expect(post?.categoryName).toBe(updatedPost.categoryName)
    expect(post?.thumbnail).toBe(updatedPost.thumbnail)
    expect(post?.published).toBe(updatedPost.published)
  }
)

testRepoWithRollback(
  'deletePost',
  async (p: PrismaClient, repo: IRepository) => {
    const dummyPost = await p.post.create({
      data: {
        title: 'testTitle',
        content: 'testContent',
        thumbnail: 'testThumbnail',
        published: true,
        category: {
          connectOrCreate: {
            where: {
              name: 'testCategory'
            },
            create: {
              name: 'testCategory'
            }
          }
        }
      }
    })
    await repo.postRepo.deletePost(dummyPost.id)
    const post = await p.post.findUnique({
      where: {
        id: dummyPost.id
      }
    })
    expect(post).toBeNull()
  }
)

testRepoWithRollback(
  'getCategoryList',
  async (p: PrismaClient, repo: IRepository) => {
    const dummyCategoryList = [
      'testCategory1',
      'testCategory2',
      'testCategory3'
    ]
    const createdDummpyCategoryList = await Promise.all(
      dummyCategoryList.map(async (categoryName) => {
        return await p.category.create({
          data: {
            name: categoryName
          }
        })
      })
    )
    const allCategoryList = await p.category.findMany()
    const categoryList = await repo.postRepo.getCategoryList()
    const categoryListName = allCategoryList.map((category) => category.name)
    expect(categoryList).toEqual(categoryListName)
  }
)
