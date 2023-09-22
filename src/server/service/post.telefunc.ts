import { Post } from '@prisma/client'
import { storage as sto } from 'server/storage'
import { getContext } from 'telefunc'
import repo from 'server/singletonRepository'

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
  return await repo.postRepo.getPostListPageSortByDate(
    pageSize,
    pageIdx,
    published
  )
}

export const onLoadPostListPageSortByDateByCategory = async (
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

type CreatePost = (
  title: string,
  content: string,
  categoryName: string,
  thumbnail: string
) => Promise<Post>
export const onCreatePost: CreatePost = async (
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

export type UpdatePost = (
  id: number,
  title: string,
  content: string,
  categoryName: string,
  thumbnail: string,
  published: boolean
) => Promise<Post>
export const onUpdatePost: UpdatePost = async (
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
export type DeletePost = (id: number) => Promise<Post>
export const onDeletePost: DeletePost = async (id: number) => {
  const { accessToken } = getContext()
  const name = await repo.userRepo.checkAccessToken(accessToken as string)
  if (name === 'bdg') {
    let post = (await repo.postRepo.deletePost(id)) as Post
    return post
  }
  return {} as Post
}

export const onLoadCategoryList: () => Promise<string[]> = async () => {
  const categoryList = repo.postRepo.getCategoryList()
  return categoryList
}

export const onCreateCategory: (category: string) => Promise<string> = async (
  category: string
) => {
  repo.postRepo.createCategory(category)
  return category
}

export const onLoadMaxPageIndexByCategory = async (
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
