import {
    Box, GridItem, HStack, Button, Icon, Text, Stack, Collapse, Input
} from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';
import Chart from './Chart';
import { useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { format } from 'date-fns';
import { View } from '@react-pdf/renderer';
import { capitalizeWords } from '../../lib/FuncoesAux';
import { returnSurveyQuestions, separaChaveValor, returnSurveyPages } from '../../lib/ManipulaJSON';
import { calculaObjetos, countByKey, buscaObjetos, countByKeys, countWithConditional, isConditional, separaAnd } from '../../lib/ChartsDataFunctions';
const _ = require('underscore')


const Charts = ({ isPdf, buttonVisibility, surveyResult, dado1, dado2, tipoChart, editavel, title, surveys, filtro, filtro2 }) => {

    const [isEditing, setEditing] = useState(false);
    const [dataKey, setDataKey] = useState([]);
    const [isLoaded, setLoaded] = useState(false);
    const ref = useRef(null);

    let dataKey3 = '';
    let dataKey4 = '';

    const getFileName = (fileType) => `${format(new Date(), `'${title}' -"dd-MM-yy"`)}.${fileType}`
    const complex = verificaComplexidade(surveys, dado1);

    const downloadPng = useCallback(() => {
        if (ref.current === null) {
            return
        }
        toPng(ref.current, { cacheBust: true, })
            .then((dataUrl) => {
                const link = document.createElement('a')
                link.download = `${getFileName('png')}`
                link.href = dataUrl
                link.click()
            })
            .catch((err) => {
                console.log(err)
            })
    }, [ref]);


    useEffect(() => {

        if (dado2 !== '') {
            getDataKey(surveyResult, dado2, setDataKey);
        }
        
        setLoaded(true);
    }, [])

    const arr = {
        data: separaDadosnoJSON(complex, dado1, dado2, surveyResult, dataKey3),
        dataKey: dataKey[0],
        dataKey2: dataKey[1]
    }

    const renderEdit = () => {
        return (
            <Collapse in={isEditing} animateOpacity visibility={isEditing ? 'visible' : 'hidden'} >
                <Stack spacing={3}>
                    <Input variant='filled' placeholder='Titulo' onChange={(e) => handleChange(e, 'titulo')} />
                    <Input variant='filled' placeholder='Primeiro dado a relacionar' onChange={(e) => handleChange(e, '1')} />
                    <Input variant='filled' placeholder='Segundo dado a relacionar' onChange={(e) => handleChange(e, '2')} />
                    <Input variant='filled' placeholder='Tipo de gráfico' onChange={(e) => handleChange(e, 'tipo')} />
                </Stack>
                <Button marginTop={'10px'} onClick={() => setEditing(false)}>Salvar</Button>
            </Collapse>
        )
    }

    const renderShape = () => {
        return (
            isPdf ? (
                <View>
                    <Text>{title}</Text>
                    <Chart type={tipoChart} data={arr.data} height={500} width={500} dataKey={tipoChart === 'bar' && dado2 === '' ? 'value' : arr.dataKey} dataKey2={arr.dataKey2} dataKey3={dataKey3} dataKey4={dataKey4} />
                </View>
            )

                : (
                    <Box display={'grid'} gridTemplateRows={'20px 500px 70px'} gridTemplateColumns={'1fr'} maxHeight={'700px'} marginBottom={30} marginTop={10} paddingTop={-20} justifyContent={'center'}>
                        <Text justifySelf={'center'} gridRow={1} marginBottom={5}>{title}</Text>
                        <Box ref={ref} gridRow={2} w={tipoChart === 'radar' ? '900px' : '1fr'} gridColumn={1}>
                            <Chart type={tipoChart} data={arr.data} height={500} width={500} dataKey={tipoChart === 'bar' && dado2 === '' ? 'value' : arr.dataKey} dataKey2={arr.dataKey2} dataKey3={dataKey3} dataKey4={dataKey4} />
                        </Box>
                        
                        {buttonVisibility ? (
                            <GridItem gridRow={3} gridColumn={1} marginBottom={40}>
                                <HStack spacing={4}>
                                    <Button onClick={downloadPng}>Generate PNG</Button>

                                    {
                                        editavel ? (
                                            <Button cursor={'pointer'} onClick={() => setEditing(true)} >
                                                <Icon as={EditIcon} color={'green.100'} marginRight={3} />
                                                Editar
                                            </Button>) : null
                                    }
                                </HStack>
                            </GridItem>)
                            : null}
                    </Box >
                )
        )
    }


    return (
        <>
            {verificaFiltro(dado1, dado2, filtro, filtro2, surveys) ? (isLoaded && isEditing ? renderEdit() : renderShape()) : null}
        </>
    )
}


/*
------------------------------------------------------Funções Auxiliares de busca-------------------------------------------------------------------------------
*/


function getDataKey(surveyResult, dado2, setDataKey) {
    const map = surveyResult;
    let dado = []

    map.forEach((value) => {
        if (value[dado2]) {
            dado.push(value[dado2])
        }
    })

    let dadonovo = []
    dado.forEach((value) => {

        if (value !== dado[1]) {
            dadonovo.push(value)
        }
    })

    dado = dado.filter((value) => value !== dadonovo[0])

    setDataKey([dado[0], dadonovo[0]])
}

function separaDadosnoJSON(complex, dado1, dado2, surveyResult, dataKey3) {

    if (complex) {

        let obj = [];

        complex.map((value) => {
            if (Array.isArray(value)) {
                if (value.length > 0) {

                    value.map((value) => {
                        if (typeof value === 'object') obj[obj.length] = value;

                    })
                }
            }
        });

        if (separaAnd(complex)) {

            let arr = buscaObjetos(surveyResult, complex);

            dataKey3 = arr[0];

            arr = countByKey(arr[1], dado1);

            return arr;

        } else if (dado2 === '') {
            
            let arr = buscaObjetos(surveyResult, complex);

            if (obj.length > 0) {

                arr = calculaObjetos(arr, obj, dado1)

                return arr;

            } else {
                arr = countByKey(arr, dado1);

                return arr;
            }

        }
    }
    
    if (dado2 === '') {

        let array = countByKey(surveyResult, dado1);
        
        return array;

    } else if (isConditional(surveyResult, dado2)) {

        let array = countWithConditional(surveyResult, dado1, dado2);

        return array;
    } else {

        let array = countByKeys(surveyResult, dado1, [dado2]);

        return array;
    }

}

const verificaFiltro = (dado1, dado2, filtro1, filtro2, surveys) => {

    let boolv1 = false;
    let boolv2 = false;

    if (filtro1 === 'Selecione um' && filtro2 === 'Selecione um') return true;

    const pages = returnSurveyPages(surveys);

    pages.map((page) => {

        let str = page.title;
        str = capitalizeWords(str);

        if (str.includes(filtro1) || str.includes(filtro2))
            Object.keys(page).forEach((key) => {

                if (Array.isArray(page[key]))
                    page[key].map((question) => {

                        if (question.name === dado1)
                            boolv1 = true
                        else if (question.name === dado2)
                            boolv2 = true
                    })
            })
    })

    if (dado2 === '') boolv2 = true;

    const bool = (boolv1 && boolv2) === true ? true : false;
    return bool;
}


/* 
params: surveys, dado1, dado2
return: array com os dados de complexidade, no caso os itens necessários para verificação, eg. ['fezestagio = true', 'and', 'qtdestagios > 1']
        ou null caso não haja complexidade
isObject = um array para verificar se o dado é um objeto, eg. [{value: 'fezestagio', text: 'Fez estágio'}]
visibleIf = uma variável para armazenar uma string com o valor do visibleIf, o visibleIf é um campo existente em algumas questões que tornam 
        ela visível apenas se a condição for atendida
*/

const verificaComplexidade = (surveys, dado1) => {

    let isObject = [];
    let visibleIf = '';

    const questions = returnSurveyQuestions(surveys);

    questions.map((question) => {
        if (question.name === dado1) {
            if (Array.isArray(question.choices))
                question.choices.map((choices) => {
                    if (typeof choices === 'object') {
                        isObject.push({ value: choices.value, text: choices.text });
                    }
                })
            if (question.visibleIf) visibleIf = question.visibleIf;
        }
    })


    if (visibleIf === '' || visibleIf === null || visibleIf === undefined) return null;

    if (visibleIf.includes('and')) {
        const value = visibleIf.split(' and ');

        value[0] = value[0].replace(/[{$}]/g, '');

        value[1] = value[1].replace(/[{$}]/g, '');

        const value1 = separaChaveValor(value[0]);
        const value2 = separaChaveValor(value[1]);

        if (isObject.length !== 0) return [value1, 'and', value2, isObject];

        return [value1, 'and', value2];
    }

    visibleIf = separaChaveValor(visibleIf);
    visibleIf.push(isObject);

    return visibleIf;
}


export default Charts;