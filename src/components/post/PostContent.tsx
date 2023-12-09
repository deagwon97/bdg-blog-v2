import React from 'react'
import { Prisma } from '@prisma/client'
import styles from './PostContent.module.scss'
import PostMarkdown from './PostView'

type Post = Prisma.PostGetPayload<{}>
type Props = {
  post: Post
}
const PostContent: React.FunctionComponent<Props> = (props) => {
  return (
    <div className="markdown-body">
      <div className={styles.postContainer}>
        <h2>{props.post.title}</h2>
        {props.post.createdAt && (
          <div className={styles.createdAt}>
            {props.post.createdAt.toString()}
          </div>
        )}
        <PostMarkdown
          content={props.post.content === null ? '' : props.post.content}
        />
      </div>
    </div>
  )
}

export default PostContent
