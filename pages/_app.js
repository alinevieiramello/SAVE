import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { SessionProvider } from 'next-auth/react'
import { SurveyContext } from '../SurveyContext'
import { useMemo, useState } from 'react'
import 'survey-core/modern.min.css'
import 'survey-core/defaultV2.min.css'
import 'survey-creator-core/survey-creator-core.min.css'
import { useTransitionFix } from '../lib/useTransitionFix'
import Navbar from '../components/layout/Navbar'
import NextNProgress from 'nextjs-progressbar'
import Footer from '../components/layout/Footer'

function MyContextProvider({ children }) {
  const [surveyJSON, setSurveyJSON] = useState(null)
  const [survId, setSurvId] = useState(null)
  const [surveyList, setSurveyList] = useState(null)
  const contextProviderValue = useMemo(() => ({ surveyJSON, survId, surveyList }), [surveyJSON, survId, surveyList])
  return (
    <SurveyContext.Provider
      value={contextProviderValue}
    >
      {children}
    </SurveyContext.Provider>
  )
}

function MySessionProvider({ children, session }) {
  return (
    <SessionProvider session={session} refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  )
}

const theme = extendTheme({
  styles: {
    global: {
      // styles for the `body`
      body: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      },

    },
  },
},
)

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {
  useTransitionFix()

  return (
    <MySessionProvider session={session}>

      <ChakraProvider theme={theme}>
        <MyContextProvider>

          <NextNProgress color={'#38B2AC'} />
          <Navbar />
          <Component {...pageProps} />
          <Footer />
        </MyContextProvider>
      </ChakraProvider>

    </MySessionProvider>
  )
}
