// next js post view page

import { Post } from '@prisma/client'
import { Header } from 'components/header'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import PostContent from 'components/post/PostContent'
import styles from './create.module.scss'
import useComponentSize from 'tools/useComponentSize'
import {
  onCreatedPost,
  onLoadPresignedUrlPutObject
} from 'server/service/index.telefunc'

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

  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    console.log(event.clipboardData.getData('text'))
    var items = (event.clipboardData || event.clipboardData).items
    for (const index in items) {
      var item = items[index]
      if (item.kind === 'file') {
        // TODO
        console.log('item', item.kind)
        // 랜덤이미지 이름 생성 - 겹치지 않도록
        // onLoadPresignedUrlPutObject() // 업로드
        // 다운로드용 presinged url 생성 발급
        // 텍스트로 저장
        // 서버에서 post를 다시 로드할 때, presinged url을 탐색해서
        // presinged url을 탐색해서를 갱신하는 로직이 필요함
      }
    }
    event.preventDefault()
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
                onPaste={handlePaste}
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
