import Link from 'next/link'

import { FadeInImage } from 'components/fadeinImage/FadeinImage'
import { Skeleton, Stack } from '@mui/material'
import styles from './PostCard.module.scss'
import { Post } from '@prisma/client'

const getSummary = (content: string) => {
  let summary = content
  if (content.length > 200) {
    summary = content.substring(0, 200)
  }
  return summary
    .replace('#', '')
    .replace('##', '')
    .replace('###', '')
    .replace(/^#\s+(.*)$/gm, '$1')
    .replace(/\*{1,2}(.*?)\*{1,2}/g, '$1')
    .replace(/<bdg-minio=(.*?)\/>/g, '')
}

type PostCardProps = {
  post: Post
  boxWidth: string
  tagUrlMap: Map<string, string>
}

const PostCard = (props: PostCardProps) => {
  const { post, boxWidth, tagUrlMap } = props
  return (
    <Link key={post.id} href={`/post/${post.id}`}>
      <div className={styles.postBox} style={{ width: boxWidth }}>
        <div className={styles.imageBox}>
          {post.thumbnail ? (
            <>
              <div className={styles.imageOverlay} />
              {(tagUrlMap.get(post.thumbnail as string) as string) ? (
                <>
                  <FadeInImage
                    width="0"
                    height="0"
                    sizes="100vw"
                    src={tagUrlMap.get(post.thumbnail as string) as string}
                    alt="thumbnail"
                  />
                </>
              ) : (
                <Stack height={200} width={'100%'}>
                  <Skeleton
                    animation="wave"
                    height={'100%'}
                    width={'100%'}
                    variant="rectangular"
                  />
                </Stack>
              )}
            </>
          ) : (
            <>
              <div className={styles.imageOverlay} />
              <div className={styles.defaultThumbnail}>{post.categoryName}</div>
            </>
          )}
        </div>
        <div className={styles.textBox}>
          <h4>{post.title}</h4>
          <span>{getSummary(post.content || '')}</span>
        </div>
      </div>
    </Link>
  )
}

export default PostCard
