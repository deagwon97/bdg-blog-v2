import { getContext } from 'telefunc'
import service from 'server/diContainer'
import * as ci from 'server/service/controlInterface'

export const onConnect: ci.OnConnect = service.Connect
export const onLoadUser: ci.OnLoadUser = service.LoadUser
export const onLogin: ci.OnLogin = service.Login
export const onLoadPresignedUrl: ci.OnLoadPresignedUrl =
  service.LoadPresignedUrl
export const onLoadPresignedUrlPutObject: ci.OnLoadPresignedUrlPutObject =
  service.LoadPresignedUrlPutObject
export const onLoadPostListPageSortByDate: ci.OnLoadPostListPageSortByDate =
  service.LoadPostListPageSortByDate
export const onLoadPostListPageSortByDateByCategory: ci.OnLoadPostListPageSortByDateByCategory =
  service.LoadPostListPageSortByDateByCategory
export const onCreatePost: ci.OnCreatePost = async (
  title: string,
  content: string,
  categoryName: string,
  thumbnail: string
) => {
  let { accessToken } = getContext()
  accessToken = accessToken as string
  return await service.CreatePost(
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
  return await service.UpdatePost(
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
  return await service.DeletePost(accessToken, id)
}

export const onLoadCategoryList: ci.OnLoadCategoryList =
  service.LoadCategoryList
export const onCreateCategory: ci.OnCreateCategory = async (
  categoryName: string
) => {
  let { accessToken } = getContext()
  accessToken = accessToken as string
  return await service.CreateCategory(accessToken, categoryName)
}
export const onLoadMaxPageIndexByCategory: ci.OnLoadMaxPageIndexByCategory =
  service.LoadMaxPageIndexByCategory
