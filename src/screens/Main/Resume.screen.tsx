import React, { FC, useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Alert,
    Dimensions,
    Platform,
    PermissionsAndroid,
    FlatList,
    NativeModules,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/MainNavigator';
import { useAuth } from '../../context/AuthContext';
import Pdf from 'react-native-pdf';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { DocumentPickerModule } = NativeModules;

type ResumeNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Resume'>;

const { width } = Dimensions.get('window');

interface PDFInfo {
    name: string;
    path: string;
    size: number;
    uploadDate: string;
}

interface ResumeSection {
    id: string;
    title: string;
    content: string;
    icon: string;
}

export const Resume: FC = () => {
    const navigation = useNavigation<ResumeNavigationProp>();
    const { user, updateUser } = useAuth();
    const [pdfs, setPdfs] = useState<PDFInfo[]>([]);
    const [selectedPdf, setSelectedPdf] = useState<PDFInfo | null>(null);
    const [showPdfView, setShowPdfView] = useState(false);
    const [showPdfList] = useState(true);

    // Load saved PDFs on component mount
    const loadSavedPdfs = useCallback(async () => {
        try {
            const existingPdfs = await AsyncStorage.getItem('uploadedPdfs');
            if (existingPdfs) {
                const pdfList = JSON.parse(existingPdfs);
                console.log('Loaded PDFs from storage:', pdfList);
                setPdfs(pdfList);

                // If user has a resume URL, make sure it's in the list
                if (user?.resumeUrl && pdfList.length > 0) {
                    const currentResume = pdfList.find((pdf: PDFInfo) => pdf.path === user.resumeUrl);
                    if (currentResume) {
                        setSelectedPdf(currentResume);
                    }
                }
            }
        } catch (error) {
            console.error('Error loading PDFs:', error);
        }
    }, [user?.resumeUrl]);

    useEffect(() => {
        loadSavedPdfs();
    }, [loadSavedPdfs]);

    // Mock resume data - in real app this would come from user profile
    const resumeData: ResumeSection[] = [
        {
            id: 'personal',
            title: 'Personal Information',
            content: `${user?.firstName} ${user?.lastName}\n${user?.email}\n${user?.phone || 'Phone not provided'}`,
            icon: 'user'
        },
        {
            id: 'education',
            title: 'Education',
            content: `${user?.course || 'Computer Science Engineering'}\n${user?.college || 'IIT Delhi'}\n${user?.year || '3rd Year'}\nCGPA: ${user?.cgpa || '8.5'}/10`,
            icon: 'graduation-cap'
        },
        {
            id: 'skills',
            title: 'Skills',
            content: user?.skills?.join(', ') || 'React, JavaScript, Python, Node.js, MongoDB, Git',
            icon: 'code'
        },
        {
            id: 'experience',
            title: 'Experience',
            content: 'Frontend Developer Intern\nTechStart Solutions (3 months)\n• Developed responsive web applications\n• Collaborated with design team\n• Improved application performance by 30%',
            icon: 'briefcase'
        },
        {
            id: 'projects',
            title: 'Projects',
            content: 'E-commerce Web App\n• Built with React and Node.js\n• Implemented payment integration\n• User authentication system\n\nTask Management App\n• React Native mobile app\n• Real-time notifications\n• Cloud synchronization',
            icon: 'folder-open'
        }
    ];

    const requestStoragePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                // Request multiple permissions for image picker and file access
                const permissions = [
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                ];

                // For Android 13+ (API level 33+), we need different permissions
                if (Platform.Version >= 33) {
                    permissions.push(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES);
                }

                const granted = await PermissionsAndroid.requestMultiple(permissions);

                console.log('Permission results:', granted);

                // Check if all required permissions are granted
                const allPermissionsGranted = Object.values(granted).every(
                    permission => permission === PermissionsAndroid.RESULTS.GRANTED
                );

                return allPermissionsGranted;
            } catch (err) {
                console.warn('Permission request error:', err);
                return false;
            }
        }
        return true; // iOS doesn't need runtime permission for image picker
    };

    const pickPDF = async () => {
        try {
            console.log('=== STARTING PDF UPLOAD ===');

            // Request storage permission on Android
            const hasPermission = await requestStoragePermission();
            console.log('Storage permission granted:', hasPermission);

            if (!hasPermission) {
                Alert.alert('Permission Required', 'Storage permission is required to upload documents');
                return;
            }

            console.log('Opening PDF picker...');

            // Use our custom document picker for PDF files
            const result = await DocumentPickerModule.pickDocument();

            console.log('Selected file details:', result);

            // Check file size (5MB limit)
            if (result.size && result.size > 5 * 1024 * 1024) {
                Alert.alert('File Too Large', 'Please select a PDF file smaller than 5MB');
                return;
            }

            // Create a unique filename
            const timestamp = new Date().getTime();
            const fileExtension = result.name?.split('.').pop() || 'pdf';
            const newFileName = `resume_${timestamp}.${fileExtension}`;

            // Define the destination path in the app's document directory
            const destPath = `${RNFS.DocumentDirectoryPath}/${newFileName}`;

            console.log('File copy details:', {
                from: result.uri,
                to: destPath,
                originalName: result.name,
                newName: newFileName
            });

            // Copy the file to app's document directory
            console.log('Starting file copy...');
            await RNFS.copyFile(result.uri, destPath);
            console.log('File copy completed');

            // Verify file exists
            const fileExists = await RNFS.exists(destPath);
            console.log('File exists after copy:', fileExists);

            if (!fileExists) {
                throw new Error('File copy verification failed - file does not exist at destination');
            }

            // Get file stats
            const fileStats = await RNFS.stat(destPath);
            console.log('Copied file stats:', fileStats);

            // Save PDF info to AsyncStorage for persistence
            const pdfInfo: PDFInfo = {
                name: result.name || 'Unknown',
                path: destPath,
                size: result.size || 0,
                uploadDate: new Date().toISOString(),
            };

            const existingPdfs = await AsyncStorage.getItem('uploadedPdfs');
            const pdfList = existingPdfs ? JSON.parse(existingPdfs) : [];
            pdfList.push(pdfInfo);
            await AsyncStorage.setItem('uploadedPdfs', JSON.stringify(pdfList));

            // Update local state
            setPdfs(pdfList);

            // Update user with new resume path (set as primary resume)
            await updateUser({
                resumeUrl: destPath
            });

            Alert.alert('Success', `PDF "${result.name}" uploaded successfully!`);
            console.log('=== PDF UPLOAD COMPLETED SUCCESSFULLY ===');

        } catch (error) {
            if (error.code === 'DOCUMENT_PICKER_CANCELLED') {
                console.log('User cancelled document picker');
                return;
            }

            console.error('=== PDF UPLOAD ERROR ===');
            console.error('Error details:', error);
            Alert.alert(
                'Upload Failed',
                `Failed to upload PDF. Please try again.\n\nError: ${(error as Error).message || 'Unknown error'}`
            );
        }
    };

    const deletePdf = async (pdfToDelete: PDFInfo) => {
        Alert.alert(
            'Delete PDF',
            `Are you sure you want to delete "${pdfToDelete.name}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // Delete file from filesystem
                            const fileExists = await RNFS.exists(pdfToDelete.path);
                            if (fileExists) {
                                await RNFS.unlink(pdfToDelete.path);
                            }

                            // Remove from AsyncStorage
                            const updatedPdfs = pdfs.filter(pdf => pdf.path !== pdfToDelete.path);
                            await AsyncStorage.setItem('uploadedPdfs', JSON.stringify(updatedPdfs));
                            setPdfs(updatedPdfs);

                            // If this was the selected PDF, clear selection
                            if (selectedPdf?.path === pdfToDelete.path) {
                                setSelectedPdf(null);
                                setShowPdfView(false);
                            }

                            // If this was the user's primary resume, clear it
                            if (user?.resumeUrl === pdfToDelete.path) {
                                await updateUser({ resumeUrl: undefined });
                            }

                            Alert.alert('Success', 'PDF deleted successfully');
                        } catch (error) {
                            console.error('Error deleting PDF:', error);
                            Alert.alert('Error', 'Failed to delete PDF');
                        }
                    }
                }
            ]
        );
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const setPrimaryResume = async (pdf: PDFInfo) => {
        try {
            await updateUser({ resumeUrl: pdf.path });
            Alert.alert('Success', `"${pdf.name}" set as primary resume`);
        } catch (error) {
            console.error('Error setting primary resume:', error);
            Alert.alert('Error', 'Failed to set primary resume');
        }
    };

    const ResumeSection = ({ section }: { section: ResumeSection }) => (
        <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
                <Icon name={section.icon} size={20} color="#3b82f6" />
                <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <Text style={styles.sectionContent}>{section.content}</Text>
        </View>
    );

    const PDFListItem = ({ item }: { item: PDFInfo }) => (
        <View style={styles.pdfItem}>
            <TouchableOpacity
                style={styles.pdfItemContent}
                onPress={() => {
                    setSelectedPdf(item);
                    setShowPdfView(true);
                }}
            >
                <View style={styles.pdfIcon}>
                    <Icon name="file-pdf-o" size={24} color="#ef4444" />
                </View>
                <View style={styles.pdfInfo}>
                    <Text style={styles.pdfName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.pdfDetails}>
                        {formatFileSize(item.size)} • {formatDate(item.uploadDate)}
                    </Text>
                    {user?.resumeUrl === item.path && (
                        <Text style={styles.primaryLabel}>Primary Resume</Text>
                    )}
                </View>
            </TouchableOpacity>
            <View style={styles.pdfActions}>
                {user?.resumeUrl !== item.path && (
                    <TouchableOpacity
                        style={styles.actionIcon}
                        onPress={() => setPrimaryResume(item)}
                    >
                        <Icon name="star-o" size={16} color="#f59e0b" />
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={styles.actionIcon}
                    onPress={() => deletePdf(item)}
                >
                    <Icon name="trash" size={16} color="#ef4444" />
                </TouchableOpacity>
            </View>
        </View>
    );

    // PDF Viewer Component
    if (showPdfView && selectedPdf) {
        return (
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => {
                            setShowPdfView(false);
                            setSelectedPdf(null);
                        }}
                    >
                        <Icon name="arrow-left" size={24} color="#1e293b" />
                    </TouchableOpacity>
                    <Text style={styles.title} numberOfLines={1}>{selectedPdf.name}</Text>
                    <View style={styles.placeholder} />
                </View>

                {/* PDF Viewer */}
                <Pdf
                    source={{ uri: `file://${selectedPdf.path}`, cache: true }}
                    onLoadComplete={(numberOfPages, filePath) => {
                        console.log(`PDF loaded successfully - Pages: ${numberOfPages}, Path: ${filePath}`);
                    }}
                    onPageChanged={(page, numberOfPages) => {
                        console.log(`Current page: ${page} of ${numberOfPages}`);
                    }}
                    onError={(error) => {
                        console.error('PDF viewing error:', error);
                        console.error('Attempted to load PDF from:', selectedPdf.path);
                        Alert.alert(
                            'PDF Error',
                            `Failed to load PDF. The file might be corrupted or moved.\n\nError: ${(error as Error).message || 'Unknown error'}`
                        );
                        setShowPdfView(false);
                        setSelectedPdf(null);
                    }}
                    style={styles.pdf}
                />
            </View>
        );
    }

    // Main PDF Management Screen
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-left" size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text style={styles.title}>My PDFs</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={pickPDF}
                >
                    <Icon name="plus" size={20} color="#3b82f6" />
                </TouchableOpacity>
            </View>

            {pdfs.length === 0 ? (
                // No PDFs State
                <View style={styles.noPdfsContainer}>
                    <View style={styles.noPdfsIcon}>
                        <Icon name="file-pdf-o" size={64} color="#9ca3af" />
                    </View>
                    <Text style={styles.noPdfsTitle}>No PDFs Found</Text>
                    <Text style={styles.noPdfsSubtitle}>
                        Upload your resume and other documents to showcase your skills and experience
                    </Text>

                    <TouchableOpacity
                        style={styles.uploadButton}
                        onPress={pickPDF}
                    >
                        <Icon name="upload" size={20} color="#fff" />
                        <Text style={styles.uploadButtonText}>Upload PDF</Text>
                    </TouchableOpacity>

                    <View style={styles.supportedFormats}>
                        <Text style={styles.supportedFormatsTitle}>Supported format:</Text>
                        <Text style={styles.supportedFormatsList}>PDF (Max 5MB)</Text>
                    </View>
                </View>
            ) : (
                // PDFs List
                <View style={styles.content}>
                    <View style={styles.statsContainer}>
                        <Text style={styles.statsText}>
                            {pdfs.length} PDF{pdfs.length !== 1 ? 's' : ''} uploaded
                        </Text>
                        <TouchableOpacity
                            style={styles.addSmallButton}
                            onPress={pickPDF}
                        >
                            <Icon name="plus" size={14} color="#3b82f6" />
                            <Text style={styles.addSmallButtonText}>Add PDF</Text>
                        </TouchableOpacity>
                    </View>

                    <View>
                        <FlatList
                            data={pdfs}
                            keyExtractor={(item) => item.path}
                            renderItem={({ item }) => <PDFListItem item={item} />}
                            contentContainerStyle={styles.pdfList}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>

                    {/* Resume Preview Section */}
                    {user?.resumeUrl && (
                        <View style={styles.resumePreviewSection}>
                            <Text style={styles.resumePreviewTitle}>Resume Preview</Text>
                            <ScrollView style={styles.resumeContent} showsVerticalScrollIndicator={false}>
                                <View style={styles.resumeHeader}>
                                    <View style={styles.profileSection}>
                                        <View style={styles.avatarContainer}>
                                            <Text style={styles.avatarText}>
                                                {user?.firstName?.[0]}{user?.lastName?.[0]}
                                            </Text>
                                        </View>
                                        <View style={styles.profileInfo}>
                                            <Text style={styles.profileName}>
                                                {user?.firstName} {user?.lastName}
                                            </Text>
                                            <Text style={styles.profileRole}>
                                                {user?.course || 'Computer Science Student'}
                                            </Text>
                                            <Text style={styles.profileLocation}>
                                                {user?.college || 'IIT Delhi'}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                {resumeData.map((section) => (
                                    <ResumeSection key={section.id} section={section} />
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    backButton: {
        padding: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1e293b',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 20,
    },
    placeholder: {
        width: 40,
    },
    addButton: {
        padding: 8,
    },
    noPdfsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    noPdfsIcon: {
        marginBottom: 24,
    },
    noPdfsTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 12,
        textAlign: 'center',
    },
    noPdfsSubtitle: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    uploadButton: {
        backgroundColor: '#3b82f6',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
        marginBottom: 24,
    },
    uploadButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    supportedFormats: {
        alignItems: 'center',
    },
    supportedFormatsTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 4,
    },
    supportedFormatsList: {
        fontSize: 12,
        color: '#9ca3af',
    },
    content: {
        flex: 1,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    statsText: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500',
    },
    addSmallButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#3b82f6',
        gap: 4,
    },
    addSmallButtonText: {
        fontSize: 12,
        color: '#3b82f6',
        fontWeight: '500',
    },
    pdfList: {
        padding: 20,
    },
    pdfItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    pdfItemContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    pdfIcon: {
        marginRight: 12,
    },
    pdfInfo: {
        flex: 1,
    },
    pdfName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 4,
    },
    pdfDetails: {
        fontSize: 12,
        color: '#64748b',
        marginBottom: 2,
    },
    primaryLabel: {
        fontSize: 10,
        color: '#10b981',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    pdfActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionIcon: {
        padding: 8,
    },
    resumePreviewSection: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        maxHeight: '100%',
    },
    resumePreviewTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        padding: 16,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    resumeContent: {
        paddingHorizontal: 16,
    },
    resumeHeader: {
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        padding: 16,
        marginTop: 12,
        marginBottom: 12,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#3b82f6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 2,
    },
    profileRole: {
        fontSize: 12,
        color: '#3b82f6',
        fontWeight: '500',
        marginBottom: 2,
    },
    profileLocation: {
        fontSize: 10,
        color: '#64748b',
    },
    sectionCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1e293b',
    },
    sectionContent: {
        fontSize: 11,
        color: '#374151',
        lineHeight: 16,
    },
    pdf: {
        flex: 1,
        width: width,
        backgroundColor: '#f8fafc',
    },
});