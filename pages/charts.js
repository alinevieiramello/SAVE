import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Box, Container, Text, SimpleGrid, Flex } from "@chakra-ui/react";
import clientPromise from "../lib/mongodb";

function charts({ surveyResult, answers_2020 }) {
  ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
  );

  const sexo = surveyResult.map((survey) => {
    return survey.surveyResult.sexo;
  });

  const sexoMasculino = sexo.filter((sexo) => sexo === "Masculino");
  const sexoFeminino = sexo.filter((sexo) => sexo === "Feminino");

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

  const tempoDeResposta = surveyResult.map((survey) => {
    return survey.timeSpent;
  });

  const mediaTempoDeResposta =
    tempoDeResposta.reduce((total, tempo) => {
      return total + tempo;
    }) / tempoDeResposta.length;

  const sexoData = {
    labels: ["Masculino", "Feminino"],
    datasets: [
      {
        data: [sexoMasculino.length, sexoFeminino.length],
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  const anoDeGraduacao = surveyResult.map((survey) => {
    return survey.surveyResult.anodeconclusaograd;
  });

  const anoDeGraduacaoSemDuplicatas = [...new Set(anoDeGraduacao)].sort();

  const s = anoDeGraduacaoSemDuplicatas.map((ano) => {
    return anoDeGraduacao.filter((anoGraduacao) => anoGraduacao === ano).length;
  });

  const anoDeGraduacaoData = {
    labels: anoDeGraduacaoSemDuplicatas,
    datasets: [
      {
        label: "Egressos",
        data: s,
        backgroundColor: "#36A2EB",
      },
    ],
  };

  const anoDeGraduacaoOptions = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  const pctDiff = (a, b) => {
    return (100 * Math.abs((a - b) / b)).toFixed(2);
  };

  // 19-08
  // número de empresas (média geral, média por ano) - nuemptrab
  const numeroEmpresas = surveyResult.map((result) => {
    return result.surveyResult.nuemptrab;
  });
  // console.log(numeroEmpresas);

  const somaEmpresas = numeroEmpresas.reduce((prev, a) => prev + a, 0);
  const numeroEmpresasSemDuplicatas = [...new Set(numeroEmpresas)].sort();

  const numeroEmpresasFilter = numeroEmpresasSemDuplicatas.map((filtro) => {
    return numeroEmpresas.filter((nuemp) => nuemp === filtro).length;
  });

  const numeroEmpresasData = {
    labels: numeroEmpresasSemDuplicatas, //certo
    datasets: [
      {
        label: "Egressos",
        data: numeroEmpresasFilter,
        backgroundColor: "#009B77",
      },
    ],
  };

  const numeroEmpresasOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // histograma faixaremuemp6
  // remover pessoas que não trabalharam
  const faixaEmp = surveyResult.map((result) => {
    return result.surveyResult.faixaremuemp6;
  });
  // console.log(faixaEmp);

  const faixaEmpSemDuplicatas = [...new Set(faixaEmp)].sort();
  // console.log(faixaEmpSemDuplicatas);

  const faixaEmpFiltro = faixaEmpSemDuplicatas.map((filtro) => {
    return faixaEmp.filter((faixa) => faixa === filtro).length;
  });
  // console.log(faixaEmpFiltro);

  const faixaEmpData = {
    labels: [
      "????",
      faixaEmpSemDuplicatas[5],
      faixaEmpSemDuplicatas[2],
      faixaEmpSemDuplicatas[3],
      faixaEmpSemDuplicatas[4],
      faixaEmpSemDuplicatas[1],
    ],
    datasets: [
      {
        label: "Egressos",
        data: [
          faixaEmpFiltro[0],
          faixaEmpFiltro[5],
          faixaEmpFiltro[2],
          faixaEmpFiltro[3],
          faixaEmpFiltro[4],
          faixaEmpFiltro[1],
        ],
        backgroundColor: ["gray"],
      },
    ],
  };

  const faixaEmpOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  //insercmerctrab
  const insermerctrab = surveyResult.map((result) => {
    return result.surveyResult.insermerctrab;
  });
  // console.log(insermerctrab);

  const insermerctrabSemDuplicatas = [...new Set(insermerctrab)];
  // console.log(insermerctrabSemDuplicatas);

  const insermerctrabFiltro = insermerctrabSemDuplicatas.map((semDupe) => {
    return insermerctrab.filter((filtro) => filtro === semDupe).length;
  });
  // console.log(insermerctrabFiltro);

  const insermerctrabData = {
    labels: insermerctrabSemDuplicatas,
    datasets: [
      {
        label: "Egressos",
        data: insermerctrabFiltro,
        backgroundColor: ["orange", "purple"],
      },
    ],
  };

  return (
    <Container>
      <SimpleGrid gap={20}>
        <Flex marginTop={50} width={500} gap={2}>
          <Box bg="gray.100" p={2} borderRadius="md">
            <Text fontSize="xl" fontWeight="bold" textAlign="center">
              Respondentes até o momento:
            </Text>
            <Text textAlign="center" fontFamily="mono">
              {surveyResult.length} egressos de 98 (
              {((surveyResult.length / 98) * 100).toFixed(2)}%)
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
          <Box bg="gray.100" p={2} borderRadius="md">
            <Text fontSize="xl" fontWeight="bold" textAlign="center">
              Número de empresas (média):
            </Text>
            <Text textAlign="center" fontFamily="mono">
              {(somaEmpresas / surveyResult.length).toFixed(2)}
            </Text>
          </Box>
        </Flex>
        <Container width={400} height={400}>
          <Text fontSize="xl" fontWeight="bold" textAlign="center" mb={2}>
            Número de respondentes por sexo
          </Text>
          <Pie data={sexoData} />
        </Container>
        <Container width={400} height={400}>
          <Text fontSize="xl" fontWeight="bold" textAlign="center">
            Egressos por ano de conclusão da graduação
          </Text>
          <Bar data={anoDeGraduacaoData} options={anoDeGraduacaoOptions} />
        </Container>
        <div>
          <Text fontSize="xl" fontWeight="bold" textAlign="center">
            Número de empresas em que trabalhou
          </Text>
          <Bar data={numeroEmpresasData} options={numeroEmpresasOptions} />
        </div>
        <div>
          <Text fontSize="xl" fontWeight="bold" textAlign="center">
            Faixa de remuneração
          </Text>
          <Bar data={faixaEmpData} options={faixaEmpOptions} />
        </div>
        <div>
          <Text fontSize="xl" fontWeight="bold" textAlign="center">
            Inserção no mercado de trabalho
          </Text>
          <Pie data={insermerctrabData} />
        </div>
      </SimpleGrid>
    </Container>
  );
}

export async function getServerSideProps() {

  const client = await clientPromise;
  const db = client.db("SurveyTool");

    

  let surveyResult = await db.collection("surveyResults").find({}).toArray();
  let answers_2020 = await db.collection("answers_2020").find({}).toArray();

  return {
    props: {
      surveyResult: JSON.parse(JSON.stringify(surveyResult)),
      answers_2020: JSON.parse(JSON.stringify(answers_2020)),
    },
  };
}

export default charts;
