import { prisma } from 'prisma/prismaClient'
import { Prisma } from '@prisma/client'

type Post = Prisma.PostGetPayload<{}>
export type GetPostListPageSortByDate = (
  pageSize: number,
  pageIdx: number
) => Promise<Post[]>
export const getPostListPageSortByDate: GetPostListPageSortByDate = async (
  pageSize: number,
  pageIdx: number
) => {
  let posts = await prisma.post.findMany({
    take: pageSize,
    skip: pageSize * (pageIdx - 1),
    orderBy: {
      createdAt: 'desc'
    }
  })
  return posts
}

type GetPost = (id: number) => Promise<Post>
export const getPost: GetPost = async (id: number) => {
  let post = await prisma.post.findUnique({
    where: {
      id: id
    }
  })
  if (!post) {
    throw new Error('post not found')
  }
  return post
}

type GetMaxPageIndex = (pageSize: number) => Promise<number>
export const getMaxPageIndex: GetMaxPageIndex = async (pageSize: number) => {
  let count = await prisma.post.count({})
  let pageNumbers = Math.floor(count / pageSize)
  if (Math.round(count / pageSize) !== 0) {
    pageNumbers++
  }
  return pageNumbers
}
