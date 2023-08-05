import { motion, useAnimation } from 'framer-motion'
import { useEffect, useState } from 'react'
import Image, { ImageProps } from 'next/image'

const animationVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 }
}

export const FadeInImage = (props: ImageProps) => {
  const [loaded, setLoaded] = useState(false)
  const animationControls = useAnimation()
  useEffect(() => {
    if (loaded) {
      animationControls.start('visible')
    }
  }, [loaded])

  return (
    <motion.div
      initial={'hidden'}
      animate={animationControls}
      variants={animationVariants}
      transition={{ ease: 'easeOut', duration: 1 }}>
      <Image {...props} onLoad={() => setLoaded(true)} />
    </motion.div>
  )
}
