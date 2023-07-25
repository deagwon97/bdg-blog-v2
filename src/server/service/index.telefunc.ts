import {
  onCreateCategory,
  onCreatedPost,
  onDeletePost,
  onLoadPostListPageSortByDate,
  onLoadPostListPageSortByDateByCategory,
  onLoadCategoryList,
  onLoadMaxPageIndexByCategory
} from './post.telefunc'
export {
  onCreateCategory,
  onCreatedPost,
  onDeletePost,
  onLoadPostListPageSortByDate,
  onLoadPostListPageSortByDateByCategory,
  onLoadCategoryList,
  onLoadMaxPageIndexByCategory
}

import { onLogin, onLoadUser } from './user.telefunc'
export { onLogin, onLoadUser }

import {
  onLoadPresignedUrl,
  onLoadPresignedUrlPutObject
} from './post.telefunc'
export { onLoadPresignedUrl, onLoadPresignedUrlPutObject }

export const onConnect: () => Promise<string> = async () => {
  console.log('connect!!!!!!')
  return 'connected'
}
