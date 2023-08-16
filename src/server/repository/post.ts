import { prisma } from 'prisma/prismaClient'
import { Prisma } from '@prisma/client'

type Post = Prisma.PostGetPayload<{}>

type GetMaxPageIndex = (pageSize: number, published: boolean) => Promise<number>
export const getMaxPageIndex: GetMaxPageIndex = async (
  pageSize: number,
  published: boolean
) => {
  let count = await prisma.post.count({
    where: {
      published: published
    }
  })
  let pageNumbers = Math.ceil(count / pageSize)
  return pageNumbers
}

export type GetPostListPageSortByDate = (
  pageSize: number,
  pageIdx: number,
  published: boolean
) => Promise<Post[]>
export const getPostListPageSortByDate: GetPostListPageSortByDate = async (
  pageSize: number,
  pageIdx: number,
  published: boolean
) => {
  let posts = await prisma.post.findMany({
    take: pageSize,
    skip: pageSize * (pageIdx - 1),
    orderBy: {
      createdAt: 'desc'
    },
    where: {
      published: published
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

export type CreatePost = (
  title: string,
  content: string,
  categoryName: string,
  thumbnail: string
) => Promise<Post>
export const createPost: CreatePost = async (
  title: string,
  content: string,
  categoryName: string,
  thumbnail: string
) => {
  let post = await prisma.post.create({
    data: {
      title: title,
      content: content,
      thumbnail: thumbnail,
      published: true,
      category: {
        connectOrCreate: {
          where: {
            name: categoryName
          },
          create: {
            name: categoryName
          }
        }
      }
    }
  })
  return post
}

export type UpdatePost = (
  id: number,
  title: string,
  content: string,
  categoryName: string,
  thumbnail: string,
  published: boolean
) => Promise<Post>
export const updatePost: UpdatePost = async (
  id: number,
  title: string,
  content: string,
  categoryName: string,
  thumbnail: string,
  published: boolean
) => {
  let post = await prisma.post.update({
    where: {
      id: id
    },
    data: {
      title: title,
      content: content,
      thumbnail: thumbnail,
      published: published,
      category: {
        connectOrCreate: {
          where: {
            name: categoryName
          },
          create: {
            name: categoryName
          }
        }
      }
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

export const getCategoryList: () => Promise<string[]> = async () => {
  const categorys = await prisma.category.findMany({
    select: {
      name: true
    }
  })
  const categoryList = categorys.map((category) => category.name)
  return categoryList
}

export const createCategory: (name: string) => Promise<string> = async (
  name: string
) => {
  let category = await prisma.category.create({
    data: {
      name: name
    }
  })
  return category.name
}

export const getMaxPageIndexByCategory: (
  pageSize: number,
  category: string,
  published: boolean
) => Promise<number> = async (
  pageSize: number,
  category: string,
  published: boolean
) => {
  let count = await prisma.post.count({
    where: {
      categoryName: category,
      published: published
    }
  })
  let pageNumbers = Math.ceil(count / pageSize)
  return pageNumbers
}

export const getPostListPageSortByDateCategory: (
  pageSize: number,
  pageIdx: number,
  categoryName: string,
  published: boolean
) => Promise<Post[]> = async (
  pageSize: number,
  pageIdx: number,
  categoryName: string,
  published: boolean
) => {
  let posts = await prisma.post.findMany({
    take: pageSize,
    skip: pageSize * (pageIdx - 1),
    orderBy: {
      createdAt: 'desc'
    },
    where: {
      category: {
        name: categoryName
      },
      published: published
    }
  })
  return posts
}
