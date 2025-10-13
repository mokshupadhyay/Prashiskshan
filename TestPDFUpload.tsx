import React from 'react';
import { View, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import DocumentPicker from 'react-native-document-picker';

export const TestPDFUpload = () => {
    const testDocumentPicker = async () => {
        try {
            console.log('Testing document picker...');

            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf],
                allowMultiSelection: false,
            });

            console.log('Document picker result:', result);
            Alert.alert('Success!', `Selected: ${result[0].name}\nSize: ${result[0].size} bytes`);
        } catch (error) {
            if (DocumentPicker.isCancel(error)) {
                console.log('User cancelled');
                return;
            }

            console.error('Document picker error:', error);
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={testDocumentPicker}>
                <Text style={styles.buttonText}>Test PDF Picker</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    button: {
        backgroundColor: '#3b82f6',
        padding: 16,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

