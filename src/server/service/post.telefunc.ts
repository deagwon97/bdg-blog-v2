import { Post } from '@prisma/client'
import {
  GetPostListPageSortByDate,
  getPostListPageSortByDate,
  createPost,
  deletePost,
  getCategoryList,
  createCategory,
  getPostListPageSortByDateCategory,
  getMaxPageIndexByCategory,
  getMaxPageIndex
} from 'server/repository/post'
import { GetUser, getUser } from 'server/repository/user'
import { ErrorMessage } from 'server/types/error'
import { getContext } from 'telefunc'
import {
  getPresignedUrl,
  GetPresignedUrl,
  getPresignedUrlPutObject
} from 'server/storage/file'

import { checkAccessToken } from 'server/utils/auth'

export const onLoadPresignedUrl: GetPresignedUrl = async (filename: string) => {
  return await getPresignedUrl(filename)
}

export const onLoadPresignedUrlPutObject = async (
  filename: string
): Promise<string> => {
  return await getPresignedUrlPutObject(filename)
}

export const onLoadPostListPageSortByDate: GetPostListPageSortByDate = async (
  pageSize: number,
  pageIdx: number
) => {
  return await getPostListPageSortByDate(pageSize, pageIdx)
}

export const onLoadPostListPageSortByDateByCategory = async (
  pageSize: number,
  pageIdx: number,
  categoryName: string
) => {
  if (categoryName === 'ALL') {
    return await getPostListPageSortByDate(pageSize, pageIdx)
  }
  return await getPostListPageSortByDateCategory(
    pageSize,
    pageIdx,
    categoryName
  )
}

type CreatePost = (
  title: string,
  content: string,
  categoryName: string,
  thumbnail: string
) => Promise<Post | ErrorMessage>
export const onCreatedPost: CreatePost = async (
  title: string,
  content: string,
  categoryName: string,
  thumbnail: string
) => {
  const { accessToken } = getContext()
  const name = await checkAccessToken(accessToken as string)
  if (name === 'bdg') {
    let post = (await createPost(
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

// delete post function
export type DeletePost = (id: number) => Promise<Post | ErrorMessage>
export const onDeletePost: DeletePost = async (id: number) => {
  const { accessToken } = getContext()
  const name = await checkAccessToken(accessToken as string)
  if (name === 'bdg') {
    let post = (await deletePost(id)) as Post
    return post
  }
  return {
    err: 'You are not authorized to delete a post'
  } as ErrorMessage
}

import { getUserByEmail, isValidPassword } from 'server/repository/user'
import { LoginResult } from 'server/types/user'
import { generateAccessToken, generateRefreshToken } from 'server/utils/auth'

export const onLoadUser: GetUser = async (id: number) => {
  return getUser(id)
}

export type PostLogin = (
  email: string,
  password: string
) => Promise<LoginResult>

export const onLogin: PostLogin = async (email: string, password: string) => {
  let user = await getUserByEmail(email)
  if (!user) {
    return {
      valid: false,
      errMessage: 'user not exist',
      id: 0,
      name: '',
      accessToken: '',
      refreshToken: ''
    }
  }
  let validPassword = await isValidPassword(email, password)
  if (!validPassword) {
    return {
      valid: false,
      errMessage: 'Invalid password',
      id: 0,
      name: '',
      accessToken: '',
      refreshToken: ''
    }
  }
  let accessToken = generateAccessToken(user.name)
  let refreshToken = generateRefreshToken(user.name)
  return {
    valid: true,
    errMessage: '',
    id: user.id,
    name: user.name,
    accessToken: accessToken,
    refreshToken: refreshToken
  }
}

export const onLoadCategoryList: () => Promise<string[]> = async () => {
  const categoryList = getCategoryList()
  return categoryList
}

export const onCreateCategory: (category: string) => Promise<string> = async (
  category: string
) => {
  createCategory(category)
  return category
}

export const onLoadMaxPageIndexByCategory = async (
  pageSize: number,
  category: string
) => {
  if (category === 'ALL') {
    return await getMaxPageIndex(pageSize)
  }
  return await getMaxPageIndexByCategory(pageSize, category)
}
