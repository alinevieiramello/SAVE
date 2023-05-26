
import {
    Box, GridItem, HStack, Button, Icon, Text, Stack, Collapse, Input
} from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';
import Chart from './Chart';
import { useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { format } from 'date-fns';
const _ = require('underscore')

/*@params:  dado1 = nome do 1 atributo a ser analisado
            dado2 = nome do 2 atributo a ser analisado
            surveyResult = json com todos os dados da collection surveyResult
            tipoChart = tipo de gráfico a ser exibido
            width = largura do gráfico
            height = altura do gráfico
*/
export default function Charts({ buttonVisibility, surveyResult, dado1, dado2, width, height, tipoChart, editavel, title, filtrado }) {

    const [isEditing, setEditing] = useState(false);
    const [dataKey, setDataKey] = useState([]);
    const [isLoaded, setLoaded] = useState(false);
    const ref = useRef(null);

    const getFileName = (fileType) => `${format(new Date(), `'${title}' -"dd-MM-yy"`)}.${fileType}`


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



    function procuraDadosnoBanco() {

        // if (isComplex(surveyResult, dado1, dado2)) {

        // }

        if (dado2 === '') {

            let array = countByKey(surveyResult, dado1);

            return array;
        } if (isConditional(surveyResult, dado2)) {

            let array = countWithConditional(surveyResult, dado1, dado2);

            return array;

        } else {

            let array = countByKeys(surveyResult, dado1, [dado2]);

            return array;
        }

    }

    function getDataKey() {
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

    useEffect(() => {

        if (dado2 !== '') {
            getDataKey()
        }
        setLoaded(true);

    }, [])

    const arr = {
        data: procuraDadosnoBanco(),
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
            <Box display={'grid'} gridTemplateRows={'50px 500px 70px'} gridTemplateColumns={'1fr'} maxHeight={'700px'} marginBottom={30} marginTop={10} paddingTop={-20}>
                <Text justifySelf={'center'} gridRow={1} marginBottom={20}>{title}</Text>
                <Box ref={ref} gridRow={2}>
                    <Chart type={tipoChart} data={arr.data} height={height} width={width} dataKey={arr.dataKey} dataKey2={arr.dataKey2} />
                </Box >
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
    }

    console.log(filtrado)

    return (
        <>
            {filtrado ? (isLoaded && isEditing ? renderEdit() : renderShape()) : null}
        </>
    )
}



function isConditional(objeto, dado2) {

    let bool = false;

    objeto.forEach((value) => {
        if (_.get(value, dado2) === ('Sim' || 'Não')) {
            bool = true
        }
    })

    return bool;
}

function countWithConditional(objeto, key, key2) {
    const counter = {};
    objeto.forEach(obj => {
        const groupValue = obj[key];

        if (!counter[groupValue]) {
            counter[groupValue] = {};
            counter[groupValue]['name'] = groupValue;
            counter[groupValue]['Sim'] = 0;
            counter[groupValue]['Não'] = 0;
        }

        const value = obj[key2];
        counter[groupValue][value] = (counter[groupValue][value] || 0) + (value ? 1 : 0);
    });
    return Object.values(counter);
}



function countByKeys(jsonArray, groupByKey, countKeys) {
    const counter = {};
    jsonArray.forEach(obj => {
        const groupValue = obj[groupByKey];

        if (!countKeys) {
            counter[groupValue] = {};
            counter[groupValue]['name'] = groupValue;
        }

        if (!counter[groupValue]) {
            counter[groupValue] = {};
            counter[groupValue]['name'] = groupValue;
        }


        countKeys.forEach(key => {
            const value = obj[key];
            counter[groupValue][value] = (counter[groupValue][value] || 0) + (value ? 1 : 0);
        });
    });
    return Object.values(counter);
}

function countByKey(jsonArray, groupByKey) {
    const ocorrencias = {};

    jsonArray.forEach(obj => {
        if (obj[groupByKey] !== '' && obj[groupByKey] !== 'other') {
            const groupValue = obj[groupByKey];

            if (ocorrencias[groupValue]) {
                ocorrencias[groupValue].value += 1;
            } else {
                ocorrencias[groupValue] = { name: groupValue, value: 1 };
            }
        }
    });

    return Object.values(ocorrencias);
}





function pesquisaComplexa(objeto, chave1, chave2) {

}
