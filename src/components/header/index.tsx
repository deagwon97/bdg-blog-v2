import styles from './header.module.scss'
import Image from 'next/image'
import loginIcon from 'assets/header/login-icon.svg'
import logoutIcon from 'assets/header/logout-icon.svg'
import writeIcon from 'assets/header/write-icon.svg'
import tempPostListIcon from 'assets/header/temp-post-list-icon.svg'
import Head from 'next/head'
import { use, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { IApi, TYPES } from 'apiClient/interface'
import useApi from 'context/hook'

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
        {props.accessToken && (
          <Link href="/post/temp/list/">
            <Image
              alt="tempPostListIcon"
              style={{ height: 30, width: 30, marginLeft: 40 }}
              src={tempPostListIcon}
            />
          </Link>
        )}
        {props.accessToken === '' ? (
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
            // placeholder="blur"
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

export type HeaderProps = {
  title: string | undefined
}
export const Header: React.FC<HeaderProps> = (props) => {
  const api = useApi<IApi>(TYPES.Api)
  const [accessToken, setAccessToken] = useState<string>('')

  const checkAccessTokenCallback = useCallback(async () => {
    let refreshToken = localStorage.getItem('refreshToken')
    let nowAccesstoken = localStorage.getItem('accessToken')

    if (nowAccesstoken === null && refreshToken === null) {
      localStorage.clear()
      return
    }

    if (nowAccesstoken !== null) {
      const isValid = await api.onCheckAccessToken(nowAccesstoken)
      if (isValid) {
        setAccessToken(nowAccesstoken)
        return
      }
    }

    if (refreshToken === null) {
      localStorage.clear()
      return
    }
    nowAccesstoken = await api.onLoadAccessTokenByRefreshToken(refreshToken)
    if (nowAccesstoken === '') {
      localStorage.clear()
      return
    }
    setAccessToken(nowAccesstoken)
    localStorage.setItem('accessToken', nowAccesstoken)
  }, [])

  useEffect(() => {
    checkAccessTokenCallback()
  }, [checkAccessTokenCallback])

  const clearLocalStorage = () => {
    localStorage.clear()
    setAccessToken('')
    window.location.reload()
  }

  return (
    <>
      <Head>
        <title>{props.title || 'bdg.blog'}</title>
      </Head>
      <div className={styles.fakeBackground} />
      <div className={styles.background}>
        <HeaderItem
          accessToken={accessToken}
          clearLocalStorage={clearLocalStorage}
        />
      </div>
    </>
  )
}
