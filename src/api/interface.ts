import { Post, User } from '@prisma/client'

export const TYPES = {
  Api: Symbol('Api')
}

export type OnConnect = () => Promise<string>
export type LoginResult = {
  valid: boolean
  errMessage: string
  id: number
  name: string
  accessToken: string
  refreshToken: string
}
export type OnLogin = (email: string, password: string) => Promise<LoginResult>
export type OnLoadUser = (id: number) => Promise<User>

export type OnLoadPresignedUrl = (filename: string) => Promise<string>
export type OnLoadPresignedUrlPutObject = (filename: string) => Promise<string>
export type OnLoadPostListPageSortByDate = (
  pageSize: number,
  pageIdx: number,
  published: boolean
) => Promise<Post[]>

export type OnLoadPostListPageSortByDateByCategory = (
  pageSize: number,
  pageIdx: number,
  categoryName: string,
  published: boolean,
  searchKeyword: string
) => Promise<Post[]>

export type OnCreatePost = (
  title: string,
  content: string,
  categoryName: string,
  thumbnail: string
) => Promise<Post>

export type UpdatePost = (
  id: number,
  title: string,
  content: string,
  categoryName: string,
  thumbnail: string,
  published: boolean
) => Promise<Post>

export type DeletePost = (id: number) => Promise<Post>

export type OnLoadCategoryList = () => Promise<string[]>

export type OnCreateCategory = (categoryName: string) => Promise<string>

export type OnLoadMaxPageIndexByCategory = (
  pageSize: number,
  categoryName: string,
  published: boolean,
  searchKeyword: string
) => Promise<number>

export interface IApi {
  onConnect: OnConnect
  onLogin: OnLogin
  onLoadUser: OnLoadUser
  onLoadPresignedUrl: OnLoadPresignedUrl
  onLoadPresignedUrlPutObject: OnLoadPresignedUrlPutObject
  onLoadPostListPageSortByDate: OnLoadPostListPageSortByDate
  onLoadPostListPageSortByDateByCategory: OnLoadPostListPageSortByDateByCategory
  onCreatePost: OnCreatePost
  onUpdatePost: UpdatePost
  onDeletePost: DeletePost
  onLoadCategoryList: OnLoadCategoryList
  onCreateCategory: OnCreateCategory
  onLoadMaxPageIndexByCategory: OnLoadMaxPageIndexByCategory
}
