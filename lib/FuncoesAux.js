export function capitalizeWords(frase) {
    const palavras = frase.split(" ");

    for (let i = 0; i < palavras.length; i++) {
        const primeiraLetra = palavras[i][0].toUpperCase();
        const restoDaPalavra = palavras[i].slice(1).toLowerCase();

        palavras[i] = primeiraLetra + restoDaPalavra;
    }

    return palavras.join(" ");
}


export const getSurveyResult = (surveyResults) => {
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