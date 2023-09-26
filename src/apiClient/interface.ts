import * as ci from 'server/service/controlInterface'

export const TYPES = {
  Api: Symbol('Api')
}

export interface IApi {
  onConnect: ci.onConnect
  onLoadUser: ci.onLoadUser
  onLogin: ci.onLogin
  onLoadPresignedUrl: ci.onLoadPresignedUrl
  onLoadPresignedUrlPutObject: ci.onLoadPresignedUrlPutObject
  onLoadPostListPageSortByDate: ci.onLoadPostListPageSortByDate
  onLoadPostListPageSortByDateByCategory: ci.onLoadPostListPageSortByDateByCategory
  onCreatePost: ci.onCreatePost
  onUpdatePost: ci.onUpdatePost
  onDeletePost: ci.onDeletePost
  onLoadCategoryList: ci.onLoadCategoryList
  onCreateCategory: ci.onCreateCategory
  onLoadMaxPageIndexByCategory: ci.onLoadMaxPageIndexByCategory
}
