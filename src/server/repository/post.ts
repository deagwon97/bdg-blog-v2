import { PrismaClient } from '@prisma/client'
import { IPostRepo } from 'server/service/repositoryInterface'

export const createUriTitle = (title: string) => {
  return title
    .replace(/[`,.~!@#$%^&*()_|+\-=?;:'"<>\{\}\[\]\\\/]/gim, '-')
    .replace(/ /g, '-')
    .replace(/-+/g, '-')
}

export class PostRepo implements IPostRepo {
  prisma: PrismaClient
  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }
  getMaxPageIndex = async (pageSize: number, published: boolean) => {
    let count = await this.prisma.post.count({
      where: {
        published: published
      }
    })
    let pageNumbers = Math.ceil(count / pageSize)
    return pageNumbers
  }
  getPostListPageSortByDate = async (
    pageSize: number,
    pageIdx: number,
    published: boolean
  ) => {
    let posts = await this.prisma.post.findMany({
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

  getPost = async (id: number) => {
    let post = await this.prisma.post.findUnique({
      where: {
        id: id
      }
    })
    if (!post) {
      throw new Error('post not found')
    }
    return post
  }
  getPostByUriTitle = async (uriTtile: string) => {
    let post = await this.prisma.post.findUnique({
      where: {
        uriTitle: uriTtile
      }
    })
    if (!post) {
      throw new Error('post not found')
    }
    return post
  }
  getPostTitleList = async () => {
    const posts = await this.prisma.post.findMany({
      select: {
        uriTitle: true
      }
    })
    const uriTitleList = posts.map((post) => post.uriTitle)
    return uriTitleList
  }

  createPost = async (
    title: string,
    content: string,
    categoryName: string,
    thumbnail: string,
    published: boolean
  ) => {
    let post = await this.prisma.post.create({
      data: {
        title: title,
        uriTitle: createUriTitle(title),
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

  updatePost = async (
    id: number,
    title: string,
    content: string,
    categoryName: string,
    thumbnail: string,
    published: boolean
  ) => {
    let post = await this.prisma.post.update({
      where: {
        id: id
      },
      data: {
        title: title,
        uriTitle: createUriTitle(title),
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

  deletePost = async (id: number) => {
    let post = await this.prisma.post.delete({
      where: {
        id: id
      }
    })
    return post
  }

  getCategoryList: () => Promise<string[]> = async () => {
    const categorys = await this.prisma.category.findMany({
      select: {
        name: true
      }
    })
    const categoryList = categorys.map((category) => category.name)
    return categoryList
  }

  createCategory: (name: string) => Promise<string> = async (name: string) => {
    let category = await this.prisma.category.create({
      data: {
        name: name
      }
    })
    return category.name
  }

  getQueryObject(
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
    return queryObject
  }

  getMaxPageIndexByCategory = async (
    pageSize: number,
    categoryName: string,
    published: boolean,
    searchKeyword: string
  ) => {
    let count = 0
    const queryObject = this.getQueryObject(
      categoryName,
      published,
      searchKeyword
    )
    count = await this.prisma.post.count(queryObject)
    let pageNumbers = Math.ceil(count / pageSize)
    return pageNumbers
  }

  getPostListPageSortByDateCategory = async (
    pageSize: number,
    pageIdx: number,
    categoryName: string,
    published: boolean,
    searchKeyword: string
  ) => {
    const queryObject = this.getQueryObject(
      categoryName,
      published,
      searchKeyword
    )
    let posts = await this.prisma.post.findMany({
      take: pageSize,
      skip: pageSize * (pageIdx - 1),
      orderBy: {
        createdAt: 'desc'
      },
      where: queryObject.where
    })
    return posts
  }
}
