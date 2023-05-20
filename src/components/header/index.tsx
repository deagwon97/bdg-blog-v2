import styles from './header.module.scss'
import Image from 'next/image'
import loginIcon from 'assets/header/login-icon.svg'
import logoutIcon from 'assets/header/logout-icon.svg'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { motion } from 'framer-motion'
import writeIcon from 'assets/header/write-icon.svg'
import Head from 'next/head'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'

const minHeight = 55
const maxHeight = 400

type HeaderItemProps = {
  accessToken: string
  clearLocalStorage: () => void
}

const HeaderItem: React.FC<HeaderItemProps> = (props) => {
  return (
    <div className={styles.content}>
      <Link href="/main/">
        <div className={styles.title}>bdg.blog</div>
      </Link>

      <div className={styles.icons}>
        {props.accessToken && (
          <Link href="/post/create/">
            <Image
              alt="writeIcon"
              style={{ height: 30, width: 30, marginLeft: 40 }}
              src={writeIcon}
            />
          </Link>
        )}
        {!props.accessToken ? (
          <Link href="/login/">
            <Image
              alt="loginIcon"
              style={{
                height: 30,
                width: 30,
                marginLeft: 40,
                marginRight: 20
              }}
              src={loginIcon}
            />
          </Link>
        ) : (
          <Image
            alt="logoutIcon"
            style={{
              height: 30,
              width: 30,
              marginLeft: 40,
              marginRight: 20
            }}
            onClick={props.clearLocalStorage}
            src={logoutIcon}
          />
        )}
      </div>
    </div>
  )
}

type HeaderProps = {
  isMain: boolean
}

export const Header: React.FC<HeaderProps> = (props) => {
  const [bannerHeight, setBannerHeight] = useState<number>(
    props.isMain ? maxHeight : minHeight
  )
  const [fakeBannerHeight, setFakeBannerHeight] = useState<number>(
    props.isMain ? maxHeight : minHeight
  )
  const [accessToken, setAccessToken] = useState<string>('')
  const [status, setStatus] = useState<string>('animate')

  const blockScorll = useCallback(async () => {
    disableBodyScroll(document)
    setTimeout(() => {
      enableBodyScroll(document)
      setStatus('exit')
    }, 500)
  }, [])

  useEffect(() => {
    if (props.isMain) {
      window.scroll({ top: 0 })
      blockScorll()
    }
  }, [props])

  let height = maxHeight
  let fakeHeight = maxHeight
  const handleScroll = () => {
    height = maxHeight - window.scrollY
    height = height > minHeight ? height : minHeight
    setBannerHeight(height)
    fakeHeight = height + window.scrollY
    fakeHeight = fakeHeight < maxHeight ? fakeHeight : maxHeight
    setFakeBannerHeight(fakeHeight)
  }

  useEffect(() => {
    if (props.isMain) {
      window.addEventListener('scroll', handleScroll)
    }
  })

  useEffect(() => {
    let token = localStorage.getItem('accessToken')
    if (token !== null) {
      setAccessToken(token)
    }
  }, [])

  const clearLocalStorage = () => {
    localStorage.clear()
    setAccessToken('')
    window.location.reload()
  }

  return (
    <>
      <Head>
        <title>bdg.blog</title>
      </Head>
      {props.isMain ? (
        <>
          <motion.div
            variants={{
              initial: { height: minHeight },
              animate: { height: maxHeight },
              exit: { height: fakeBannerHeight, transition: { duration: 0 } }
            }}
            initial="initial"
            animate={status}
            transition={{ duration: 0.5 }}
            className={styles.fakeBackground}
          />
          <motion.div
            variants={{
              initial: { height: minHeight },
              animate: { height: maxHeight },
              exit: { height: bannerHeight, transition: { duration: 0 } }
            }}
            initial="initial"
            animate={status}
            transition={{ duration: 0.5 }}
            className={styles.background}>
            <HeaderItem
              accessToken={accessToken}
              clearLocalStorage={clearLocalStorage}
            />
          </motion.div>
        </>
      ) : (
        <>
          <div className={styles.fakeBackground} />
          <div className={styles.background}>
            <HeaderItem
              accessToken={accessToken}
              clearLocalStorage={clearLocalStorage}
            />
          </div>
        </>
      )}
    </>
  )
}
