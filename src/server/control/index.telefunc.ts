import { getContext } from 'telefunc'
import service from 'server/diContainer'
import * as ci from 'server/service/controlInterface'

export const onConnect: ci.OnConnect = service.connect
export const onLoadUser: ci.OnLoadUser = service.loadUser
export const onLogin: ci.OnLogin = service.login
export const onLoadPresignedUrl: ci.OnLoadPresignedUrl =
  service.loadPresignedUrl
export const onLoadPresignedUrlPutObject: ci.OnLoadPresignedUrlPutObject =
  service.loadPresignedUrlPutObject
export const onLoadPostListPageSortByDate: ci.OnLoadPostListPageSortByDate =
  service.loadPostListPageSortByDate
export const onLoadPostListPageSortByDateByCategory: ci.OnLoadPostListPageSortByDateByCategory =
  service.loadPostListPageSortByDateByCategory
export const onCreatePost: ci.OnCreatePost = async (
  title: string,
  content: string,
  categoryName: string,
  thumbnail: string
) => {
  let { accessToken } = getContext()
  accessToken = accessToken as string
  return await service.createPost(
    accessToken,
    title,
    content,
    categoryName,
    thumbnail
  )
}
export const onUpdatePost: ci.OnUpdatePost = async (
  id: number,
  title: string,
  content: string,
  categoryName: string,
  thumbnail: string,
  published: boolean
) => {
  let { accessToken } = getContext()
  accessToken = accessToken as string
  return await service.updatePost(
    accessToken,
    id,
    title,
    content,
    categoryName,
    thumbnail,
    published
  )
}

export const onDeletePost: ci.OnDeletePost = async (id: number) => {
  let { accessToken } = getContext()
  accessToken = accessToken as string
  return await service.deletePost(accessToken, id)
}

export const onLoadCategoryList: ci.OnLoadCategoryList =
  service.loadCategoryList
export const onCreateCategory: ci.OnCreateCategory = async (
  categoryName: string
) => {
  let { accessToken } = getContext()
  accessToken = accessToken as string
  return await service.createCategory(accessToken, categoryName)
}
export const onLoadMaxPageIndexByCategory: ci.OnLoadMaxPageIndexByCategory =
  service.loadMaxPageIndexByCategory
