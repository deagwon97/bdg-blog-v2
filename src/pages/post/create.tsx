// next js post view page

import { Post } from '@prisma/client'
import { Header } from 'components/header'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import PostContent from 'components/post/PostContent'
import styles from './create.module.scss'
import useComponentSize from 'tools/useComponentSize'
import { onCreatedPost } from 'server/service/index.telefunc'

export default function PostCreatePage() {
  useEffect(() => {
    window.scroll({ top: 0, left: 0, behavior: 'smooth' })
  })
  const [post, setPost] = useState<Post>({
    id: 0,
    title: '',
    content: '',
    summary: '',
    createdAt: null,
    updatedAt: null,
    published: false
  })

  const titleRef = useRef<HTMLTextAreaElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)

  let ref = useRef() as MutableRefObject<HTMLInputElement>
  let size = useComponentSize(ref)

  const onHandler = () => {
    if (titleRef.current && contentRef.current) {
      setPost({
        ...post,
        title: titleRef.current.value,
        content: contentRef.current.value
      })
    }
  }

  return (
    <>
      <Header isMain={false} />
      <div className={styles.background} ref={ref}>
        <br />

        <div className={styles.container}>
          <textarea
            placeholder="제목을 입력하세요..."
            rows={1}
            ref={titleRef}
            onChange={onHandler}
          />
          <hr />
          <div className={styles.displayRow}>
            <div className={styles.createBox}>
              <textarea
                className={styles.edit}
                placeholder="내용을 입력하세요..."
                ref={contentRef}
                onChange={onHandler}
              />
            </div>

            {size.width > 800 && (
              <div className={styles.contentBox}>
                <PostContent post={post} />
              </div>
            )}
          </div>
          {size.width > 800 && (
            <div>
              <div
                onClick={() => {
                  onCreatedPost(post.title, post.content || '')
                }}
                className={styles.saveButton}>
                저장하기
              </div>
            </div>
          )}
          <br />
        </div>
      </div>
    </>
  )
}
