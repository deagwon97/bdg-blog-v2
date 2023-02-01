import styles from './header.module.scss'
import Image from 'next/image'
import loginIcon from 'assets/header/login-icon.svg'

import writeIcon from 'assets/header/write-icon.svg'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const minHeight = 55
const maxHeight = 400

type HeaderProps = {
  isMain: boolean
}

export const Header: React.FC<HeaderProps> = (props) => {
  const [bannerHeight, setBannerHeight] = useState<number>(minHeight)
  const [fakeBannerHeight, setFakeBannerHeight] = useState<number>(minHeight)

  const [firstTime, setFirstTime] = useState<boolean>(true)
  let height = maxHeight
  let fakeHeight = maxHeight
  const handleScroll = () => {
    if (window.scrollY !== 0 || firstTime) {
      height = maxHeight - window.scrollY
      height = height > minHeight ? height : minHeight
      setBannerHeight(height)
      fakeHeight = height + window.scrollY
      fakeHeight = fakeHeight < maxHeight ? fakeHeight : maxHeight
      setFakeBannerHeight(fakeHeight)
    }
  }

  useEffect(() => {
    window.scroll({ top: 0, left: 400 - 55 })
  }, [])

  useEffect(() => {
    if (props.isMain) {
      window.addEventListener('scroll', handleScroll)
    }
  })
  useEffect(() => {
    if (props.isMain) {
      window.scrollTo(0, 400 - 55)
      let t = 0
      let h = minHeight
      const a = 20
      const callback = () => {
        if (window.scrollY === 0) {
          h = h + (0.92 ** t + 0.1) * a
          setBannerHeight(h)
          setFakeBannerHeight(h)
          t++
          h < maxHeight && requestAnimationFrame(callback)
        } else {
          setFirstTime(false)
          window.scroll({ top: 0, left: maxHeight - h, behavior: 'smooth' })
          return
        }
      }
      requestAnimationFrame(callback)
    }
  }, [firstTime, props])

  return (
    <>
      <Head>
        <title>bdg.blog</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
      </Head>
      <div
        className={styles.fakeBackground}
        style={{ height: fakeBannerHeight }}
      />
      <div className={styles.background} style={{ height: bannerHeight }}>
        <div className={styles.content}>
          <Link href="/main/">
            <div className={styles.title}>bdg.blog</div>
          </Link>
          <div className={styles.icons}>
            <Link href="/post/create/">
              <Image
                alt="writeIcon"
                style={{ height: 30, width: 30, marginLeft: 40 }}
                src={writeIcon}
              />
            </Link>
            <Link href="/login/">
              <Image
                alt="loginIcon"
                style={{
                  height: 24,
                  width: 24,
                  marginLeft: 40,
                  marginRight: 20
                }}
                src={loginIcon}
              />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
