import dynamic from 'next/dynamic'
import Head from 'next/head'
import { getSession } from 'next-auth/react'

const SurveyCreatorWidget = dynamic(
  () => import('../../components/SurveyCreatorWidget/[surveyId]'),
  {
    ssr: false,
  }
)
export default function create() {
  return (
    <>
      <Head>
        <title>SAVE - Criar questionário</title>
      </Head>
      <SurveyCreatorWidget />
    </>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)

  if (!session || session.user.role === 'user') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
