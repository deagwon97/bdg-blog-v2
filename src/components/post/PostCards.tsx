import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import Image from 'next/image'
import { Prisma } from '@prisma/client'
import styles from './PostCards.module.scss'
import chevron from 'assets/common/chevron-right.svg'
import leftArrow from 'assets/common/left-arrow.svg'
import rightArrow from 'assets/common/right-arrow.svg'
import doubbleLeftArrow from 'assets/common/double-left-arrow.svg'
import doubbleRightArrow from 'assets/common/double-right-arrow.svg'
import useComponentSize from 'tools/useComponentSize'
import Link from 'next/link'
import * as service from 'server/service/index.telefunc'
import { FadeInImage } from 'components/fadeinImage/FadeinImage'
import { Skeleton, Stack } from '@mui/material'

type Post = Prisma.PostGetPayload<{}>
type PostProps = {
  category: string
  posts: Post[]
  maxPageIdx: number
}
const PostCards: React.FC<PostProps> = (props) => {
  // 모바일 여부
  const [isMobile, setIsMobile] = useState(false)
  const [boxWidth, setBoxWidth] = useState('380px')

  // 페이지당 포스트 개수
  const pageSize = 6
  // 페이징 버튼 개수
  let buttonCount = 5

  const maxPageIdx = props.maxPageIdx

  if (maxPageIdx < buttonCount) {
    buttonCount = maxPageIdx
  }

  // 마지막 버튼 그룹의 첫번째 버튼 인덱스
  const lastFirstButtonIdx =
    Math.floor(maxPageIdx / buttonCount) * buttonCount + 1
  // 마지막 버튼 그룹의 버튼 개수
  const lastButtonCount = maxPageIdx % buttonCount

  const [currentButtonCount, setCurrentButtonCount] = useState(buttonCount)
  const [currentPageIdx, setCurrentPageIdx] = useState(1)
  const [firstButtonIdx, setFirstButtonIdx] = useState(1)
  const [posts, setPosts] = useState<Post[]>([])
  const [postsWithImage, setPostsWithImage] = useState<Post[]>([])
  const [tagUrlMap, setTagUrlMap] = useState<Map<string, string>>(new Map())

  let ref = useRef() as MutableRefObject<HTMLInputElement>
  let size = useComponentSize(ref)

  useEffect(() => {
    setBoxWidth(size.width === 800 ? '380px' : '-webkit-fill-available')
    setIsMobile(size.width === 800 ? false : true)
  }, [size])

  useEffect(function mount() {
    function onScroll() {
      if (typeof window !== 'undefined') {
        if (isMobile) {
          const cardHeight = 170
          const baseY = 70 - cardHeight
          if (window.scrollY > baseY + pageSize * cardHeight * currentPageIdx) {
            let newPageIdx = currentPageIdx + 1
            setCurrentPageIdx(newPageIdx)
            service
              .onLoadPostListPageSortByDateByCategory(
                pageSize,
                newPageIdx,
                props.category
              )
              .then((res) => {
                setPosts((prev) => [...prev, ...res])
              })
          }
        }
      }
    }
    window.addEventListener('scroll', onScroll)
    return function unMount() {
      window.removeEventListener('scroll', onScroll)
    }
  })

  const getImageUrl = async (imageTag: string) => {
    const imageUID = imageTag.replace('<bdg-minio=', '').replace('/>', '')
    if (imageUID === null || imageUID === undefined || imageUID === '') {
      return ''
    }
    const presignedUrl = await service.onLoadPresignedUrl(imageUID)
    return presignedUrl
  }

  const handlePageChange = (pageIdx: number) => {
    if (pageIdx < 1) {
      pageIdx = 1
    } else if (pageIdx > maxPageIdx) {
      pageIdx = maxPageIdx
    }
    setCurrentPageIdx(pageIdx)
  }

  useEffect(() => {
    setCurrentPageIdx(1)
  }, [isMobile])

  useEffect(() => {
    if (!isMobile) {
      setFirstButtonIdx(
        Math.floor((currentPageIdx - 1) / buttonCount) * buttonCount + 1
      )
      if (currentPageIdx >= lastFirstButtonIdx) {
        setCurrentButtonCount(lastButtonCount)
      } else {
        setCurrentButtonCount(buttonCount)
      }
      service
        .onLoadPostListPageSortByDateByCategory(
          pageSize,
          currentPageIdx,
          props.category
        )
        .then((res) => {
          setPosts(res)
        })
    }
  }, [
    props.category,
    currentPageIdx,
    lastFirstButtonIdx,
    lastButtonCount,
    buttonCount,
    isMobile
  ])

  const updateTagUrlMap = useCallback(async (posts: Post[]) => {
    const newTagUrlMap = new Map()
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i]
      if (post.thumbnail === '') continue
      const imageTag = post.thumbnail as string
      const imageUrl = await getImageUrl(imageTag)
      newTagUrlMap.set(imageTag, imageUrl)
    }
    setTagUrlMap(newTagUrlMap)
  }, [])

  useEffect(() => {
    updateTagUrlMap(posts)
  }, [updateTagUrlMap, posts])

  useEffect(() => {
    setCurrentPageIdx(1)
    setFirstButtonIdx(1)
  }, [props.category])

  useEffect(() => {
    setPostsWithImage(posts)
  }, [posts])

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

  return (
    <div>
      <div className={styles.postHead}>
        <span>{props.category}</span>
        <Image alt="right" src={chevron} />
      </div>
      <div className={styles.postContainer} ref={ref}>
        <div>
          {postsWithImage &&
            postsWithImage.map((post) => {
              return (
                <Link key={post.id} href={`/post/${post.id}`}>
                  <div className={styles.postBox} style={{ width: boxWidth }}>
                    <div className={styles.imageBox}>
                      {post.thumbnail ? (
                        <>
                          <div className={styles.imageOverlay} />
                          {(tagUrlMap.get(
                            post.thumbnail as string
                          ) as string) ? (
                            <>
                              <FadeInImage
                                width={100}
                                height={200}
                                src={
                                  tagUrlMap.get(
                                    post.thumbnail as string
                                  ) as string
                                }
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
                          <div className={styles.defaultThumbnail}>
                            {post.categoryName}
                          </div>
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
            })}
        </div>
      </div>
      {!isMobile && (
        <div className={styles.pagination}>
          <div
            className={
              currentPageIdx === 1 ? styles.disabledButton : styles.button
            }
            onClick={() => handlePageChange(1)}>
            <Image
              // placeholder="blur"
              alt="doubbleLeftArrow"
              className={styles.img}
              src={doubbleLeftArrow}
            />
          </div>
          <div
            className={
              currentPageIdx === 1 ? styles.disabledButton : styles.button
            }
            onClick={() =>
              handlePageChange(currentPageIdx - 1 <= 1 ? 1 : currentPageIdx - 1)
            }>
            <Image
              // placeholder="blur"
              alt="leftArrow"
              className={styles.img}
              src={leftArrow}
            />
          </div>

          {currentButtonCount > 0 &&
            Array.from(Array(currentButtonCount).keys()).map((buttonIdx) => {
              return currentPageIdx === firstButtonIdx + buttonIdx ? (
                <div
                  key={firstButtonIdx + buttonIdx}
                  onClick={() => handlePageChange(firstButtonIdx + buttonIdx)}
                  className={styles.selectedButton}>
                  {firstButtonIdx + buttonIdx}
                </div>
              ) : (
                <div
                  key={firstButtonIdx + buttonIdx}
                  onClick={() => handlePageChange(firstButtonIdx + buttonIdx)}
                  className={styles.button}>
                  {firstButtonIdx + buttonIdx}
                </div>
              )
            })}
          <div
            className={
              currentPageIdx >= maxPageIdx
                ? styles.disabledButton
                : styles.button
            }
            onClick={() =>
              handlePageChange(
                currentPageIdx + 1 > maxPageIdx
                  ? maxPageIdx
                  : currentPageIdx + 1
              )
            }>
            <Image
              // placeholder="blur"
              alt="rightArrow"
              className={styles.img}
              src={rightArrow}
            />
          </div>
          <div
            className={
              currentPageIdx >= maxPageIdx
                ? styles.disabledButton
                : styles.button
            }
            onClick={() => handlePageChange(maxPageIdx)}>
            <Image
              // placeholder="blur"
              alt="doubbleRightArrow"
              className={styles.img}
              src={doubbleRightArrow}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default PostCards
