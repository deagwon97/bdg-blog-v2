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

export type GetPost = (id: number) => Promise<Post>
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
  let pageNumbers = Math.ceil(count / pageSize)
  console.log(pageNumbers)
  console.log(pageNumbers)
  console.log(pageNumbers)
  return pageNumbers
}

export type CreatePost = (title: string, content: string) => Promise<Post>
export const createPost: CreatePost = async (
  title: string,
  content: string
) => {
  let post = await prisma.post.create({
    data: {
      title: title,
      content: content
    }
  })
  return post
}

//delete post
export type DeletePost = (id: number) => Promise<Post>
export const deletePost: DeletePost = async (id: number) => {
  let post = await prisma.post.delete({
    where: {
      id: id
    }
  })
  return post
}
