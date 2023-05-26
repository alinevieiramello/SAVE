import { getSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import clientPromise from '../../lib/mongodb'
import mongoose from 'mongoose'
import { Container } from '@chakra-ui/react'
import Head from 'next/head'

const SurveyWidget = dynamic(() => import('../../components/SurveyWidget'), {
  ssr: false,
})

export default function Survey({ survey, results, answersFrom2020 }) {
  return (
    <>
      <Head>
        <title>SAVE - Questionário</title>
      </Head>
      <Container
        as={'main'}
        bgColor={'white'}
        border={'1px solid'}
        borderColor={'gray.200'}
        maxW={'3xl'}
        my={{ base: 14, md: 22 }}
        borderRadius={'0.375rem'}
      >
        <SurveyWidget
          survey={survey}
          results={results}
          answersFrom2020={answersFrom2020}
          timeSpent={results?.timeSpent || 0}
        />
      </Container>
    </>
  )
}

export async function getServerSideProps(context) {
  const client = await clientPromise
  const db = client.db('SurveyTool')
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  let survey = await db
    .collection('surveys')
    .findOne({ _id: mongoose.Types.ObjectId(context.query.surveyId) })
  survey = JSON.parse(JSON.stringify(survey))

  let results = []
  let answersFrom2020 = []
  let elligibleId = ''

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  if (session) {
    results = await db
      .collection('surveyResults')
      .findOne({ surveyId: context.query.surveyId, userId: session.user._id })
    results = JSON.parse(JSON.stringify(results))

    elligibleId = await db
      .collection('elligibleUsers')
      .findOne({ userId: session.user._id })

    answersFrom2020 = await db.collection('answers_2020').findOne({
      _id: mongoose.Types.ObjectId(elligibleId.answers_from_2020_id),
    })

    answersFrom2020 = JSON.parse(JSON.stringify(answersFrom2020))
  }

  return {
    props: {
      survey,
      results,
      answersFrom2020,
    },
  }
}
