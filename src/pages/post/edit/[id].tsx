import { Post } from '@prisma/client'
import { Header } from 'components/header'
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import PostContent from 'components/post/PostContent'
import styles from './edit.module.scss'
import useComponentSize from 'tools/useComponentSize'

import { CategoryDropDown } from 'components/dropdown'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { Box, Modal } from '@mui/material'
import Image from 'next/image'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { repository as repo } from 'server/diContainer'

import { IApi, TYPES } from 'apiClient/interface'
import useApi from 'context/hook'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query
  const postId = parseInt(id as string)
  let oldPost = (await repo.postRepo.getPost(postId)) as Post
  oldPost = JSON.parse(JSON.stringify(oldPost))
  return {
    props: { oldPost }
  }
}

export default function PostEditPage({
  oldPost
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  useEffect(() => {
    window.scroll({ top: 0, left: 0, behavior: 'smooth' })
  })
  const [post, setPost] = useState<Post>(oldPost)
  const [categoryList, setCategoryList] = useState<string[]>([])

  const titleRef = useRef<HTMLTextAreaElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const [newCategory, setNewCategory] = useState<string>('')

  let ref = useRef() as MutableRefObject<HTMLInputElement>
  let size = useComponentSize(ref)

  const api = useApi<IApi>(TYPES.Api)

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
          const bdgMinioTag = `\n<bdg-minio=${uid}/>\n`
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
  const getImageList = async (content: string): Promise<string[][]> => {
    const tagList = content.match(/<bdg-minio=(.*?)\/>/g) as string[]
    if (tagList === null) return []
    const imageList = await Promise.all(
      tagList.map(async (tag) => {
        const fileUID = tag.replace('<bdg-minio=', '').replace('/>', '')
        const url = await api.onLoadPresignedUrl(fileUID)
        return [tag, url]
      })
    )
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

  const savePost = async (imageTag: string) => {
    if (post.categoryName === '+') {
      await api.onCreateCategory(newCategory)
    }
    const res = await api.onUpdatePost(
      post.id,
      post.title,
      post.content || '',
      post.categoryName === '+' ? newCategory : post.categoryName,
      (post.thumbnail = imageTag),
      post.published
    )

    window.location.href = '/'
  }

  return (
    <>
      <Header />
      <div className={styles.background} ref={ref}>
        <br />
        <div className={styles.container}>
          <div className={styles.titleWithSave}>
            <textarea
              placeholder="제목을 입력하세요..."
              rows={1}
              ref={titleRef}
              defaultValue={post.title}
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
                const imageList = await getImageList(post.content || '')
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
            value={post.categoryName}
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
              {imageList.map((tagImage) => {
                const [tag, image] = tagImage
                return (
                  <div
                    key={tag}
                    className={styles.modalImage}
                    onClick={async () => {
                      await savePost(tag)
                    }}>
                    <Image
                      alt="postImage"
                      src={image}
                      width={300}
                      height={300}
                    />
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
