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
import * as service from 'server/service/index.telefunc'

const getImageUrl = async (imageTag: string) => {
  if (imageTag === null) return ''
  const imageUID = imageTag.replace('<bdg-minio=', '').replace('/>', '')
  if (imageUID === null || imageUID === undefined || imageUID === '') {
    return ''
  }
  const presignedUrl = await service.onLoadPresignedUrl(imageUID)
  return presignedUrl
}

const MainPostCard = (props: {
  title: string
  summary: string
  link: string
  boxWidth: string
  imageTag: string
}) => {
  const [imageUrl, setImageUrl] = useState('')

  const updateImageUrls = useCallback(async () => {
    const imageUrl = await getImageUrl(props.imageTag)
    setImageUrl(imageUrl)
  }, [props.imageTag])

  useEffect(() => {
    updateImageUrls()
  }, [updateImageUrls])
  return (
    <Link
      href={props.link}
      onClick={() => {
        alert('준비중입니다.')
      }}>
      <div className={styles.postBox} style={{ width: props.boxWidth }}>
        <div className={styles.imageBox}>
          <div className={styles.imageOverlay} />
          {imageUrl !== '' && <img src={imageUrl} alt="thumbnail" />}
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
          title={'bdg.blog'}
          summary={'홈메이드 온프레미스로 어디까지 가능할까?'}
          link={'/main'}
          boxWidth={boxWidth}
          imageTag={'<bdg-minio=ed934dc7-ea7c-45bd-9d37-6e78de216d46/>'}
        />
        <MainPostCard
          title={'MyUBAI'}
          summary={'HPC 클러스터 사용자를 위한 웹 어플리케이션'}
          link={'/main'}
          boxWidth={boxWidth}
          imageTag={'<bdg-minio=adc67d32-e3d7-49c8-bad9-4410a99ef7ac/>'}
        />
      </div>
    </div>
  )
}
