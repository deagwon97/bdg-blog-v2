import {
  GetPostListPageSortByDate,
  getPostListPageSortByDate
} from 'server/repository/post'

export const onLoadPostListPageSortByDate: GetPostListPageSortByDate = async (
  pageSize: number,
  pageIdx: number
) => {
  return getPostListPageSortByDate(pageSize, pageIdx)
}
