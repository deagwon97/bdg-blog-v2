import { Header } from 'components/header'
import PostCards from 'components/post/PostCards'
import styles from 'pages/main/main.module.scss'
import { Post } from '@prisma/client'
import Footer from 'components/footer'
import ToyProjects from 'components/toyProjects/ToyProjects'
import CategoryButtonList from 'components/categoryButtonList'
import { useCallback, useEffect, useState } from 'react'
import chevron from 'assets/common/chevron-right.svg'
import * as service from 'server/service/index.telefunc'
import Image from 'next/image'
// import MainCards from 'components/mainProjects/mainCards'

export default function MainPage() {
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const [categoryPosts, setCategoryPosts] = useState<Post[]>([])
  const [categoryMaxPageIdx, setMaxPageIdx] = useState<number>(1)
  const published = true
  const updatePosts = useCallback(async () => {
    const pageSize = 4
    let posts = (await service.onLoadPostListPageSortByDateByCategory(
      pageSize,
      1,
      category,
      published,
      searchKeyword
    )) as Post[]
    posts = JSON.parse(JSON.stringify(posts))
    let maxPageIdx = (await service.onLoadMaxPageIndexByCategory(
      pageSize,
      category,
      published,
      searchKeyword
    )) as number
    setCategoryPosts(posts)
    setMaxPageIdx(maxPageIdx)
  }, [category])

  useEffect(() => {
    updatePosts()
  }, [updatePosts])

  return (
    <>
      <Header />
      <div className={styles.background}>
        <div className={styles.contentBox}>
          {/* <div className={styles.head}>
          <span>Main Projects</span>
          <Image 
          // placeholder="blur" alt="right" src={chevron} />
          </div>
          <MainCards /> */}
          <ToyProjects />
          <div className={styles.head}>
            <span>Posts</span>
            <Image alt="right" src={chevron} />
          </div>
          <CategoryButtonList updateCategory={setCategory} />
          <PostCards
            category={category}
            posts={categoryPosts}
            maxPageIdx={categoryMaxPageIdx}
            published={published}
          />
        </div>
      </div>

      <Footer />
    </>
  )
}
