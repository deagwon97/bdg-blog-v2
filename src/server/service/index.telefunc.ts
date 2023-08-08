import * as user from 'server/service/user.telefunc'
import * as post from 'server/service/post.telefunc'

//user
export const onLogin = user.onLogin
export const onLoadUser = user.onLoadUser
//post
export const onCreateCategory = post.onCreateCategory
export const onCreatePost = post.onCreatePost
export const onUpdatePost = post.onUpdatePost
export const onDeletePost = post.onDeletePost
export const onLoadCategoryList = post.onLoadCategoryList
export const onLoadMaxPageIndexByCategory = post.onLoadMaxPageIndexByCategory
export const onLoadPostListPageSortByDate = post.onLoadPostListPageSortByDate
export const onLoadPostListPageSortByDateByCategory =
  post.onLoadPostListPageSortByDateByCategory
export const onLoadPresignedUrl = post.onLoadPresignedUrl
export const onLoadPresignedUrlPutObject = post.onLoadPresignedUrlPutObject
// connect
export const onConnect: () => Promise<string> = async () => {
  return 'connected'
}
