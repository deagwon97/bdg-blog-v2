import { Header } from 'components/header'
import styles from 'pages/login/login.module.scss'
import Footer from 'components/footer'
import LoginForm from 'components/login/LoginForm'

export default function LoginPage() {
  return (
    <>
      <Header isMain={false} />
      <div className={styles.background}>
        <LoginForm />
      </div>
      <Footer />
    </>
  )
}
