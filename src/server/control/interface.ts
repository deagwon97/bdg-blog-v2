import { Post } from '@prisma/client'
import * as IApi from 'apiClient/interface'

export interface IService {
  onConnect: IApi.OnConnect
  onLogin: IApi.OnLogin
  onLoadUser: IApi.OnLoadUser
  onLoadPresignedUrl: IApi.OnLoadPresignedUrl
  onLoadPresignedUrlPutObject: IApi.OnLoadPresignedUrlPutObject
  onLoadPostListPageSortByDate: IApi.OnLoadPostListPageSortByDate
  onLoadPostListPageSortByDateByCategory: IApi.OnLoadPostListPageSortByDateByCategory
  onCreatePost: (
    accessToken: string,
    title: string,
    content: string,
    categoryName: string,
    thumbnail: string
  ) => Promise<Post>
  onUpdatePost: (
    accessToken: string,
    id: number,
    title: string,
    content: string,
    categoryName: string,
    thumbnail: string,
    published: boolean
  ) => Promise<Post>
  onDeletePost: (accessToken: string, id: number) => Promise<Post>
  onLoadCategoryList: IApi.OnLoadCategoryList
  onCreateCategory: (
    accessToken: string,
    categoryName: string
  ) => Promise<string>
  onLoadMaxPageIndexByCategory: IApi.OnLoadMaxPageIndexByCategory
}
