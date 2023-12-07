import { getSession, useSession } from 'next-auth/react'
import clientPromise from '../lib/mongodb'
// import SurveyList from '../components/SurveyList'
import styles from './Dashboard.module.css'
import { useEffect, useState } from 'react'
import Buscador from '../components/Buscador'
import Itens from '../components/Itens'
import statusquest from '../lib/statusFilters.json'


const teste = [
  {
    nome: "Teste",
    respondentes: 20,
    total: 50,
    dataEdicao: '2021-10-21',
    dataAbertura: '2021-10-21',
    dataEncerramento: '2021-10-21',
    status: "Em construção"
  },
  {
    nome: "Teste",
    respondentes: 20,
    total: 50,
    dataEdicao: '2021-10-21',
    dataAbertura: '2021-10-21',
    dataEncerramento: '2021-10-21',
    status: "Ativo"
  },
  {
    nome: "Lol",
    respondentes: 20,
    total: 50,
    dataEdicao: '2021-10-21',
    dataAbertura: '2021-10-21',
    dataEncerramento: '2021-10-21',
    status: "Em construção"
  },
  {
    nome: "Teste",
    respondentes: 20,
    total: 50,
    dataEdicao: '2021-10-21',
    dataAbertura: '2021-10-21',
    dataEncerramento: '2021-10-21',
    status: "Ativo"
  },
  {
    nome: "Teste",
    respondentes: 20,
    total: 50,
    dataEdicao: '2021-10-21',
    dataAbertura: '2021-10-21',
    dataEncerramento: '2021-10-21',
    status: "Concluído"
  },
]




export default function Dashboard({
  // surveys,
  // results,
  // elligibleIds,
  // answersFrom2020Id,
}) {
  const { data: session } = useSession()
  const [busca, setBusca] = useState('');

  const [filtro, setFiltro] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const selecionarFiltro = (status) => {
    if (filtro === status.id) return setFiltro(null);
    else return setFiltro(status.id);
  }

  useEffect(() => {
    setLoaded(true);
  }, [0])

  return (
    session && loaded && (
      <div className={styles.section}>
        <div className={styles.bemvindo}>
          <h1>Bem vindo ao SAVE!</h1>
          <a>Explore e gerencie e acompanhe o progresso dos seus questionários abertos e veja os já concluídos. Além disso, crie novos questionários, tudo em um só lugar.</a>
          <div className={styles.bvbar1} />
          <div className={styles.bvbar2} />
        </div>
        <div className={styles.questionarios}>
          <div className={styles.divbutton}>
            <button className={styles.button}>Novo questionário</button>
          </div>
          <div className={styles.filtro}>
            <ul>
              {statusquest.map((status) => (
                <li
                  key={status.id}
                  onClick={() => selecionarFiltro(status)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      selecionarFiltro(status);
                    }
                  }}
                  tabIndex={0}
                  className={
                    filtro === status.id
                      ? styles.filtroitemselecionado
                      : styles.filtroitem
                  }
                >
                  {status.nome}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.barrabusca}>
            <Buscador busca={busca} setBusca={setBusca} content={'Procure por questionários'} />
          </div>
          <Itens busca={busca} filtro={filtro} dados={teste} />
        </div>
      </div>
    )
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
