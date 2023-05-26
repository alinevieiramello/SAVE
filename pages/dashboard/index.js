import { getSession, useSession } from 'next-auth/react'
import clientPromise from '../../lib/mongodb'
import { Container, Heading, Text, Divider } from '@chakra-ui/react'
import Head from 'next/head'
import SurveyList from '../../components/SurveyList'

export default function Dashboard({
  surveys,
  results,
  elligibleIds,
  answersFrom2020Id,
}) {
  const { data: session, status } = useSession()
  return (
    <>
      <Head>
        <title>SAVE - Dashboard</title>
      </Head>
      <Container maxW={'3xl'} as={'main'} py={{ base: 14, md: 22 }}>
        <Heading>Olá, {session?.user.name.split(' ')[0]}! 🤓</Heading>
        <Divider my={4} />
        {surveys.length > 0 && (
          <Text>
            Você tem {surveys.length} questionário{surveys.length > 1 && 's'}{' '}
            para responder!
          </Text>
        )}
        {surveys.length === 0 && (
          <Text>Você não tem nenhum questionário para responder!</Text>
        )}
        <SurveyList
          surveys={surveys}
          results={results}
          elligibleIds={elligibleIds}
          answersFrom2020Id={answersFrom2020Id}
        />
      </Container>
    </>
  )
}
//aqui é feita a conexão com o banco de dados e buscado os valores
export async function getServerSideProps(context) {
  const client = await clientPromise
  const db = client.db('SurveyTool')
  const session = await getSession(context)

  //teste para ter certeza de que o usuário está lo'gado
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }


  //a collection de surveys é transformada em array e transformada em JSON
  let surveys = await db.collection('surveys').find({}).toArray()
  surveys = JSON.parse(JSON.stringify(surveys))

  //instanciados os arrays vazio para procurar no banco de dados se o usuário está apto a responder uma survey
  let results = []
  let elligibleIds = []

  //aqui é procurado para ver se o usuário já respondeu alguma survey
  let answersFrom2020Id = ''
  let answersFrom2020 = null

  /* 
    Caso o usuario exista, porque precisamos saber quem é o usuário, 
  buscamos ele no banco e vemos quais surveys ele tem acesso. 
  */

  if (session) {
    results = await db
      .collection('surveyResults')
      .find({ userId: session.user._id })
      .toArray()
    results = JSON.parse(JSON.stringify(results))

    elligibleIds = await db.collection('answers_2020').find({}).toArray()

    elligibleIds = elligibleIds.map((id) => id._id)
    elligibleIds = JSON.parse(JSON.stringify(elligibleIds))

    answersFrom2020 = await db
      .collection('elligibleUsers')
      .findOne({ userId: session.user._id })

    answersFrom2020Id = answersFrom2020
      ? answersFrom2020.answers_from_2020_id
      : ''
  }
  //retorno das props para passar para o SurveyList
  return {
    props: {
      surveys,
      results,
      elligibleIds,
      answersFrom2020Id,
    },
  }
}
