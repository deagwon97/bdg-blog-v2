import styles from './mainCards.module.scss'
import Link from 'next/link'
import {
  useRef,
  useState,
  useEffect,
  MutableRefObject,
  useCallback
} from 'react'
import useComponentSize from 'tools/useComponentSize'

import Image from 'next/image'

const MainPostCard = (props: {
  title: string
  summary: string
  link: string
  boxWidth: string
  imageUrl: string
}) => {
  const [imageUrl, setImageUrl] = useState('')

  const updateImageUrls = useCallback(async () => {
    const imageUrl = props.imageUrl
    setImageUrl(imageUrl)
  }, [props.imageUrl])

  useEffect(() => {
    updateImageUrls()
  }, [updateImageUrls])
  return (
    <Link href={props.link}>
      <div className={styles.postBox} style={{ width: props.boxWidth }}>
        <div className={styles.imageBox}>
          <div className={styles.imageOverlay} />
          {imageUrl !== '' && <Image src={imageUrl} alt="thumbnail" />}
        </div>
        <div className={styles.textBox}>
          <h4>{props.title}</h4>
          <span>{props.summary}</span>
        </div>
      </div>
    </Link>
  )
}

export default function MainCards() {
  const [boxWidth, setBoxWidth] = useState('380px')
  let ref = useRef() as MutableRefObject<HTMLInputElement>
  let size = useComponentSize(ref)
  useEffect(() => {
    setBoxWidth(size.width === 800 ? '380px' : '-webkit-fill-available')
  }, [size])
  return (
    <div className={styles.cardContainer} ref={ref}>
      <div>
        <MainPostCard
          title={'온프레미스 블로그 서비스 bdg.blog'}
          summary={'홈메이드 온프레미스로 어디까지 가능할까?'}
          link={'/post/온프레미스-블로그-서비스-bdgblog'}
          boxWidth={boxWidth}
          imageUrl={`https://${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET_NAME}/8b20162b-dc8f-4532-99d4-068298c76931`}
        />
        <MainPostCard
          title={'MyUBAI - 도시과학 빅데이터 AI 연구원'}
          summary={'HPC 클러스터 사용자를 위한 웹 어플리케이션'}
          link={'/post/MyUBAI--도시과학-빅데이터-AI-연구원'}
          boxWidth={boxWidth}
          imageUrl={`https://${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET_NAME}/71716a2e-8b46-45ff-a85c-2b38775df821`}
        />
      </div>
    </div>
  )
}
