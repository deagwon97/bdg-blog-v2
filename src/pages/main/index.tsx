import { Header } from 'components/header'
import PostCards from 'components/post/PostCards'
import styles from 'pages/main/main.module.scss'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import {
  getPostListPageSortByDate,
  getMaxPageIndex
} from 'server/repository/post'
import { Post } from '@prisma/client'
import Footer from 'components/footer'
import ToyProjects from 'components/toyProjects/ToyProjects'
import CategoryButtonList from 'components/categoryButtonList'
import { useCallback, useEffect, useState } from 'react'
import chevron from 'assets/common/chevron-right.svg'
import * as service from 'server/service/index.telefunc'
import Image from 'next/image'
// import MainCards from 'components/mainProjects/mainCards'

export const getServerSideProps: GetServerSideProps = async () => {
  const pageSize = 8
  let posts = (await getPostListPageSortByDate(pageSize, 1)) as Post[]
  posts = JSON.parse(JSON.stringify(posts))
  let maxPageIdx = (await getMaxPageIndex(pageSize)) as number
  return {
    props: { posts, maxPageIdx }
  }
}

export default function MainPage({
  posts,
  maxPageIdx
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [category, setCategory] = useState<string>('ALL')
  const [categoryPosts, setCategoryPosts] = useState<Post[]>(posts)
  const [categoryMaxPageIdx, setMaxPageIdx] = useState<number>(maxPageIdx)

  const updatePosts = useCallback(async () => {
    const pageSize = 8
    let posts = (await service.onLoadPostListPageSortByDateByCategory(
      pageSize,
      1,
      category
    )) as Post[]
    posts = JSON.parse(JSON.stringify(posts))
    let maxPageIdx = (await service.onLoadMaxPageIndexByCategory(
      pageSize,
      category
    )) as number
    setCategoryPosts(posts)
    setMaxPageIdx(maxPageIdx)
  }, [category])

  useEffect(() => {
    updatePosts()
  }, [category])

  return (
    <>
      <Header />
      <div className={styles.background}>
        <div className={styles.contentBox}>
          {/* <div className={styles.head}>
          <span>Main Projects</span>
          <Image placeholder="blur" alt="right" src={chevron} />
          </div>
          <MainCards /> */}
          <ToyProjects />
          <div className={styles.head}>
            <span>Posts</span>
            <Image placeholder="blur" alt="right" src={chevron} />
          </div>
          <CategoryButtonList updateCategory={setCategory} />
          <PostCards
            category={category}
            posts={categoryPosts}
            maxPageIdx={categoryMaxPageIdx}
          />
        </div>
      </div>
      <Footer />
    </>
  )
}
