import { ChakraProvider } from '@chakra-ui/react'
import { SessionProvider } from 'next-auth/react'
import { SurveyContext } from '../SurveyContext'
import { useState } from 'react'
import 'survey-core/modern.min.css'
import 'survey-core/defaultV2.min.css'
import 'survey-creator-core/survey-creator-core.min.css'
import { useTransitionFix } from '../lib/useTransitionFix'
import Navbar from '../components/Navbar'
import NextNProgress from 'nextjs-progressbar'

function MyContextProvider({ children }) {
  const [surveyJSON, setSurveyJSON] = useState(null)
  const [survId, setSurvId] = useState(null)
  const [surveyList, setSurveyList] = useState(null)

  return (
    <SurveyContext.Provider
      value={{
        state: {
          surveyJSON,
          survId,
          surveyList,
        },
        setSurveyJSON,
        setSurvId,
        setSurveyList,
      }}
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

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {
  useTransitionFix()

  return (
    <MySessionProvider session={session}>
      <ChakraProvider>
        <MyContextProvider>
          <NextNProgress color={'#38B2AC'} />
          <Navbar />
          <Component {...pageProps} />
        </MyContextProvider>
      </ChakraProvider>
    </MySessionProvider>
  )
}
