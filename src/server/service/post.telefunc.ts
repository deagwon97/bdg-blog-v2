import { Post } from '@prisma/client'
import {
  GetPostListPageSortByDate,
  getPostListPageSortByDate,
  createPost,
  deletePost
} from 'server/repository/post'
import { ErrorMessage } from 'server/types/error'
import { getContext } from 'telefunc'

export const onLoadPostListPageSortByDate: GetPostListPageSortByDate = async (
  pageSize: number,
  pageIdx: number
) => {
  return getPostListPageSortByDate(pageSize, pageIdx)
}

type CreatePost = (
  title: string,
  content: string
) => Promise<Post | ErrorMessage>
export const onCreatedPost: CreatePost = async (
  title: string,
  content: string
) => {
  const { userId } = getContext()
  if (userId === 1) {
    let post = (await createPost(title, content)) as Post
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
