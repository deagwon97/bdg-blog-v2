import * as api from 'server/control/index.telefunc'
import { injectable } from 'inversify'
import { IApi } from 'apiClient/interface'

@injectable()
export class Api implements IApi {
  onConnect = api.onConnect
  onLoadUser = api.onLoadUser
  onLogin = api.onLogin
  onLoadPresignedUrl = api.onLoadPresignedUrl
  onLoadPresignedUrlPutObject = api.onLoadPresignedUrlPutObject
  onLoadPostListPageSortByDate = api.onLoadPostListPageSortByDate
  onLoadPostListPageSortByDateByCategory =
    api.onLoadPostListPageSortByDateByCategory
  onCreatePost = api.onCreatePost
  onUpdatePost = api.onUpdatePost
  onDeletePost = api.onDeletePost
  onLoadCategoryList = api.onLoadCategoryList
  onCreateCategory = api.onCreateCategory
  onLoadMaxPageIndexByCategory = api.onLoadMaxPageIndexByCategory
}
