import { useState, useEffect, useRef } from 'react';
import { getSession } from 'next-auth/react';
import {
  Button, Collapse, Flex, Input, Radio, Stack, Text, Box, useColorMode, Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton, useDisclosure
} from '@chakra-ui/react'
import clientPromise from "../../lib/mongodb";
import Filtros from '../../components/Filtros';
import Charts from '../../components/Charts';
import { capitalizeWords } from '../../functions/functions';



const pesquisasEstaticas = [{
  id: 1,
  titulo: 'Quantidade de homens e mulheres por ano de graduação',
  tipoChart: 'bar',
  dado1: 'anodeconclusaograd',
  dado2: 'sexo',
  editar: false,
}]

const Relatorio = ({ surveyResults, surveys, mediaTempoDeResposta, mediaTempoDeRespostaSemSAVE }) => {

  /* -------------------------------------------------- */


  const [isLoaded, setLoaded] = useState(false);

  /* -------------------------------------------------- */

  const [title, setTitle] = useState('');
  const [tipoChart, setTipoChart] = useState('');
  const [dado1, setDado1] = useState('');
  const [dado2, setDado2] = useState('');
  const [editavel, setEditavel] = useState(false);

  /* -------------------------------------------------- */

  const [addDado, setAddDado] = useState(false);
  const [dados, setDados] = useState([]);

  const [filtro, setFiltro] = useState('Selecione um');
  const [filtro2, setFiltro2] = useState('Selecione um');

  const ref = useRef();


  const listaFiltros = () => {
    let index = 0;
    const filtros = [];
    filtros[index] = 'Selecione um';
    index++;
    surveys.map((survey) => {
      return Object.keys((survey)).forEach((key) => {
        if (Array.isArray(survey[key])) {
          survey[key].map((item) => {
            Object.entries(item).forEach(([key2, value2]) => {
              if (key2 === 'title') {
                filtros[index] = value2;
                index++;
              }
            }
            )
          })
        }
      })
    })

    for (let i in filtros) {
      const indice = filtros[i].indexOf(' - ');
      if (indice !== -1) {
        const parte1 = filtros[i].substring(0, indice);
        filtros[i] = parte1;
      }
    }

    for (let i in filtros) {
      if (filtros[i] !== 'Selecione um')
        filtros[i] = capitalizeWords(filtros[i]);
    }

    filtros = filtros.filter((item, index) => {
      return filtros.indexOf(item) === index;
    })

    return filtros;
  }

  const geraCharts = () => {

    surveys.map((survey) => {
      Object.keys((survey)).forEach((key) => {
        if (Array.isArray(survey[key])) {
          survey[key].map((pages) => {


            Object.entries(pages).forEach(([key2, value2]) => {

              if (Array.isArray(value2)) {
                value2.map((questions) => {
                  Object.entries(questions).forEach(([key3, value3]) => {
                    if (value3 === ('radiogroup' || 'checkbox')) {
                      Object.entries(questions).forEach(([key4, value4]) => {
                        if (key4 === 'title') {

                          const titulo = value4;

                          Object.entries(questions).forEach(([key5, value5]) => {
                            if (key5 === 'name') {
                              const name = value5;
                              const novoChart = {
                                id: dados.length + 1,
                                titulo: titulo,
                                tipoChart: 'pie' || 'bar',
                                dado1: name,
                                dado2: '',
                                editar: false,
                              }
                              setDados([...dados, novoChart]);
                            }
                          })
                        }
                      })
                    }
                  })
                })
              }
            })
          })
        }
      })
    })
  }

  const geraPDF = (objs) => {

    const encodedObj = encodeURIComponent(JSON.stringify(objs));

    const url = `/pdf/${encodedObj}/${filtro}/${filtro2}`;

    window.open(url);
  }

  const setNewChart = () => {

    if (title !== '' || tipoChart !== '' || dado1 !== '') {

      const novoChart = {
        id: dados.length + 1,
        titulo: title,
        tipoChart: tipoChart,
        dado1: dado1,
        dado2: dado2,
        editar: editavel,
      }

      setDados([...dados, novoChart]);
    }
    setAddDado(false);
  }



  useEffect(() => {
    geraCharts();
    setDados(pesquisasEstaticas)
    setLoaded(true);
  }, [0]);



  //JSX.React renderizado no DOM
  return (
    <>
      {isLoaded && (
        <Flex
          flexDir={'column'}
        >

          <Text
            fontSize={'2xl'}
            fontWeight={'bold'}
            alignSelf={'center'}
          >
            Visualização dos dados
          </Text>
          <Flex
            paddingTop={'-20px'}
            position={'relative'}
            width={'200px'}
            left={'70%'}

          >
            <Button
              onClick={() => geraPDF(dados)}
            >
              Generate PDF
            </Button>

          </Flex>
          <Flex
            flexDir={'row'}
            borderRadius={'lg'}
            maxWidth={600}
            position={'absolute'}
            alignItems={'center'}
          >
            <Filtros filtros={listaFiltros()} filtro={filtro} setFiltro={setFiltro} />
            <Filtros filtros={listaFiltros()} filtro={filtro2} setFiltro={setFiltro2} />

          </Flex>

          <Flex
            flexDir={'column'}
            maxW={200}
            position={'absolute'}
            top={'250px'}
            left={'3%'}
          >
            <Box bg="gray.100" p={2} borderRadius="md" marginBottom={'20px'}>

              <Text fontSize="xl" fontWeight="bold" textAlign="center">
                Respondentes até o momento:
              </Text>

              <Text textAlign="center" fontFamily="mono">
                {surveyResults.length} egressos de 98 (
                {((surveyResults.length / 98) * 100).toFixed(2)}%)
              </Text>

            </Box>
            <Box bg="gray.100" p={2} borderRadius="md">

              <Text fontSize="xl" fontWeight="bold" textAlign="center">
                Tempo médio de resposta:
              </Text>

              <Text textAlign="center" fontFamily="mono">
                Com SAVE: {Math.floor(mediaTempoDeResposta / 60)}min{" "}
                {(mediaTempoDeResposta % 60).toFixed(0)}s
              </Text>

              <Text textAlign="center" fontFamily="mono">
                Sem SAVE: {Math.floor(mediaTempoDeRespostaSemSAVE / 60)}min{" "}
                {(mediaTempoDeRespostaSemSAVE % 60).toFixed(0)}s
              </Text>

            </Box>
          </Flex>

          <Flex
            width={'600px'}
            height={'100%'}
            flexDir={'column'}
            alignSelf={'center'}
            ref={ref}
          >
            {dados.map((item, index) => (
              <Charts buttonVisibility={true} surveys={surveys} key={index} editavel={item.editar} title={item.title} dado1={item.dado1} dado2={item.dado2} tipoChart={item.tipoChart} surveyResult={surveyResults} filtro={filtro} filtro2={filtro2} />
            ))}
            {addDado
              ?
              (
                <Collapse in={addDado} animateOpacity visibility={addDado ? 'visible' : 'hidden'} >
                  <Stack spacing={3} marginBottom={'20px'}>
                    <Input variant='filled' placeholder='Titulo' onChange={(e) => setTitle(e.target.value)} />
                    <Input variant='filled' placeholder='Primeiro dado a relacionar' onChange={(e) => setDado1(e.target.value)} />
                    <Input variant='filled' placeholder='Segundo dado a relacionar' onChange={(e) => setDado2(e.target.value)} />
                    <Input variant='filled' placeholder='Tipo de gráfico' onChange={(e) => setTipoChart(e.target.value)} />
                    <Radio colorScheme='green' value='true' onChange={(e) => setEditavel(e.target.value)}>Editável</Radio>
                    <Radio colorScheme='red' value='false' onChange={(e) => setEditavel(e.target.value)}>Não Editável</Radio>
                  </Stack>
                  <Button marginBottom={'30px'} onClick={() => setNewChart()}>Salvar</Button>
                </Collapse>

              )
              :
              (
                <Button
                  w={'100%'}
                  pos={'relative'}
                  fontSize={'20px'}
                  marginBottom={'30px'}
                  onClick={() => setAddDado(!addDado)}
                >
                  +
                </Button>
              )}

          </Flex>
        </Flex >
      )}
    </>
  )
}





/*--------------------------------------------------------------------------------------- */


export async function getServerSideProps(context) {
  const client = await clientPromise;
  const db = client.db("SurveyTool");
  const session = await getSession(context);



  if (session) {
    let surveyResults = await db.collection("surveyResults").find({}).toArray();
    let surveys = await db.collection("surveys").find({}).toArray();
    let answers_2020 = await db.collection("answers_2020").find({}).toArray();

    const tempoDeRespostaSemSAVE = answers_2020.map((answer) => {
      return answer.interviewtime;
    });

    const tempoDeRespostaSemSave2 = tempoDeRespostaSemSAVE.filter(
      (resposta) => typeof resposta === "number"
    );

    const mediaTempoDeRespostaSemSAVE =
      tempoDeRespostaSemSave2.reduce((total, current) => {
        return total + current;
      }) / tempoDeRespostaSemSave2.length;

    const tempoDeResposta = surveyResults.map((survey) => {
      return survey.timeSpent;
    });

    const mediaTempoDeResposta =
      tempoDeResposta.reduce((total, tempo) => {
        return total + tempo;
      }) / tempoDeResposta.length;

     (surveyResults) => {
      let r = []
      let index = 0;

      surveyResults.map((survey) => {
        Object.keys(survey).forEach((key) => {
          if (typeof survey[key] === 'object') {
            r[index] = survey[key];
            index++;
          }
        })
      })

      surveyResults = r;
    }

    return {
      props: {
        surveys: JSON.parse(JSON.stringify(surveys)),
        surveyResults: JSON.parse(JSON.stringify(surveyResults)),
        mediaTempoDeResposta: JSON.parse(JSON.stringify(mediaTempoDeResposta)),
        mediaTempoDeRespostaSemSAVE: JSON.parse(JSON.stringify(mediaTempoDeRespostaSemSAVE)),

      },
    };

  } else {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };

  }
}

export default Relatorio;




