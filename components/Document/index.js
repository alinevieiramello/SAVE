import React from 'react';
import { Document, Page, View, StyleSheet } from '@react-pdf/renderer';
import Charts from '../Charts';
import { useState } from 'react';



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
    
    const [datas, setDatas] = useState([]);


    
    return (

        <Document style={styles.document}>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    
                    {data.map((item, index) => {
                        <Charts buttonVisibility={false} surveys={surveys} key={index} editavel={item.editar} title={item.title} dado1={item.dado1} dado2={item.dado2} tipoChart={item.tipoChart} surveyResult={surveyResults} filtro={filtro} filtro2={filtro2} />
                    })}
                    
                </View>
            </Page>
        </Document>

    )
};

export default MyDocument;