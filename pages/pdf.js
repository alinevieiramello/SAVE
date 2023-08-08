import React from 'react';
import MyDocument from '../components/Document';
import { PDFViewer } from '@react-pdf/renderer';
import { useState } from 'react';
import { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import clientPromise from '../lib/mongodb';
import { useSelector } from 'react-redux';



const MyComponent = ({ surveys, surveyResults, filtro, filtro2 }) => {
  const data = useSelector((state) => state.PDFData.valor)
  console.log(data)
  surveyResults = surveyResult1(surveyResults);
  const [isLoaded, setLoaded] = useState(false);
  useEffect(() => {

    setLoaded(true);

  }, [0])
  // Only render the PDFViewer component on the client-side
  return (
    <>
      {
        isLoaded ?
          (
            <Box width={'100%'} maxHeight={'900px'} h={'100vh'} >
              {typeof window !== 'undefined' && (
                <PDFViewer height={'100%'} width={'100%'}>
                  <MyDocument data={data} surveys={surveys} surveyResults={surveyResults} filtro={filtro} filtro2={filtro2} />
                </PDFViewer>
              )}
            </Box >
          )
          : null
      }
    </>
  )
};

const surveyResult1 = (surveyResults) => {
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

  return r;
}

export async function getServerSideProps(context) {

  const client = await clientPromise;
  const db = client.db("SurveyTool");

  let data = context.params.props[0];
  let filtro = context.params.props[1];
  let filtro2 = context.params.props[2];
  

  let surveyResults = await db.collection("surveyResults").find({}).toArray();
  let surveys = await db.collection("surveys").find({}).toArray();

  

  return {
    props: {
      data: JSON.parse(decodeURIComponent(data)),
      surveys: JSON.parse(JSON.stringify(surveys)),
      surveyResults: JSON.parse(JSON.stringify(surveyResults)),
      filtro: decodeURIComponent(filtro),
      filtro2: decodeURIComponent(filtro2),
    }
  }
}


export default MyComponent;