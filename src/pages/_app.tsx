import 'styles/globals.css'
import type { AppProps } from 'next/app'
import { config } from 'telefunc/client'
import { AnimatePresence } from 'framer-motion'
import Head from 'next/head'

const isBrowser = typeof window !== 'undefined'
if (isBrowser) {
  config.telefuncUrl = '/api/_telefunc'
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, interactive-widget=resizes-content"
        />
      </Head>

      <AnimatePresence mode="wait" initial={true}>
        <Component {...pageProps} />
      </AnimatePresence>
    </>
  )
}
