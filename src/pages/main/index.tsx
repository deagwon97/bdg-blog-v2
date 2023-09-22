import { Header } from 'components/header'
import PostCards from 'components/post/PostCards'
import styles from 'pages/main/main.module.scss'
import { Post } from '@prisma/client'
import Footer from 'components/footer'
import ToyProjects from 'components/toyProjects/ToyProjects'
import CategoryButtonList from 'components/categoryButtonList'
import { useCallback, useEffect, useState, useContext } from 'react'
import Image from 'next/image'
import chevron from 'assets/common/chevron-right.svg'
import searchIcon from 'assets/common/search.svg'

import { IApi, TYPES } from 'apiClient/interface'
import useApi from 'context/hook'

type SearchBarProps = {
  searchKeyword: string
  handleSearch: (searchKeyword: string) => void
}
const SearchBar: React.FC<SearchBarProps> = (props) => {
  const [searchKeyword, setSearchKeyword] = useState<string>(
    props.searchKeyword
  )

  useEffect(() => {
    setSearchKeyword(props.searchKeyword)
  }, [props.searchKeyword])

  const handleSearchKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value)
  }

  return (
    <div className={styles.searchBar}>
      <input
        className={styles.searchInput}
        type="search"
        value={searchKeyword}
        placeholder="검색어를 입력하세요"
        onChange={handleSearchKeyword}
        onKeyDown={(e) => {
          const key = e.code || e.key
          if (key === 'Enter' || key === 'NumpadEnter') {
            props.handleSearch(searchKeyword)
          }
        }}
      />
      <button
        className={styles.searchButton}
        onClick={() => {
          props.handleSearch(searchKeyword)
        }}>
        <Image src={searchIcon} alt="search" />
      </button>
    </div>
  )
}

export default function MainPage() {
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const [categoryPosts, setCategoryPosts] = useState<Post[]>([])
  const [categoryMaxPageIdx, setMaxPageIdx] = useState<number>(1)
  const published = true

  const api = useApi<IApi>(TYPES.Api)

  const updatePosts = async (searchKeyword: string) => {
    const pageSize = 4
    let posts = (await api.onLoadPostListPageSortByDateByCategory(
      pageSize,
      1,
      category,
      published,
      searchKeyword
    )) as Post[]
    posts = JSON.parse(JSON.stringify(posts))
    let maxPageIdx = (await api.onLoadMaxPageIndexByCategory(
      pageSize,
      category,
      published,
      searchKeyword
    )) as number
    setCategoryPosts(posts)
    setMaxPageIdx(maxPageIdx)
  }

  const updatePostsOnCategory = useCallback(async () => {
    setSearchKeyword('')
    updatePosts('')
  }, [category])

  useEffect(() => {
    updatePostsOnCategory()
  }, [updatePostsOnCategory])

  const updatePostsOnSearch = useCallback(async () => {
    updatePosts(searchKeyword)
  }, [searchKeyword])

  useEffect(() => {
    updatePostsOnSearch()
  }, [updatePostsOnSearch])

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
          <div className={styles.postHead}>
            <span>{category === '' ? 'ALL' : category}</span>
            <Image alt="right" src={chevron} />
            <SearchBar
              searchKeyword={searchKeyword}
              handleSearch={setSearchKeyword}
            />
          </div>
          <PostCards
            category={category}
            posts={categoryPosts}
            maxPageIdx={categoryMaxPageIdx}
            published={published}
            searchKeyword={searchKeyword}
          />
        </div>
      </div>

      <Footer />
    </>
  )
}
