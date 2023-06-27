export function capitalizeWords(frase) {
    const palavras = frase.split(" ");

    for (let i = 0; i < palavras.length; i++) {
        const primeiraLetra = palavras[i][0].toUpperCase();
        const restoDaPalavra = palavras[i].slice(1).toLowerCase();

        palavras[i] = primeiraLetra + restoDaPalavra;
    }

    return palavras.join(" ");
}


export const listaFiltros = (surveys) => {
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


export const verificaFiltro = (dado1, dado2, filtro1, filtro2, surveys) => {

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




export const isComplex = (surveys, dado1, dado2) => {
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


export const separaChaveValor = (item) => {
    const value = item.split(' = ');
    value[0] = value[0].replace(/[{$}]/g, '');
    value[1] = value[1].replace(/['$']/g, '');

    return value;
}

export const calculaObjetos = (objetos, valueText, key) => {
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

export const isAnd = (values) => {
    if (values[1] === 'and') return true;
    return false;
}

export const buscaObjetos = (objeto, arr) => {

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



export function isConditional(objeto, dado2) {

    let bool = false;

    objeto.forEach((value) => {
        if (_.get(value, dado2) === ('Sim' || 'Não')) {
            bool = true
        }
    })

    return bool;
}

export function countWithConditional(objeto, key, key2) {
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



export function countByKeys(jsonArray, groupByKey, countKeys) {
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

export function countByKey(jsonArray, groupByKey) {
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


