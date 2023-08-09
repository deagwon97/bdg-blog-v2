import { motion, useAnimation } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import Image, { ImageProps } from 'next/image'

const animationVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 }
}

export const FadeInImage = (props: ImageProps) => {
  const [loaded, setLoaded] = useState(false)
  const animationControls = useAnimation()

  const animationControlsCallback = useCallback(async () => {
    if (loaded) {
      await animationControls.start('visible')
    }
  }, [loaded, animationControls])

  useEffect(() => {
    animationControlsCallback()
  }, [animationControlsCallback])

  return (
    <motion.div
      initial={'hidden'}
      animate={animationControls}
      variants={animationVariants}
      transition={{ ease: 'easeOut', duration: 1 }}>
      <Image {...props} onLoad={() => setLoaded(true)} alt="thubnail" />
    </motion.div>
  )
}
