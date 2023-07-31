import styles from './header.module.scss'
import Image from 'next/image'
import loginIcon from 'assets/header/login-icon.svg'
import logoutIcon from 'assets/header/logout-icon.svg'
import writeIcon from 'assets/header/write-icon.svg'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import Link from 'next/link'

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
              placeholder="blur"
              style={{ height: 30, width: 30, marginLeft: 40 }}
              src={writeIcon}
            />
          </Link>
        )}
        {!props.accessToken ? (
          <Link href="/login/">
            <Image
              alt="loginIcon"
              placeholder="blur"
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
            placeholder="blur"
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

export const Header: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string>('')

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
