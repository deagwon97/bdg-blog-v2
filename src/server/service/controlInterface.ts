import * as service from 'server/service/interface'
import { Post } from '@prisma/client'

export type onConnect = service.OnConnect
export type onLogin = service.OnLogin
export type onLoadUser = service.OnLoadUser
export type onLoadPresignedUrl = service.OnLoadPresignedUrl
export type onLoadPresignedUrlPutObject = service.OnLoadPresignedUrlPutObject
export type onLoadPostListPageSortByDate = service.OnLoadPostListPageSortByDate
export type onLoadPostListPageSortByDateByCategory =
  service.OnLoadPostListPageSortByDateByCategory
export type onCreatePost = (
  title: string,
  content: string,
  categoryName: string,
  thumbnail: string
) => Promise<Post>

export type onUpdatePost = (
  id: number,
  title: string,
  content: string,
  categoryName: string,
  thumbnail: string,
  published: boolean
) => Promise<Post>
export type onDeletePost = (id: number) => Promise<Post>
export type onLoadCategoryList = service.OnLoadCategoryList
export type onCreateCategory = (categoryName: string) => Promise<string>
export type onLoadMaxPageIndexByCategory = service.OnLoadMaxPageIndexByCategory
