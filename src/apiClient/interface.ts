import * as ci from 'server/service/controlInterface'

export const TYPES = {
  Api: Symbol('Api')
}

export interface IApi {
  onConnect: ci.OnConnect
  onLoadUser: ci.OnLoadUser
  onLogin: ci.OnLogin
  onLoadPresignedUrl: ci.OnLoadPresignedUrl
  onLoadPresignedUrlPutObject: ci.OnLoadPresignedUrlPutObject
  onLoadPostListPageSortByDate: ci.OnLoadPostListPageSortByDate
  onLoadPostListPageSortByDateByCategory: ci.OnLoadPostListPageSortByDateByCategory
  onCreatePost: ci.OnCreatePost
  onUpdatePost: ci.OnUpdatePost
  onDeletePost: ci.OnDeletePost
  onLoadCategoryList: ci.OnLoadCategoryList
  onCreateCategory: ci.OnCreateCategory
  onLoadMaxPageIndexByCategory: ci.OnLoadMaxPageIndexByCategory
}
