import { getContext } from 'telefunc'
import service from 'server/diContainer'
import * as ci from 'server/service/controlInterface'

export const onConnect: ci.onConnect = service.onConnect
export const onLoadUser: ci.onLoadUser = service.onLoadUser
export const onLogin: ci.onLogin = service.onLogin
export const onLoadPresignedUrl: ci.onLoadPresignedUrl =
  service.onLoadPresignedUrl
export const onLoadPresignedUrlPutObject: ci.onLoadPresignedUrlPutObject =
  service.onLoadPresignedUrlPutObject
export const onLoadPostListPageSortByDate: ci.onLoadPostListPageSortByDate =
  service.onLoadPostListPageSortByDate
export const onLoadPostListPageSortByDateByCategory: ci.onLoadPostListPageSortByDateByCategory =
  service.onLoadPostListPageSortByDateByCategory
export const onCreatePost: ci.onCreatePost = async (
  title: string,
  content: string,
  categoryName: string,
  thumbnail: string
) => {
  let { accessToken } = getContext()
  accessToken = accessToken as string
  return await service.onCreatePost(
    accessToken,
    title,
    content,
    categoryName,
    thumbnail
  )
}
export const onUpdatePost: ci.onUpdatePost = async (
  id: number,
  title: string,
  content: string,
  categoryName: string,
  thumbnail: string,
  published: boolean
) => {
  let { accessToken } = getContext()
  accessToken = accessToken as string
  return await service.onUpdatePost(
    accessToken,
    id,
    title,
    content,
    categoryName,
    thumbnail,
    published
  )
}

export const onDeletePost: ci.onDeletePost = async (id: number) => {
  let { accessToken } = getContext()
  accessToken = accessToken as string
  return await service.onDeletePost(accessToken, id)
}

export const onLoadCategoryList: ci.onLoadCategoryList =
  service.onLoadCategoryList
export const onCreateCategory: ci.onCreateCategory = async (
  categoryName: string
) => {
  let { accessToken } = getContext()
  accessToken = accessToken as string
  return await service.onCreateCategory(accessToken, categoryName)
}
export const onLoadMaxPageIndexByCategory: ci.onLoadMaxPageIndexByCategory =
  service.onLoadMaxPageIndexByCategory
