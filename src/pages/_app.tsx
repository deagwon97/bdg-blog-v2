import 'styles/globals.css'
import type { AppProps } from 'next/app'
import { config } from 'telefunc/client'
import { AnimatePresence } from 'framer-motion'

const isBrowser = typeof window !== 'undefined'
if (isBrowser) {
  config.telefuncUrl = '/api/_telefunc'
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AnimatePresence mode="wait" initial={true}>
      <Component {...pageProps} />
    </AnimatePresence>
  )
}
