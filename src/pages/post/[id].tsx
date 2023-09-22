import { Post } from '@prisma/client'
import Footer from 'components/footer'
import { Header } from 'components/header'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useEffect, useState } from 'react'
import repo from 'server/singletonRepository'
import PostContent from 'components/post/PostContent'
import styles from './post.module.scss'
import { IApi, TYPES } from 'api/interface'
import useApi from 'hook/useApi'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query
  const postId = parseInt(id as string)
  let post = (await repo.postRepo.getPost(postId)) as Post
  post = JSON.parse(JSON.stringify(post))
  return {
    props: { post }
  }
}

export default function PostViewPage({
  post
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const api = useApi<IApi>(TYPES.Api)
  useEffect(() => {
    window.scrollTo(0, 0)
  })
  const [accessToken, setAccessToken] = useState<string>('')

  useEffect(() => {
    let token = localStorage.getItem('accessToken')
    if (token !== null) {
      setAccessToken(token)
    }
  }, [])
  return (
    <>
      <Header />
      <div className={styles.background}>
        <div className={styles.postHead}>
          <span> # {post.categoryName}</span>
        </div>
        <div className={styles.contentBox}>
          <PostContent post={post} />
        </div>
        {accessToken !== '' && (
          <div className={styles.buttonContainer}>
            <button
              className={styles.button}
              onClick={() => {
                window.location.href = `/post/edit/${post.id}`
              }}>
              수정
            </button>
            <button
              onClick={async () => {
                const result = confirm('정말로 삭제하시겠습니까?')
                if (!result) {
                  return
                }
                const res = await api.onDeletePost(post.id)
                if (res) {
                  window.location.href = '/'
                } else {
                  alert('삭제에 실패하였습니다.')
                }
              }}
              className={styles.button}>
              삭제
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}
