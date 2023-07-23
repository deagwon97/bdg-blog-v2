// next js post view page

import { Post, Category } from '@prisma/client'
import { Header } from 'components/header'
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import PostContent from 'components/post/PostContent'
import styles from './create.module.scss'
import useComponentSize from 'tools/useComponentSize'
import {
  onCreateCategory,
  onCreatedPost,
  onLoadCategoryList,
  onLoadPresignedUrl,
  onLoadPresignedUrlPutObject
} from 'server/service/index.telefunc'
import { CategoryDropDown } from 'components/dropdown'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

export default function PostCreatePage() {
  useEffect(() => {
    window.scroll({ top: 0, left: 0, behavior: 'smooth' })
  })
  const [post, setPost] = useState<Post>({
    id: 0,
    title: '',
    content: '',
    categoryName: '',
    summary: '',
    createdAt: null,
    updatedAt: null,
    published: false
  })
  const [categoryList, setCategoryList] = useState<string[]>([])

  const titleRef = useRef<HTMLTextAreaElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const [newCategory, setNewCategory] = useState<string>('')

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

  const handlePaste = async (
    event: React.ClipboardEvent<HTMLTextAreaElement>
  ) => {
    // console.log(event.clipboardData.getData('text'))
    if (event.clipboardData.files.length < 1) {
      return
    }
    Array.from(event.clipboardData.files).forEach(async (file: File) => {
      console.log(file)
      if (file.type.startsWith('image/')) {
        // For images, create an image and append it to the `body`.
        const uid = uuidv4()
        const presignedUrlPutObject = await onLoadPresignedUrlPutObject(uid) // 업로드
        console.log('upload to ', presignedUrlPutObject)
        const res = await axios({
          method: 'put',
          url: presignedUrlPutObject,
          data: file
        })
        const imageUrl = await onLoadPresignedUrl(uid)
        if (imageUrl !== '') {
          const cursorPosition = contentRef.current?.selectionStart as number
          const imageTag = `\n<img alt='${file.name}' src='${imageUrl}'/>\n`

          setPost({
            ...post,
            content:
              post.content?.slice(0, cursorPosition as number) +
              imageTag +
              post.content?.slice((cursorPosition as number) + 1)
          })

          if (contentRef.current) {
            contentRef.current.selectionStart = cursorPosition + imageTag.length
            contentRef.current.selectionEnd = cursorPosition + imageTag.length
          }

          event.preventDefault()
          console.log('image url', imageUrl)
          console.log('cursorPosition', cursorPosition + imageTag.length)
        }
        // todo
        // 서버에서 post를 다시 로드할 때, presinged url을 탐색해서
        // presinged url을 탐색해서를 갱신하는 로직이 필요함 !!
      }
    })
  }

  const loadCategoryList = useCallback(async () => {
    const categoryList = await onLoadCategoryList()
    setCategoryList(categoryList)
  }, [])

  useEffect(() => {
    loadCategoryList()
  }, [loadCategoryList])

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

          <CategoryDropDown
            value={'React'}
            handler={(value: string) => {
              setPost({ ...post, categoryName: value })
            }}
            updateNewCategory={(value: string) => setNewCategory(value)}
            categoryList={categoryList}
          />

          <div className={styles.displayRow}>
            <div className={styles.createBox}>
              <textarea
                className={styles.edit}
                placeholder="내용을 입력하세요..."
                ref={contentRef}
                value={post.content || ''}
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
                onClick={async () => {
                  if (post.categoryName === '+') {
                    await onCreateCategory(newCategory)
                  }
                  const res = await onCreatedPost(
                    post.title,
                    post.content || '',
                    post.categoryName === '+' ? newCategory : post.categoryName
                  )
                  console.log(res)
                  window.location.href = '/'
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
