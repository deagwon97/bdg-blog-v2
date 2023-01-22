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

export const getServerSideProps: GetServerSideProps = async () => {
  const pageSize = 4
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
  return (
    <>
      <Header isMain={true} />
      <div className={styles.background}>
        <div className={styles.contentBox}>
          <ToyProjects />
          <PostCards posts={posts} maxPageIdx={maxPageIdx} />
        </div>
      </div>
      <Footer />
    </>
  )
}
