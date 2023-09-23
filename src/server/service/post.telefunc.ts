import { Post } from '@prisma/client'
import { getContext } from 'telefunc'
import repo from 'server/diContainer/repository'
import sto from 'server/diContainer/storage'
import * as IApi from 'apiClient/interface'

export const onLoadPresignedUrl: IApi.OnLoadPresignedUrl = async (
  filename: string
) => {
  return await sto.getPresignedUrl(filename)
}

export const onLoadPresignedUrlPutObject: IApi.OnLoadPresignedUrlPutObject =
  async (filename: string) => {
    return await sto.getPresignedUrlPutObject(filename)
  }

export const onLoadPostListPageSortByDate = async (
  pageSize: number,
  pageIdx: number,
  published: boolean
) => {
  return await repo.postRepo.getPostListPageSortByDate(
    pageSize,
    pageIdx,
    published
  )
}

export const onLoadPostListPageSortByDateByCategory: IApi.OnLoadPostListPageSortByDateByCategory =
  async (
    pageSize: number,
    pageIdx: number,
    categoryName: string,
    published: boolean,
    searchKeyword: string
  ) => {
    if (categoryName === '') {
      return await repo.postRepo.getPostListPageSortByDateCategory(
        pageSize,
        pageIdx,
        categoryName,
        published,
        searchKeyword
      )
    }
    return await repo.postRepo.getPostListPageSortByDateCategory(
      pageSize,
      pageIdx,
      categoryName,
      published,
      searchKeyword
    )
  }

export const onCreatePost: IApi.OnCreatePost = async (
  title: string,
  content: string,
  categoryName: string,
  thumbnail: string
) => {
  const { accessToken } = getContext()
  const name = await repo.userRepo.checkAccessToken(accessToken as string)
  if (name === 'bdg') {
    let post = (await repo.postRepo.createPost(
      title,
      content,
      categoryName,
      thumbnail
    )) as Post
    return post
  }
  return {} as Post
}

export const onUpdatePost: IApi.UpdatePost = async (
  id: number,
  title: string,
  content: string,
  categoryName: string,
  thumbnail: string,
  published: boolean
) => {
  const { accessToken } = getContext()
  const name = await repo.userRepo.checkAccessToken(accessToken as string)
  if (name === 'bdg') {
    let post = (await repo.postRepo.updatePost(
      id,
      title,
      content,
      categoryName,
      thumbnail,
      published
    )) as Post
    return post
  }
  return {} as Post
}

// delete post function
export const onDeletePost: IApi.DeletePost = async (id: number) => {
  const { accessToken } = getContext()
  const name = await repo.userRepo.checkAccessToken(accessToken as string)
  if (name === 'bdg') {
    let post = (await repo.postRepo.deletePost(id)) as Post
    return post
  }
  return {} as Post
}

export const onLoadCategoryList: IApi.OnLoadCategoryList = async () => {
  const categoryList = repo.postRepo.getCategoryList()
  return categoryList
}

export const onCreateCategory: IApi.OnCreateCategory = async (
  category: string
) => {
  repo.postRepo.createCategory(category)
  return category
}

export const onLoadMaxPageIndexByCategory: IApi.OnLoadMaxPageIndexByCategory =
  async (
    pageSize: number,
    category: string,
    published: boolean,
    searchKeyword: string
  ) => {
    return await repo.postRepo.getMaxPageIndexByCategory(
      pageSize,
      category,
      published,
      searchKeyword
    )
  }
