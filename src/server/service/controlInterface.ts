import * as service from 'server/service/interface'
import { Post } from '@prisma/client'

export type OnConnect = service.Connect
export type OnLogin = service.Login
export type OnLoadUser = service.LoadUser
export type OnCheckAccessToken = service.CheckAccessToken
export type OnLoadAccessTokenByRefreshToken =
  service.GetAccessTokenByRefreshToken
export type OnLoadPresignedUrlPutObject = service.LoadPresignedUrlPutObject
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
  thumbnail: string,
  published: boolean
) => Promise<Post>

export type OnUpdatePost = (
  id: number,
  title: string,
  content: string,
  categoryName: string,
  thumbnail: string,
  published: boolean
) => Promise<Post>
export type OnDeletePost = (id: number) => Promise<Post>
export type OnLoadCategoryList = service.LoadCategoryList
export type OnCreateCategory = (categoryName: string) => Promise<string>
export type OnLoadMaxPageIndexByCategory = service.LoadMaxPageIndexByCategory
