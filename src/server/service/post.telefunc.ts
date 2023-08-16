import { Post } from '@prisma/client'
import { repository as repo } from 'server/repository'
import { storage as sto } from 'server/storage'
import { ErrorMessage } from 'server/types/error'
import { getContext } from 'telefunc'
import { checkAccessToken } from 'server/utils/auth'

export const onLoadPresignedUrl = async (filename: string) => {
  return await sto.getPresignedUrl(filename)
}

export const onLoadPresignedUrlPutObject = async (
  filename: string
): Promise<string> => {
  return await sto.getPresignedUrlPutObject(filename)
}

export const onLoadPostListPageSortByDate = async (
  pageSize: number,
  pageIdx: number,
  published: boolean
) => {
  return await repo.getPostListPageSortByDate(pageSize, pageIdx, published)
}

export const onLoadPostListPageSortByDateByCategory = async (
  pageSize: number,
  pageIdx: number,
  categoryName: string,
  published: boolean
) => {
  if (categoryName === 'ALL') {
    return await repo.getPostListPageSortByDate(pageSize, pageIdx, published)
  }
  return await repo.getPostListPageSortByDateCategory(
    pageSize,
    pageIdx,
    categoryName,
    published
  )
}

type CreatePost = (
  title: string,
  content: string,
  categoryName: string,
  thumbnail: string
) => Promise<Post | ErrorMessage>
export const onCreatePost: CreatePost = async (
  title: string,
  content: string,
  categoryName: string,
  thumbnail: string
) => {
  const { accessToken } = getContext()
  const name = await checkAccessToken(accessToken as string)
  if (name === 'bdg') {
    let post = (await repo.createPost(
      title,
      content,
      categoryName,
      thumbnail
    )) as Post
    return post
  }
  return {
    err: 'You are not authorized to create a post'
  } as ErrorMessage
}

export type UpdatePost = (
  id: number,
  title: string,
  content: string,
  categoryName: string,
  thumbnail: string,
  published: boolean
) => Promise<Post | ErrorMessage>
export const onUpdatePost: UpdatePost = async (
  id: number,
  title: string,
  content: string,
  categoryName: string,
  thumbnail: string,
  published: boolean
) => {
  const { accessToken } = getContext()
  const name = await checkAccessToken(accessToken as string)
  if (name === 'bdg') {
    let post = (await repo.updatePost(
      id,
      title,
      content,
      categoryName,
      thumbnail,
      published
    )) as Post
    return post
  }
  return {
    err: 'You are not authorized to update a post'
  } as ErrorMessage
}

// delete post function
export type DeletePost = (id: number) => Promise<Post | ErrorMessage>
export const onDeletePost: DeletePost = async (id: number) => {
  const { accessToken } = getContext()
  const name = await checkAccessToken(accessToken as string)
  if (name === 'bdg') {
    let post = (await repo.deletePost(id)) as Post
    return post
  }
  return {
    err: 'You are not authorized to delete a post'
  } as ErrorMessage
}

export const onLoadCategoryList: () => Promise<string[]> = async () => {
  const categoryList = repo.getCategoryList()
  return categoryList
}

export const onCreateCategory: (category: string) => Promise<string> = async (
  category: string
) => {
  repo.createCategory(category)
  return category
}

export const onLoadMaxPageIndexByCategory = async (
  pageSize: number,
  category: string,
  published: boolean
) => {
  if (category === 'ALL') {
    return await repo.getMaxPageIndex(pageSize, published)
  }
  return await repo.getMaxPageIndexByCategory(pageSize, category, published)
}
