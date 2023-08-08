import React from 'react';
import { Document, Page, View, StyleSheet, Text } from '@react-pdf/renderer';
import Charts from '../Charts';
import { useState, useEffect } from 'react';



// Create styles
const styles = StyleSheet.create({
    document: {
        width: '100%',
        height: '100%'
    },
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    }
});

// Create Document Component
const MyDocument = ({ data, surveys, surveyResults, filtro, filtro2 }) => {

    const [isLoaded, setLoaded] = useState(false);


    useEffect(() => {

        setLoaded(true);

    }, [0])
    return (
        <>
            {isLoaded &&
                <Document style={styles.document}>
                    <Page size="A4" style={styles.page}>
                        <View style={styles.section}>
                            <MyComponent/>
                            {/* <Text> */}
                                {/* <Charts isPdf={true} buttonVisibility={false} surveys={surveys} editavel={data[0].editar} title={data[0].titulo} dado1={data[0].dado1} dado2={data[0].dado2} tipoChart={data[0].tipoChart} surveyResult={surveyResults} filtro={filtro} filtro2={filtro2} /> */}
                            {/* </Text> */}
                            {/* {data.map((item, index) => { */}



                        </View>
                    </Page>
                </Document>
            }
        </>


    )
};


const MyComponent = () => {

    return (
        <div>
            <p>
                Teste
            </p>

        </div>
    )
}

export default MyDocument;