import { Post } from '@prisma/client'
import {
  GetPostListPageSortByDate,
  getPostListPageSortByDate,
  createPost,
  deletePost,
  getCategoryList,
  createCategory
} from 'server/repository/post'
import { GetUser, getUser } from 'server/repository/user'
import { ErrorMessage } from 'server/types/error'
import { getContext } from 'telefunc'
import {
  getPresignedUrl,
  GetPresignedUrl,
  getPresignedUrlPutObject
} from 'server/storage/file'

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

type CreatePost = (
  title: string,
  content: string,
  categoryName: string
) => Promise<Post | ErrorMessage>
export const onCreatedPost: CreatePost = async (
  title: string,
  content: string,
  categoryName: string
) => {
  const { userId } = getContext()
  if (userId === 1) {
    let post = (await createPost(title, content, categoryName)) as Post
    return post
  }
  return {
    err: 'You are not authorized to create a post'
  } as ErrorMessage
}

// delete post function
export type DeletePost = (id: number) => Promise<Post | ErrorMessage>
export const onDeletePost: DeletePost = async (id: number) => {
  const { userId } = getContext()
  if (userId === 1) {
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
import { create } from 'domain'

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
      email: '',
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
      email: '',
      accessToken: '',
      refreshToken: ''
    }
  }
  let accessToken = generateAccessToken(user.id)
  let refreshToken = generateRefreshToken(user.id)
  return {
    valid: true,
    errMessage: '',
    id: user.id,
    email: user.email,
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
