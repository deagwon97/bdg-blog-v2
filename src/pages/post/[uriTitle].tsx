import { Post } from '@prisma/client'
import Footer from 'components/footer'
import { Header } from 'components/header'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useEffect, useState } from 'react'
import { repository as repo } from 'server/diContainer'
import { storage as sto } from 'server/diContainer'
import PostContent from 'components/post/PostContent'
import styles from './post.module.scss'
import { IApi, TYPES } from 'apiClient/interface'
import useApi from 'context/hook'

import { NextSeo } from 'next-seo'

import { IStorage } from 'server/service/storageInterface'

const getImageUrl = async (imageTag: string, sto: IStorage) => {
  const imageUID = imageTag.replace('<bdg-minio=', '').replace('/>', '')
  if (imageUID === null || imageUID === undefined || imageUID === '') {
    return ''
  }
  const presignedUrl = await sto.getPresignedUrl(imageUID)
  return presignedUrl
}

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

type MetaData = {
  title: string
  description: string
  url: string
  image: string
}

const HeadMeta: React.FC<MetaData> = (props) => {
  return (
    <>
      <NextSeo
        title={props.title}
        description={props.description}
        openGraph={{
          title: props.title,
          description: props.description,
          url: props.url,
          images: [
            {
              url: props.image,
              width: 800,
              height: 600,
              alt: props.title
            }
          ],
          site_name: 'bdg.blog'
        }}
      />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { uriTitle } = context.query
  const postUriTitle = uriTitle as string
  let post = (await repo.postRepo.getPostByUriTitle(postUriTitle)) as Post
  post = JSON.parse(JSON.stringify(post))
  const imageTag = post.thumbnail as string
  const imageUrl = await getImageUrl(imageTag, sto)
  post.thumbnail = imageUrl
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
      <HeadMeta
        title={post.title}
        description={getSummary(post.content)}
        url={`https://deagwon.com/post/${post.uriTitle}`}
        image={post.thumbnail}
      />

      <Header title={post.title} />
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
                window.location.href = `/post/edit/${post.uriTitle}`
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
