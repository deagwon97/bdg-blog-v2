import styles from 'components/login/LoginForm.module.scss'
import { useState } from 'react'

import { IApi, TYPES } from 'apiClient/interface'
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
  const onClickLogin = () => {
    try {
      api.onLogin(email, password).then((res) => {
        if (res.valid) {
          localStorage.setItem('id', JSON.stringify(res.id))
          localStorage.setItem('name', JSON.stringify(res.name))
          localStorage.setItem('accessToken', JSON.stringify(res.accessToken))
          localStorage.setItem('refreshToken', JSON.stringify(res.refreshToken))
          document.cookie = `accessToken=${res.accessToken};`
          window.location.href = '/main'
          return
        }
        alert('아이디 또는 비밀번호를 확인해주세요')
      })
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
          type="password"
        />
      </div>
      <div className={styles.buttonBox}>
        <div onClick={onClickLogin} className={styles.button}>
          <p>로그인</p>
        </div>
      </div>
    </div>
  )
}
export default LoginForm
