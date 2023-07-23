// next js post view page

import { Post } from '@prisma/client'
import Footer from 'components/footer'
import { Header } from 'components/header'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useEffect } from 'react'
import { getPost } from 'server/repository/post'
import chevron from 'assets/common/chevron-right.svg'
import PostContent from 'components/post/PostContent'
import Image from 'next/image'
import styles from './post.module.scss'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query
  const postId = parseInt(id as string)
  let post = (await getPost(postId)) as Post
  post = JSON.parse(JSON.stringify(post))
  return {
    props: { post }
  }
}

export default function PostViewPage({
  post
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  useEffect(() => {
    window.scrollTo(0, 0)
  })
  return (
    <>
      <Header isMain={false} />
      <div className={styles.background}>
        <div className={styles.postHead}>
          <span>{post.categoryName}</span>
          <Image alt="right" src={chevron} />
        </div>
        <div className={styles.contentBox}>
          <PostContent post={post} />
        </div>
      </div>
      <Footer />
    </>
  )
}
