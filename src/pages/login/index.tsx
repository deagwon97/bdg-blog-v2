import { Header } from 'components/header'
import Footer from 'components/footer'
import styles from 'pages/login/login.module.scss'
import { useState, useContext } from 'react'

import Button from '@mui/material/Button'

import { GetServerSideProps, InferGetServerSidePropsType } from 'next'

import { IApi, TYPES } from 'api/interface'
import useApi from 'context/hook'

const LoginForm = () => {
  const api = useApi<IApi>(TYPES.Api)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }
  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }
  const onClickLogin = async () => {
    try {
      const res = await api.onLogin(email, password)
      if (res.valid) {
        localStorage.setItem(
          'name',
          JSON.stringify(res.name).replace(/['"']+/g, '')
        )
        localStorage.setItem(
          'accessToken',
          JSON.stringify(res.accessToken).replace(/['"']+/g, '')
        )
        localStorage.setItem(
          'refreshToken',
          JSON.stringify(res.refreshToken).replace(/['"']+/g, '')
        )
        document.cookie = `accessToken=${res.accessToken};`
        window.location.href = '/main'
        return
      }
      alert('아이디 또는 비밀번호를 확인해주세요')
    } catch (e) {
      alert('아이디 또는 비밀번호를 확인해주세요')
    }
  }

  return (
    <div className={styles.loginForm}>
      <div className={styles.inputBox}>
        <div className={styles.inputTitle}>아이디</div>
        <input className={styles.input} onChange={onChangeEmail} type="text" />
      </div>
      <div className={styles.inputBox}>
        <div className={styles.inputTitle}>비밀번호</div>
        <input
          className={styles.input}
          onChange={onChangePassword}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              onClickLogin()
            }
          }}
          type="password"
        />
      </div>
      <div className={styles.buttonBox}>
        <Button
          variant="outlined"
          onClick={onClickLogin}
          className={styles.button}>
          로그인
        </Button>
      </div>
      <br />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const api = useApi<IApi>(TYPES.Api)
  const props = await api.onConnect()
  return {
    props: { props }
  }
}

export default function LoginPage({
  props
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.background}>
          <LoginForm />
        </div>
      </div>
      <Footer />
    </>
  )
}
