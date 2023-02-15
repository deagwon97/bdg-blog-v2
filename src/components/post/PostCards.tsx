import React, { MutableRefObject, useEffect, useRef, useState } from 'react'
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
import { onLoadPostListPageSortByDate } from 'server/service/index.telefunc'

type Post = Prisma.PostGetPayload<{}>
type PostProps = {
  posts: Post[]
  maxPageIdx: number
}
const PostCards: React.FC<PostProps> = (props) => {
  // 모바일 여부
  const [isMobile, setIsMobile] = useState(false)
  const [boxWidth, setBoxWidth] = useState('380px')

  // 페이지당 포스트 개수
  const pageSize = 4
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
  const [posts, setPosts] = useState<Post[]>(props.posts)

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
            onLoadPostListPageSortByDate(pageSize, newPageIdx).then((res) => {
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
      onLoadPostListPageSortByDate(pageSize, currentPageIdx).then((res) => {
        setPosts(res)
      })
    }
  }, [
    currentPageIdx,
    lastFirstButtonIdx,
    lastButtonCount,
    buttonCount,
    isMobile
  ])

  return (
    <div>
      <div className={styles.postHead}>
        <span>Posts</span>
        <Image alt="right" src={chevron} />
      </div>
      <div className={styles.postContainer} ref={ref}>
        <div>
          {posts &&
            posts.map((post) => (
              <Link key={post.id} href={`/post/${post.id}`}>
                <div className={styles.postBox} style={{ width: boxWidth }}>
                  <h4>{post.title}</h4>
                  <span>{post.summary}</span>
                </div>
              </Link>
            ))}
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
