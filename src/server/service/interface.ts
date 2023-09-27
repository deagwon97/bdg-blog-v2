import { Post, User } from '@prisma/client'
import { IRepository } from 'server/service/repositoryInterface'
import { IStorage } from 'server/service/storageInterface'

export type Connect = () => Promise<string>
export type LoginResult = {
  valid: boolean
  errMessage: string
  id: number
  name: string
  accessToken: string
  refreshToken: string
}
export type Login = (email: string, password: string) => Promise<LoginResult>
export type LoadUser = (id: number) => Promise<User>

export type LoadPresignedUrl = (filename: string) => Promise<string>
export type LoadPresignedUrlPutObject = (filename: string) => Promise<string>
export type LoadPostListPageSortByDate = (
  pageSize: number,
  pageIdx: number,
  published: boolean
) => Promise<Post[]>

export type LoadPostListPageSortByDateByCategory = (
  pageSize: number,
  pageIdx: number,
  categoryName: string,
  published: boolean,
  searchKeyword: string
) => Promise<Post[]>

export type CreatePost = (
  accessToken: string,
  title: string,
  content: string,
  categoryName: string,
  thumbnail: string
) => Promise<Post>

export type UpdatePost = (
  accessToken: string,
  id: number,
  title: string,
  content: string,
  categoryName: string,
  thumbnail: string,
  published: boolean
) => Promise<Post>

export type DeletePost = (accessToken: string, id: number) => Promise<Post>

export type LoadCategoryList = () => Promise<string[]>

export type CreateCategory = (
  accessToken: string,
  categoryName: string
) => Promise<string>

export type LoadMaxPageIndexByCategory = (
  pageSize: number,
  categoryName: string,
  published: boolean,
  searchKeyword: string
) => Promise<number>

export interface IService {
  repo: IRepository
  sto: IStorage
  Connect: Connect
  Login: Login
  LoadUser: LoadUser
  LoadPresignedUrl: LoadPresignedUrl
  LoadPresignedUrlPutObject: LoadPresignedUrlPutObject
  LoadPostListPageSortByDate: LoadPostListPageSortByDate
  LoadPostListPageSortByDateByCategory: LoadPostListPageSortByDateByCategory
  CreatePost: CreatePost
  UpdatePost: UpdatePost
  DeletePost: DeletePost
  LoadCategoryList: LoadCategoryList
  CreateCategory: CreateCategory
  LoadMaxPageIndexByCategory: LoadMaxPageIndexByCategory
}
