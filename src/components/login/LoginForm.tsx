import styles from 'components/login/LoginForm.module.scss'
import { useState } from 'react'
import { onLogin } from 'server/service/user.telefunc'

const LoginForm = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }
  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const onClickLogin = () => {
    onLogin(email, password).then((res) => {
      if (res.valid) {
        localStorage.setItem('id', JSON.stringify(res.id))
        localStorage.setItem('email', JSON.stringify(res.email))
        localStorage.setItem('accessToken', JSON.stringify(res.accessToken))
        localStorage.setItem('refreshToken', JSON.stringify(res.refreshToken))
        window.location.href = '/main'
        return
      }
      alert('로그인 오류')
    })
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
