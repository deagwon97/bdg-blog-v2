import {
  GetPostListPageSortByDate,
  getPostListPageSortByDate,
  createPost,
  CreatePost
} from 'server/repository/post'
import { getContext } from 'telefunc'

export const onLoadPostListPageSortByDate: GetPostListPageSortByDate = async (
  pageSize: number,
  pageIdx: number
) => {
  return getPostListPageSortByDate(pageSize, pageIdx)
}

export const onCreatedPost: CreatePost = async (
  title: string,
  content: string
) => {
  const { loginResult } = getContext()
  console.log('loginResult', loginResult?.accessToken)
  return createPost(title, content)
}
