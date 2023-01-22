import styles from './ToyProjects.module.scss'
import Image from 'next/image'
import chevron from 'assets/common/chevron-right.svg'
import ToyProject from './ToyProject'
import cahtIcon from 'assets/common/chat-icon.svg'
import solarSystemIcon from 'assets/common/solar-system.svg'
import benzeneRingIcon from 'assets/common/benzene-ring.svg'

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
                  title="bdg.talk"
                  projectUrl="https://deagwon.com/chat/room/"
                  githubUrl="https://github.com/deagwon97/solar-system"
                  postUrl="https://github.com/deagwon97/solar-system"
                />
              </div>
              <div className={styles.item}>
                <ToyProject
                  image={solarSystemIcon}
                  title="Solar System"
                  fontSize={11}
                  projectUrl="https://solarsystem.deagwon.com/"
                  githubUrl="https://github.com/deagwon97/solar-system"
                  postUrl="https://github.com/deagwon97/solar-system"
                />
              </div>
              <div className={styles.item}>
                <ToyProject
                  image={benzeneRingIcon}
                  title="Tox AI"
                  projectUrl="https://toxai.manycore.uos.ac.kr/"
                  githubUrl="https://github.com/deagwon97/solar-system"
                  postUrl="https://github.com/deagwon97/solar-system"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
