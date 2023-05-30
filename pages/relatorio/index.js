import { useState, useEffect, useRef } from 'react';
import { getSession } from 'next-auth/react';
import {
  Box, Button, Flex, Icon, Text
} from '@chakra-ui/react'
import { MdArrowUpward } from 'react-icons/md';
import clientPromise from "../../lib/mongodb";
import Filtros from '../../components/Filtros';
import Charts from '../../components/Charts';



const pesquisasEstaticas = [{
  id: 1,
  titulo: 'Quantidade de homens e mulheres por ano de graduação',
  tipoChart: 'bar',
  dado1: 'anodeconclusaograd',
  dado2: 'sexo',
  editar: false,
  tipo: 'Dimensão sócio-demográfica'
},
{
  id: 2,
  titulo: 'Número de egressos por áreas de pesquisa do TCC do curso de graduação em CC',
  tipoChart: 'pie',
  dado1: 'areapesqgradcc',
  dado2: '',
  editar: false,
  tipo: 'Dimensão Formação Acadêmica - Área de Pesquisa do TCC'
},
{
  id: 3,
  titulo: 'Número de egressos por áreas de pesquisa do TCC do curso de graduação em ES',
  tipoChart: 'pie',
  dado1: 'areapesqgrades',
  dado2: '',
  editar: false,
  tipo: 'Dimensão Formação Acadêmica - Área de Pesquisa do TCC'
},
{
  id: 4,
  titulo: 'Quantidade de bolsistas por ano de graduação',
  tipoChart: 'line',
  dado1: 'anodeconclusaograd',
  dado2: 'bolsistagrad',
  editar: true,
  tipo: 'Dimensão sócio-demográfica'
},
{
  id: 5,
  titulo: 'Área de pesquisa de doutorado dos egressos do curso de CC',
  tipoChart: 'radar',
  dado1: 'areapesqdoutcc',
  dado2: '',
  editar: true,
  tipo: 'Dimensão sócio-demográfica'
}]

const relatorio = ({ surveyResult, surveys }) => {

  surveyResult = getSurveyResult(surveyResult);

  const [hiddenButton, setHiddenButton] = useState(true);
  const [pdf, setPDF] = useState(null);
  const [isLoaded, setLoaded] = useState(false);
  const [dados, setDados] = useState([]);
  const [filtro, setFiltro] = useState('Selecione um');
  const [filtro2, setFiltro2] = useState('Selecione um');
  const ref = useRef(null);

  const listFiltros = () => {
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

  const generatePDF = () => {
    setHiddenButton(!hiddenButton)

    if (pdf) {

    }
  }

  useEffect(() => {

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
            Relatórios
          </Text>
          <Flex
            paddingTop={'-20px'}
            position={'relative'}
            width={'200px'}
            left={'70%'}
          >
            <Button
              position={'relative'}
              top={'-20px'}
              onClick={() => generatePDF}
            >
              Generate PDF
            </Button>
          </Flex>
          <Flex
            flexDir={'row'}
            borderRadius={'lg'}
            maxWidth={600}
            marginTop={'-60px'}
            alignItems={'center'}
          >
            <Filtros filtros={listFiltros()} filtro={filtro} setFiltro={setFiltro} />
            <Filtros filtros={listFiltros()} filtro={filtro2} setFiltro={setFiltro2} />

          </Flex>
          <Flex
            width={'600px'}
            height={'100%'}
            flexDir={'column'}
            alignSelf={'center'}
            ref={ref}
          >
            {dados.map((item, index) => (
              <Charts buttonVisibility={hiddenButton} complex={isComplex(surveys, item.dado1, item.dado2)} setPDF={setPDF} key={index} editavel={item.editar} title={item.titulo} dado1={item.dado1} dado2={item.dado2} tipoChart={item.tipoChart} surveyResult={surveyResult} filtrado={verificaFiltro(item.dado1, item.dado2, filtro, filtro2, surveys)} />
            ))}
            <Button
              w={'100%'}
              pos={'relative'}
              fontSize={'20px'}
            >
              +
            </Button>
          </Flex>
        </Flex>
      )}
    </>
  )
}

/* ------------------------------------------------ Funções auxiliares ---------------------------------------------------------- */


const isComplex = (surveys, dado1, dado2) => {

  let visibleIf = '';

  surveys.map((survey) => {
    Object.keys((survey)).forEach((key) => {

      if (Array.isArray(survey[key]))
        Object.keys(survey[key]).forEach((key2) => {

          Object.keys(survey[key][key2]).forEach((key3) => {

            if (Array.isArray(survey[key][key2][key3]))
              survey[key][key2][key3].map((it) => {

                if (it.name === dado1)
                  if (it.visibleIf) visibleIf = it.visibleIf;
              })
          })
        })
    })
  })


  if (visibleIf === '' || visibleIf === null) return null;

  if (visibleIf.includes('and')) {
    const value = visibleIf.split(' and ');

    value[0] = value[0].replace(/[{$}]/g, '');

    value[1] = value[1].replace(/[{$}]/g, '');

    const value1 = separaChaveValor(value[0]);
    const value2 = separaChaveValor(value[1]);

    return [value1, 'and', value2];
  }

  return separaChaveValor(visibleIf);
  
}


const separaChaveValor = (item) => {
  const value = item.split(' = ');
  value[0] = value[0].replace(/[{$}]/g, '');
  value[1] = value[1].replace(/['$']/g, '');
  
  return value;
}


//Pega somente o Objeto que iremos utilizar para buscar as respostas
//Fiz isso para não ter q fazer uma procura a mais.

const getSurveyResult = (surveyResult) => {
  let r = []
  let index = 0;

  surveyResult.map((survey) => {
    Object.keys(survey).forEach((key) => {
      if (typeof survey[key] === 'object') {
        r[index] = survey[key];
        index++;
      }
    })
  })

  return r;
}

//Função auxiliar para transformar todas as frases em maiusculo
function capitalizeWords(frase) {
  const palavras = frase.split(" ");

  for (let i = 0; i < palavras.length; i++) {
    const primeiraLetra = palavras[i][0].toUpperCase();
    const restoDaPalavra = palavras[i].slice(1).toLowerCase();

    palavras[i] = primeiraLetra + restoDaPalavra;
  }

  return palavras.join(" ");
}


/*
  Função para verificação do filtro ativo, é uma busca forçada dentro do banco de dados utilizando a collection surveys.
  Acredito que não seja necessário alterar ela pelo fato dos surveys serem salvos de maneira padrão no banco.
*/

const verificaFiltro = (dado1, dado2, filtro1, filtro2, surveys) => {

  let boolv1 = false;
  let boolv2 = false;

  if (filtro1 === 'Selecione um' && filtro2 === 'Selecione um') return true;

  surveys.map((survey) => {
    Object.keys((survey)).forEach((key) => {

      if (Array.isArray(survey[key]))
        Object.keys(survey[key]).forEach((key2) => {

          let str = survey[key][key2].title;
          str = capitalizeWords(str);

          if (str.includes(filtro1))
            Object.keys(survey[key][key2]).forEach((key3) => {

              if (Array.isArray(survey[key][key2][key3]))
                survey[key][key2][key3].map((it) => {

                  if (it.name === dado1)
                    boolv1 = true


                })
            })

          if (str.includes(filtro2))
            Object.keys(survey[key][key2]).forEach((key3) => {

              if (Array.isArray(survey[key][key2][key3]))
                survey[key][key2][key3].map((it) => {

                  if (it.name === dado2)
                    boolv2 = true

                })
            })
        })
    })
  })

  if (dado2 === '') boolv2 = true;

  const bool = (boolv1 && boolv2) === true ? true : false;
  return bool;
}



/*--------------------------------------------------------------------------------------- */

//Banco de dados

export async function getServerSideProps(context) {
  const client = await clientPromise;
  const db = client.db("SurveyTool");
  const session = await getSession(context);



  if (session) {
    let surveyResult = await db.collection("surveyResults").find({}).toArray();
    let surveys = await db.collection("surveys").find({}).toArray();
    return {
      props: {
        surveys: JSON.parse(JSON.stringify(surveys)),
        surveyResult: JSON.parse(JSON.stringify(surveyResult))
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

export default relatorio;




