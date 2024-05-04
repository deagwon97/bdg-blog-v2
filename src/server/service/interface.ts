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

export type CheckAccessToken = (accessToken: string) => Promise<boolean>
export type GetAccessTokenByRefreshToken = (
  refreshToekn: string
) => Promise<string>

export type LoadPresignedUrlPutObject = (filename: string) => Promise<string>
export type LoadPostListPageSortByDate = (
  accessToken: string,
  pageSize: number,
  pageIdx: number,
  published: boolean
) => Promise<Post[]>

export type LoadPostListPageSortByDateByCategory = (
  accessToken: string,
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
  connect: Connect
  login: Login
  loadUser: LoadUser
  checkAccessToken: CheckAccessToken
  getAccessTokenByRefreshToken: GetAccessTokenByRefreshToken
  loadPresignedUrlPutObject: LoadPresignedUrlPutObject
  loadPostListPageSortByDate: LoadPostListPageSortByDate
  loadPostListPageSortByDateByCategory: LoadPostListPageSortByDateByCategory
  createPost: CreatePost
  updatePost: UpdatePost
  deletePost: DeletePost
  loadCategoryList: LoadCategoryList
  createCategory: CreateCategory
  loadMaxPageIndexByCategory: LoadMaxPageIndexByCategory
}
