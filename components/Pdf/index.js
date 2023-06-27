import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { PDFViewer } from '@react-pdf/renderer';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogOverlay, useDisclosure } from '@chakra-ui/react';



// Create styles
const styles = StyleSheet.create({
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
const MyDocument = ({ components }) => {

    console.log(components)

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text>Section #1</Text>
                </View>
                <View style={styles.section}>
                    <Text>Section #2</Text>
                </View>
            </Page>
        </Document>
    )
};




const PDF = ({ components }) => {
    
    const { isOpen, cancelRef, onClose } = useDisclosure(false);

    console.log('entrou em pdf')

    return (
        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogBody>
                        <PDFViewer>
                            <MyDocument components={components} />
                        </PDFViewer>
                    </AlertDialogBody>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>

    )
};

export default PDF;