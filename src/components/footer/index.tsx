import styles from 'components/footer/footer.module.scss'

const Footer = () => {
  return (
    <div className={styles.box}>
      <hr style={{ border: '0.5px solid #DDDDDD' }} />
      <br />
      <div className={styles.container}>
        <div className={styles.row}>
          <div className={styles.column}>
            <span className={styles.heading}>Email</span>
            <span style={{ fontSize: '12px' }}>azaz09112@gmail.com</span>
          </div>
          <div className={styles.column}>
            <span className={styles.heading}>GitHub</span>
            <a
              className={styles.footerLink}
              href="https://github.com/deagwon97">
              github.com/deagwon97
            </a>
          </div>
        </div>
      </div>
      <br />
      <span style={{ fontSize: '12px' }}>© 2022 Copyright deagwon.com</span>
    </div>
  )
}
export default Footer
