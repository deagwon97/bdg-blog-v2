// next js post view page
import { Post } from '@prisma/client'
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
import { CategoryDropDown } from 'components/dropdown'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { Box, Modal } from '@mui/material'
import Image from 'next/image'

import { IApi, TYPES } from 'apiClient/interface'
import useApi from 'context/hook'

export default function PostCreatePage() {
  useEffect(() => {
    window.scroll({ top: 0, left: 0, behavior: 'smooth' })
  })
  const api = useApi<IApi>(TYPES.Api)
  const [post, setPost] = useState<Post>({
    id: 0,
    title: '',
    uriTitle: '',
    content: '',
    categoryName: '기타',
    thumbnail: '',
    createdAt: null,
    updatedAt: null,
    published: true
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

  const [cursorPosition, setCursorPosition] = useState<number>(0)
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.selectionStart = cursorPosition
      contentRef.current.selectionEnd = cursorPosition
    }
  }, [cursorPosition])

  const handlePaste = async (
    event: React.ClipboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.clipboardData.files.length < 1) {
      return
    }
    Array.from(event.clipboardData.files).forEach(async (file: File) => {
      if (file.type.startsWith('image/')) {
        const uid = uuidv4()
        const presignedUrlPutObject = await api.onLoadPresignedUrlPutObject(uid) // 업로드

        const res = await axios({
          method: 'put',
          url: presignedUrlPutObject,
          data: file
        })

        if (res.status === 200) {
          const cursorPosition = contentRef.current?.selectionStart as number
          const bdgMinioTag = `\n<img alt="image" src="https://${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET_NAME}/${uid}"/>\n`
          setPost({
            ...post,
            content:
              post.content?.slice(0, cursorPosition as number) +
              bdgMinioTag +
              post.content?.slice((cursorPosition as number) + 1)
          })
          setCursorPosition((cursorPosition + bdgMinioTag.length) as number)
        }
      }
    })
  }

  const loadCategoryList = useCallback(async () => {
    const categoryList = await api.onLoadCategoryList()
    setCategoryList(categoryList)
  }, [])

  useEffect(() => {
    loadCategoryList()
  }, [loadCategoryList])

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [imageList, setImageList] = useState<string[][]>([])
  const getImageList = (content: string): string[][] => {
    const regex = new RegExp(
      `<img alt="image" src="https://${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET_NAME}/(.*?)"\\/?>`,
      'g'
    )

    const imageTagList = content.match(regex) as string[]
    if (imageTagList === null) return []
    const imageList = imageTagList.map((tag) => {
      const fileUid = tag.replace(regex, '$1')
      const url = `https://${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET_NAME}/${fileUid}`
      return [url, fileUid]
    })
    return imageList
  }

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: '90%',
    overflow: 'scroll',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius: '10px',
    boxShadow: 24,
    p: 4
  }

  const savePost = async (thumbnailUid: string) => {
    if (post.categoryName === '+') {
      await api.onCreateCategory(newCategory)
    }
    const res = await api.onCreatePost(
      post.title,
      post.content || '',
      post.categoryName === '+' ? newCategory : post.categoryName,
      (post.thumbnail = thumbnailUid),
      post.published
    )

    window.location.href = '/'
  }

  return (
    <>
      <div className={styles.background} ref={ref}>
        <br />
        <div className={styles.container}>
          <div className={styles.titleWithSave}>
            <textarea
              placeholder="제목을 입력하세요..."
              rows={1}
              ref={titleRef}
              onChange={onHandler}
            />
            <div
              className={styles.saveButton}
              onClick={() => {
                setPost({ ...post, published: !post.published })
              }}>
              {post.published ? '공개' : '비공개'}
            </div>
            <div
              className={styles.saveButton}
              onClick={async () => {
                post.content
                const imageList = getImageList(post.content || '')
                setImageList(imageList)
                if (imageList.length < 1) {
                  await savePost('')
                  return
                }
                handleOpen()
              }}>
              저장하기
            </div>
          </div>

          <CategoryDropDown
            value={'기타'}
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

          <br />
        </div>
      </div>
      <Modal className={styles.modal} open={open} onClose={handleClose}>
        <Box sx={style}>
          <div className={styles.modalBackground}>
            <div className={styles.modalImageContainer}>
              <h3>썸네일 이미지 선택</h3>
              {imageList.map((image) => {
                const [url, fileUid] = image
                return (
                  <div
                    key={fileUid}
                    className={styles.modalImage}
                    onClick={async () => {
                      await savePost(fileUid)
                    }}>
                    <Image alt="postImage" src={url} width={300} height={300} />
                  </div>
                )
              })}
            </div>
          </div>
        </Box>
      </Modal>
    </>
  )
}
