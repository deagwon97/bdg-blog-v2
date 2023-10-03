import Link from 'next/link'

import styles from 'components/portfolio/portfolio.module.scss'
const Portfolio = () => {
  return (
    <>
      <div className={styles.backgorund}>
        <br />
        <br />

        <h3>
          안녕하세요 효율적인 시스템을 만들기 위해 고민하는 개발자 부대권입니다.
        </h3>
        <Link className={styles.link} href={'/post/이력서-부대권'}>
          <h4>이력서</h4>
        </Link>
        <Link className={styles.link} href={'/post/포트폴리오-부대권'}>
          <h4>포트폴리오</h4>
        </Link>
        <Link className={styles.link} href={'https://github.com/deagwon97'}>
          <h4>깃허브</h4>
        </Link>
        <hr />
      </div>
    </>
  )
}

export default Portfolio
