import styles from './ToyProject.module.scss'
import Image from 'next/image'
import { useState } from 'react'
import articleIcon from 'assets/common/article.svg'
import githubIcon from 'assets/common/github.svg'

interface ToyProjectProps {
  image: any
  title: string
  fontSize?: number | undefined
  projectUrl: string
  postUrl?: string | undefined
  githubUrl?: string | undefined
}

export default function ToyProject({
  image,
  title,
  fontSize,
  projectUrl,
  postUrl,
  githubUrl
}: ToyProjectProps) {
  const [backgoundStyle, setBackgoundStyle] = useState<string>(styles.noClick)

  const onClickHandler = () => {
    if (backgoundStyle === styles.Click) {
      setBackgoundStyle(styles.noClick)
    } else {
      setBackgoundStyle(styles.Click)
    }
  }

  return (
    <>
      <div className={backgoundStyle}>
        <div className={styles.cardBackground} onClick={onClickHandler}>
          <div className={styles.imageBox}>
            <Image className={styles.image} alt="right" src={image} />
          </div>
          <div className={styles.titleBox}>
            {fontSize ? (
              <span
                className={styles.title}
                style={{ fontSize: `${fontSize}px` }}>
                {title}
              </span>
            ) : (
              <span className={styles.title}>{title}</span>
            )}
          </div>
        </div>
        <div className={styles.hiddenBoxes}>
          <div className={styles.hiddenBox}>
            <a href={projectUrl}>
              <Image className={styles.image} alt="right" src={image} />
            </a>
          </div>
          {postUrl && (
            <div className={styles.hiddenBox}>
              <a href={postUrl}>
                <Image className={styles.image} alt="right" src={articleIcon} />
              </a>
            </div>
          )}
          {githubUrl && (
            <div className={styles.hiddenBox}>
              <a href={githubUrl}>
                <Image className={styles.image} alt="right" src={githubIcon} />
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
