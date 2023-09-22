import { Header } from 'components/header'
import PostCards from 'components/post/PostCards'
import styles from 'pages/main/main.module.scss'
import { Post } from '@prisma/client'
import Footer from 'components/footer'
import CategoryButtonList from 'components/categoryButtonList'
import { useCallback, useEffect, useState, useContext } from 'react'
import chevron from 'assets/common/chevron-right.svg'
import Image from 'next/image'

import { IApi, TYPES } from 'api/interface'
import useApi from 'context/hook'

export default function TempPostsPage() {
  const [category, setCategory] = useState<string>('')
  const [categoryPosts, setCategoryPosts] = useState<Post[]>([])
  const [categoryMaxPageIdx, setMaxPageIdx] = useState<number>(1)
  const api = useApi<IApi>(TYPES.Api)
  const published = false
  const updatePosts = useCallback(async () => {
    const pageSize = 4
    let posts = (await api.onLoadPostListPageSortByDateByCategory(
      pageSize,
      1,
      category,
      published,
      ''
    )) as Post[]
    posts = JSON.parse(JSON.stringify(posts))
    let maxPageIdx = (await api.onLoadMaxPageIndexByCategory(
      pageSize,
      category,
      published,
      ''
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
          <div className={styles.head}>
            <span>Temporary Posts</span>
            <Image alt="right" src={chevron} />
          </div>
          <CategoryButtonList updateCategory={setCategory} />
          <PostCards
            category={category}
            posts={categoryPosts}
            maxPageIdx={categoryMaxPageIdx}
            published={published}
            searchKeyword={''}
          />
        </div>
      </div>
      <Footer />
    </>
  )
}
