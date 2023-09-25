import styles from 'components/toyProjects/ToyProjects.module.scss'
import Image from 'next/image'
import chevron from 'assets/common/chevron-right.svg'
import ToyProject from 'components/toyProjects/ToyProject'
import cahtIcon from 'assets/common/chat-icon.svg'
import solarSystemIcon from 'assets/common/solar-system.svg'
import rbacIcon from 'assets/common/rbac.svg'

export default function ToyProjects() {
  return (
    <>
      <div className={styles.background}>
        <div className={styles.head}>
          <span>Toy Projects</span>
          <Image alt="right" src={chevron} />
        </div>
        <div className={styles.scrollBlock}>
          <div className={styles.itemsBox}>
            <div className={styles.items}>
              <div className={styles.item}>
                <ToyProject
                  image={cahtIcon}
                  title="bdg.chat"
                  projectUrl="/chat"
                  githubUrl="https://github.com/deagwon97/bdg-blog-v2"
                  postUrl="https://deagwon.com/post/811"
                />
              </div>
              <div className={styles.item}>
                <ToyProject
                  image={rbacIcon}
                  title="rbac"
                  projectUrl="https://rbac.deagwon.com/"
                  githubUrl="https://github.com/deagwon97/rbac-go"
                />
              </div>
              <div className={styles.item}>
                <ToyProject
                  image={solarSystemIcon}
                  title="Solar System"
                  projectUrl="https://solarsystem.deagwon.com/"
                  githubUrl="https://github.com/deagwon97/solar-system"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
