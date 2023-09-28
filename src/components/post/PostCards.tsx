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

import leftArrow from 'assets/common/left-arrow.svg'
import rightArrow from 'assets/common/right-arrow.svg'
import doubbleLeftArrow from 'assets/common/double-left-arrow.svg'
import doubbleRightArrow from 'assets/common/double-right-arrow.svg'
import useComponentSize from 'tools/useComponentSize'

import PostCard from 'components/post/PostCard'

// import ContainerContext from 'context/api'
import { IApi, TYPES } from 'apiClient/interface'
import useApi from 'context/hook'

type Post = Prisma.PostGetPayload<{}>

const getImageUrl = async (imageTag: string, api: IApi) => {
  const imageUID = imageTag.replace('<bdg-minio=', '').replace('/>', '')
  if (imageUID === null || imageUID === undefined || imageUID === '') {
    return ''
  }
  const presignedUrl = await api.onLoadPresignedUrl(imageUID)
  return presignedUrl
}

type PostProps = {
  category: string
  posts: Post[]
  maxPageIdx: number
  published: boolean
  searchKeyword: string
}
const PostCards: React.FC<PostProps> = (props) => {
  const [isMobile, setIsMobile] = useState(false) // 모바일 여부
  const [boxWidth, setBoxWidth] = useState('380px') // 포스트 박스 너비
  const pageSize = 4 // 페이지당 포스트 개수
  let buttonCount = 5 // 페이징 버튼 개수
  const maxPageIdx = props.maxPageIdx
  if (maxPageIdx < buttonCount) {
    buttonCount = maxPageIdx
  }

  const api = useApi<IApi>(TYPES.Api)

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
          }
        }
      }
    }
    window.addEventListener('scroll', onScroll)
    return function unMount() {
      window.removeEventListener('scroll', onScroll)
    }
  })

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
    setFirstButtonIdx(
      Math.floor((currentPageIdx - 1) / buttonCount) * buttonCount + 1
    )
    if (currentPageIdx >= lastFirstButtonIdx) {
      setCurrentButtonCount(lastButtonCount)
    } else {
      setCurrentButtonCount(buttonCount)
    }
    api
      .onLoadPostListPageSortByDateByCategory(
        pageSize,
        currentPageIdx,
        props.category,
        props.published,
        props.searchKeyword
      )
      .then((res) => {
        setPosts(res)
      })
  }, [
    props.category,
    lastFirstButtonIdx,
    lastButtonCount,
    buttonCount,
    isMobile,
    props.searchKeyword
  ])

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

      api
        .onLoadPostListPageSortByDateByCategory(
          pageSize,
          currentPageIdx,
          props.category,
          props.published,
          props.searchKeyword
        )
        .then((res) => {
          setPosts(res)
        })
    }
    if (isMobile) {
      api
        .onLoadPostListPageSortByDateByCategory(
          pageSize,
          currentPageIdx,
          props.category,
          props.published,
          props.searchKeyword
        )
        .then((res) => {
          setPosts((prev) => [...prev, ...res])
        })
    }
  }, [currentPageIdx])

  const updateTagUrlMap = useCallback(async (posts: Post[]) => {
    const newTagUrlMap = new Map()
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i]
      if (post.thumbnail === '') continue
      const imageTag = post.thumbnail as string
      const imageUrl = await getImageUrl(imageTag, api)
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
  }, [props.category, props.searchKeyword])

  useEffect(() => {
    setPostsWithImage(posts)
  }, [posts])

  return (
    <div>
      <div className={styles.postContainer} ref={ref}>
        <div>
          {postsWithImage &&
            postsWithImage.map((post, idx) => {
              return (
                <PostCard
                  key={idx}
                  post={post}
                  tagUrlMap={tagUrlMap}
                  boxWidth={boxWidth}
                />
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
            <Image alt="leftArrow" className={styles.img} src={leftArrow} />
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
            <Image alt="rightArrow" className={styles.img} src={rightArrow} />
          </div>
          <div
            className={
              currentPageIdx >= maxPageIdx
                ? styles.disabledButton
                : styles.button
            }
            onClick={() => handlePageChange(maxPageIdx)}>
            <Image
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
