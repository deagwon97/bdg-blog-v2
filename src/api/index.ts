import { onConnect } from 'server/service/connect.telefunc'
import { injectable } from 'inversify'
import { IApi } from 'api/interface'
import * as user from 'server/service/user.telefunc'
import * as post from 'server/service/post.telefunc'

@injectable()
export class Api implements IApi {
  onConnect = onConnect
  onLogin = user.onLogin
  onLoadUser = user.onLoadUser
  onLoadPresignedUrl = post.onLoadPresignedUrl
  onLoadPresignedUrlPutObject = post.onLoadPresignedUrlPutObject
  onLoadPostListPageSortByDate = post.onLoadPostListPageSortByDate
  onLoadPostListPageSortByDateByCategory =
    post.onLoadPostListPageSortByDateByCategory
  onCreatePost = post.onCreatePost
  onUpdatePost = post.onUpdatePost
  onDeletePost = post.onDeletePost
  onLoadCategoryList = post.onLoadCategoryList
  onCreateCategory = post.onCreateCategory
  onLoadMaxPageIndexByCategory = post.onLoadMaxPageIndexByCategory
}
