import 'styles/globals.css'
import type { AppProps } from 'next/app'
import { config } from 'telefunc/client'

const isBrowser = typeof window !== 'undefined'
if (isBrowser) {
  config.telefuncUrl = '/api/_telefunc'
}

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
