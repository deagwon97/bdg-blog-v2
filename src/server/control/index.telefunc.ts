import { getContext } from 'telefunc'
import service from 'server/diContainer'

export const onConnect = service.onConnect
export const onLoadUser = service.onLoadUser
export const onLogin = service.onLogin
export const onLoadPresignedUrl = service.onLoadPresignedUrl
export const onLoadPresignedUrlPutObject = service.onLoadPresignedUrlPutObject
export const onLoadPostListPageSortByDate = service.onLoadPostListPageSortByDate
export const onLoadPostListPageSortByDateByCategory =
  service.onLoadPostListPageSortByDateByCategory
export const onCreatePost = async (
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
export const onUpdatePost = async (
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

export const onDeletePost = async (id: number) => {
  let { accessToken } = getContext()
  accessToken = accessToken as string
  return await service.onDeletePost(accessToken, id)
}

export const onLoadCategoryList = service.onLoadCategoryList
export const onCreateCategory = async (categoryName: string) => {
  let { accessToken } = getContext()
  accessToken = accessToken as string
  return await service.onCreateCategory(accessToken, categoryName)
}
export const onLoadMaxPageIndexByCategory = service.onLoadMaxPageIndexByCategory
