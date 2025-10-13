import React, { FC } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/MainNavigator';

type ReportsNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Reports'>;

export const Reports: FC = () => {
    const navigation = useNavigation<ReportsNavigationProp>();

    const reportTypes = [
        {
            id: 'candidate-analytics',
            title: 'Candidate Analytics',
            description: 'View detailed analytics on candidate applications and performance',
            icon: 'bar-chart',
            color: '#3b82f6'
        },
        {
            id: 'hiring-funnel',
            title: 'Hiring Funnel',
            description: 'Track candidates through the hiring process',
            icon: 'filter',
            color: '#10b981'
        },
        {
            id: 'interview-reports',
            title: 'Interview Reports',
            description: 'Detailed reports on interview outcomes and feedback',
            icon: 'users',
            color: '#f59e0b'
        },
        {
            id: 'performance-metrics',
            title: 'Performance Metrics',
            description: 'Key performance indicators for your recruitment process',
            icon: 'line-chart',
            color: '#8b5cf6'
        }
    ];

    const ReportCard = ({ report }: { report: typeof reportTypes[0] }) => (
        <TouchableOpacity style={styles.reportCard} activeOpacity={0.7}>
            <View style={[styles.iconContainer, { backgroundColor: `${report.color}15` }]}>
                <Icon name={report.icon} size={32} color={report.color} />
            </View>
            <View style={styles.reportContent}>
                <Text style={styles.reportTitle}>{report.title}</Text>
                <Text style={styles.reportDescription}>{report.description}</Text>
            </View>
            <Icon name="chevron-right" size={16} color="#9ca3af" />
        </TouchableOpacity>
    );

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
                <Text style={styles.title}>Reports & Analytics</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Stats Overview */}
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>156</Text>
                    <Text style={styles.statLabel}>Total Applications</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>23</Text>
                    <Text style={styles.statLabel}>Shortlisted</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>12</Text>
                    <Text style={styles.statLabel}>Interviewed</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>5</Text>
                    <Text style={styles.statLabel}>Hired</Text>
                </View>
            </View>

            {/* Reports List */}
            <ScrollView style={styles.reportsList} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>Available Reports</Text>
                {reportTypes.map((report) => (
                    <ReportCard key={report.id} report={report} />
                ))}
            </ScrollView>
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
    },
    placeholder: {
        width: 40,
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 20,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#64748b',
        textAlign: 'center',
    },
    reportsList: {
        flex: 1,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 16,
    },
    reportCard: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    reportContent: {
        flex: 1,
    },
    reportTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 4,
    },
    reportDescription: {
        fontSize: 14,
        color: '#64748b',
        lineHeight: 20,
    },
});
