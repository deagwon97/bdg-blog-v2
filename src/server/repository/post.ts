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

function getQueryObject(
  categoryName: string,
  published: boolean,
  searchKeyword: string
) {
  let queryObject = {
    where: {
      published: published
    }
  } as any
  if (categoryName !== '') {
    queryObject.where['categoryName'] = categoryName
  }
  if (searchKeyword !== '') {
    queryObject.where['OR'] = [
      {
        title: {
          contains: searchKeyword
        }
      },
      {
        content: {
          contains: searchKeyword
        }
      }
    ]
  }
  console.log('----------')
  console.log(queryObject)
  return queryObject
}

export const getMaxPageIndexByCategory: (
  pageSize: number,
  categoryName: string,
  published: boolean,
  searchKeyword: string
) => Promise<number> = async (
  pageSize: number,
  categoryName: string,
  published: boolean,
  searchKeyword: string
) => {
  let count = 0
  const queryObject = getQueryObject(categoryName, published, searchKeyword)
  count = await prisma.post.count(queryObject)
  let pageNumbers = Math.ceil(count / pageSize)
  return pageNumbers
}

export const getPostListPageSortByDateCategory: (
  pageSize: number,
  pageIdx: number,
  categoryName: string,
  published: boolean,
  searchKeyword: string
) => Promise<Post[]> = async (
  pageSize: number,
  pageIdx: number,
  categoryName: string,
  published: boolean,
  searchKeyword: string
) => {
  const queryObject = getQueryObject(categoryName, published, searchKeyword)
  let posts = await prisma.post.findMany({
    take: pageSize,
    skip: pageSize * (pageIdx - 1),
    orderBy: {
      createdAt: 'desc'
    },
    where: queryObject.where
  })
  return posts
}
