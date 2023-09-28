import 'styles/globals.css'
import 'reflect-metadata'
import type { AppProps } from 'next/app'
import { config } from 'telefunc/client'
import { AnimatePresence } from 'framer-motion'
import DIContainerContext from 'context/api'

const isBrowser = typeof window !== 'undefined'
if (isBrowser) {
  config.telefuncUrl = '/api/_telefunc'
}

import { createTheme, ThemeProvider } from '@mui/material/styles'
import { container } from 'context/api'

const theme = createTheme({
  status: {
    danger: '#e53e3e'
  },
  palette: {
    primary: {
      main: '#0971f1',
      darker: '#053e85'
    },
    neutral: {
      main: '#64748B',
      contrastText: '#f9f9f9'
    }
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: 'black',
          ':after': {
            borderBottom: '2px solid black'
          }
        }
      }
    },
    MuiInput: {
      styleOverrides: {
        root: {
          color: 'black',
          ':after': {
            borderBottom: '2px solid black'
          }
        }
      }
    }
  }
})

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: React.CSSProperties['color']
    }
  }

  interface ThemeOptions {
    status: {
      danger: React.CSSProperties['color']
    }
  }

  interface Palette {
    neutral: Palette['primary']
  }

  interface PaletteOptions {
    neutral: PaletteOptions['primary']
  }

  interface PaletteColor {
    darker?: string
  }

  interface SimplePaletteColorOptions {
    darker?: string
  }
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DIContainerContext.Provider value={container}>
        <AnimatePresence mode="wait" initial={true}>
          <ThemeProvider theme={theme}>
            <Component {...pageProps} />
          </ThemeProvider>
        </AnimatePresence>
      </DIContainerContext.Provider>
    </>
  )
}
