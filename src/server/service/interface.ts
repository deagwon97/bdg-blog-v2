import { Post, PrismaClient, User } from '@prisma/client'

export type UserRepositoryFactory = (prisma: PrismaClient) => IUserRepo
export interface IUserRepo {
  prisma: PrismaClient
  getUser: (id: number) => Promise<User>
  isValidPassword: (email: string, password: string) => Promise<boolean>
  getUserByEmail: (email: string) => Promise<User>
  checkAccessToken: (token: string) => Promise<string>
  checkRefreshToken: (token: string) => Promise<string>
}

export type PostRepositoryFactory = (prisma: PrismaClient) => IPostRepo
export interface IPostRepo {
  getMaxPageIndex: (pageSize: number, published: boolean) => Promise<number>
  getPostListPageSortByDate: (
    pageSize: number,
    pageIdx: number,
    published: boolean
  ) => Promise<Post[]>
  getPost: (id: number) => Promise<Post>
  createPost: (
    title: string,
    content: string,
    categoryName: string,
    thumbnail: string
  ) => Promise<Post>
  updatePost: (
    id: number,
    title: string,
    content: string,
    categoryName: string,
    thumbnail: string,
    published: boolean
  ) => Promise<Post>
  deletePost: (id: number) => Promise<Post>
  getCategoryList: () => Promise<string[]>
  createCategory: (categoryName: string) => Promise<string>
  getMaxPageIndexByCategory: (
    pageSize: number,
    categoryName: string,
    published: boolean,
    searchKeyword: string
  ) => Promise<number>
  getPostListPageSortByDateCategory: (
    pageSize: number,
    pageIdx: number,
    categoryName: string,
    published: boolean,
    searchKeyword: string
  ) => Promise<Post[]>
}

export interface IRepository {
  prisma: PrismaClient
  userRepo: IUserRepo
  postRepo: IPostRepo
}
