
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


export default function Charts({ buttonVisibility, surveyResult, dado1, dado2, tipoChart, editavel, title, surveys, filtro, filtro2 }) {

    const [isEditing, setEditing] = useState(false);
    const [dataKey, setDataKey] = useState([]);
    const [isLoaded, setLoaded] = useState(false);
    const [complex, setComplex] = useState(isComplex(surveys, dado1, dado2));
    const [filtrado, setFiltrado] = useState(verificaFiltro(dado1, dado2, filtro, filtro2, surveys));
    const ref = useRef(null);
    let dataKey3 = '';
    let dataKey4 = '';



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



            if (isAnd(complex)) {

                let arr = buscaObjetos(surveyResult, complex);

                dataKey3 = arr[0];

                arr = countByKey(arr[1], dado1);

                return arr;

            } if (dado2 === '') {



                let arr = buscaObjetos(surveyResult, complex);

                if (obj.length > 0) {

                    arr = calculaObjetos(arr, obj, dado1)

                    return arr;

                } else {
                    arr = countByKey(arr, dado1);


                    return arr;
                }

            } else {

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
            <Box display={'grid'} gridTemplateRows={'50px 500px 70px'} gridTemplateColumns={'1fr'} maxHeight={'700px'} marginBottom={30} marginTop={10} paddingTop={-20} justifyContent={'center'}>
                <Text justifySelf={'center'} gridRow={1} marginBottom={20}>{title}</Text>
                <Box ref={ref} gridRow={2} w={tipoChart === 'radar' ? '900px' : '1fr'} gridColumn={1}>

                    <Chart type={tipoChart} data={arr.data} height={500} width={500} dataKey={tipoChart === 'bar' && dado2 === '' ? 'value' : arr.dataKey} dataKey2={arr.dataKey2} dataKey3={dataKey3} dataKey4={dataKey4} />
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



    return (
        <>
            {filtrado ? (isLoaded && isEditing ? renderEdit() : renderShape()) : null}
        </>
    )
}


/*
------------------------------------------------------Funções Auxiliares de busca-------------------------------------------------------------------------------
*/
function capitalizeWords(frase) {
    const palavras = frase.split(" ");
  
    for (let i = 0; i < palavras.length; i++) {
      const primeiraLetra = palavras[i][0].toUpperCase();
      const restoDaPalavra = palavras[i].slice(1).toLowerCase();
  
      palavras[i] = primeiraLetra + restoDaPalavra;
    }
  
    return palavras.join(" ");
  }

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




const isComplex = (surveys, dado1, dado2) => {
    let isObject = [];
    let visibleIf = '';

    surveys.map((survey) => {
        Object.keys((survey)).forEach((key) => {

            if (Array.isArray(survey[key]))
                Object.keys(survey[key]).forEach((key2) => {

                    Object.keys(survey[key][key2]).forEach((key3) => {

                        if (Array.isArray(survey[key][key2][key3]))
                            survey[key][key2][key3].map((it) => {

                                if (it.name === dado1) {
                                    if (Array.isArray(it.choices)) {
                                        it.choices.map((it2) => {
                                            if (typeof it2 === 'object') {
                                                isObject.push({ value: it2.value, text: it2.text });
                                            }
                                        })
                                    }

                                    if (it.visibleIf) visibleIf = it.visibleIf;
                                }

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

        if (isObject.length !== 0) return [value1, 'and', value2, isObject];

        return [value1, 'and', value2];
    }

    visibleIf = separaChaveValor(visibleIf);
    visibleIf.push(isObject);

    return visibleIf;
}


const separaChaveValor = (item) => {
    const value = item.split(' = ');
    value[0] = value[0].replace(/[{$}]/g, '');
    value[1] = value[1].replace(/['$']/g, '');

    return value;
}

const calculaObjetos = (objetos, valueText, key) => {
    const counter = {};
    objetos.forEach(obj => {
        valueText.forEach(vT => {

            const groupValue = obj[vT.value];


            if (groupValue === "Sim") {

                if (!counter[vT.value]) {
                    counter[vT.value] = {};
                    counter[vT.value]['name'] = vT.text;
                    counter[vT.value]['value'] = 1;

                    // if(vT.value.includes('[SQ')) {
                    //     let tmp = vT.value.replace(']', '');
                    //     tmp = tmp.concat('comment]');
                    //     tmp = obj[tmp];
                    //     const ocorrencias = (tmp.match(/, A-Z/g) || tmp.match(/ e A-Z/g) || []).length;
                    //     counter[vT.value]['value'] += ocorrencias - 1;
                    // }  
                } else {
                    counter[vT.value]['value'] += 1;
                }
            }
            // counter[groupValue][value] = (counter[groupValue][value] || 0) + (value ? 1 : 0);
        })
    });
    return Object.values(counter);
}

const isAnd = (values) => {
    if (values[1] === 'and') return true;
    return false;
}

const buscaObjetos = (objeto, arr) => {

    const array = [];

    const [chave, valor] = arr;

    if (Array.isArray(chave)) {

        const [chave, and, valor] = arr

        const [chave1, valor1] = chave;
        const [chave2, valor2] = valor;

        // console.log(chave1, valor1, chave2, valor2)

        objeto.forEach((value) => {
            if (value[chave1] === valor1) {

                if (value[chave2] === valor2) {

                    array.push(value);
                }
            }
        })


        return [valor2, array];

    }

    objeto.forEach((value) => {
        if (value[chave] === valor) {
            array.push(value)
        }
    });

    return array;
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
        } else if (obj[groupByKey] === 'other') {
            if (obj[groupByKey.concat('[other]')] !== '') {

                if (ocorrencias['Outros']) {
                    ocorrencias['Outros'].value += 1;
                } else {
                    ocorrencias['Outros'] = { name: 'Outros', value: 1 };
                }
            }
        }
    });

    return Object.values(ocorrencias);
}




