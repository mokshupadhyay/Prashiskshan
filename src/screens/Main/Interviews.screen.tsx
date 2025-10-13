import React, { FC, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/MainNavigator';

type InterviewsNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Interviews'>;

interface Interview {
    id: string;
    candidateName: string;
    position: string;
    date: string;
    time: string;
    type: 'video' | 'phone' | 'in-person';
    status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
    interviewer: string;
    duration: string;
}

const mockInterviews: Interview[] = [
    {
        id: '1',
        candidateName: 'Arjun Sharma',
        position: 'Frontend Developer Intern',
        date: '2024-01-25',
        time: '10:00 AM',
        type: 'video',
        status: 'scheduled',
        interviewer: 'John Smith',
        duration: '45 mins'
    },
    {
        id: '2',
        candidateName: 'Priya Patel',
        position: 'Data Science Intern',
        date: '2024-01-25',
        time: '2:00 PM',
        type: 'video',
        status: 'scheduled',
        interviewer: 'Sarah Johnson',
        duration: '60 mins'
    },
    {
        id: '3',
        candidateName: 'Rahul Kumar',
        position: 'Mobile App Developer',
        date: '2024-01-24',
        time: '11:00 AM',
        type: 'phone',
        status: 'completed',
        interviewer: 'Mike Wilson',
        duration: '30 mins'
    },
    {
        id: '4',
        candidateName: 'Sneha Gupta',
        position: 'Digital Marketing Intern',
        date: '2024-01-26',
        time: '3:00 PM',
        type: 'in-person',
        status: 'scheduled',
        interviewer: 'Lisa Chen',
        duration: '45 mins'
    }
];

export const Interviews: FC = () => {
    const navigation = useNavigation<InterviewsNavigationProp>();
    const [interviews, setInterviews] = useState<Interview[]>(mockInterviews);

    const getStatusColor = (status: Interview['status']) => {
        switch (status) {
            case 'scheduled': return '#3b82f6';
            case 'completed': return '#10b981';
            case 'cancelled': return '#ef4444';
            case 'rescheduled': return '#f59e0b';
            default: return '#6b7280';
        }
    };

    const getTypeIcon = (type: Interview['type']) => {
        switch (type) {
            case 'video': return 'video-camera';
            case 'phone': return 'phone';
            case 'in-person': return 'map-marker';
            default: return 'calendar';
        }
    };

    const handleInterviewAction = (interviewId: string, action: 'reschedule' | 'cancel' | 'complete') => {
        Alert.alert(
            'Confirm Action',
            `Are you sure you want to ${action} this interview?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm',
                    onPress: () => {
                        setInterviews(prev => prev.map(interview =>
                            interview.id === interviewId
                                ? { ...interview, status: action === 'reschedule' ? 'rescheduled' : action === 'cancel' ? 'cancelled' : 'completed' }
                                : interview
                        ));
                        Alert.alert('Success', `Interview ${action}d successfully`);
                    }
                }
            ]
        );
    };

    const InterviewCard = ({ interview }: { interview: Interview }) => (
        <View style={styles.interviewCard}>
            <View style={styles.cardHeader}>
                <View style={styles.candidateInfo}>
                    <Text style={styles.candidateName}>{interview.candidateName}</Text>
                    <Text style={styles.position}>{interview.position}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(interview.status)}15` }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(interview.status) }]}>
                        {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                    </Text>
                </View>
            </View>

            <View style={styles.interviewDetails}>
                <View style={styles.detailRow}>
                    <Icon name="calendar" size={16} color="#64748b" />
                    <Text style={styles.detailText}>{interview.date}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Icon name="clock-o" size={16} color="#64748b" />
                    <Text style={styles.detailText}>{interview.time} ({interview.duration})</Text>
                </View>
                <View style={styles.detailRow}>
                    <Icon name={getTypeIcon(interview.type)} size={16} color="#64748b" />
                    <Text style={styles.detailText}>
                        {interview.type.charAt(0).toUpperCase() + interview.type.slice(1).replace('-', ' ')}
                    </Text>
                </View>
                <View style={styles.detailRow}>
                    <Icon name="user" size={16} color="#64748b" />
                    <Text style={styles.detailText}>Interviewer: {interview.interviewer}</Text>
                </View>
            </View>

            {interview.status === 'scheduled' && (
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.rescheduleButton]}
                        onPress={() => handleInterviewAction(interview.id, 'reschedule')}
                    >
                        <Icon name="calendar" size={14} color="#f59e0b" />
                        <Text style={[styles.actionButtonText, { color: '#f59e0b' }]}>Reschedule</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.completeButton]}
                        onPress={() => handleInterviewAction(interview.id, 'complete')}
                    >
                        <Icon name="check" size={14} color="#fff" />
                        <Text style={[styles.actionButtonText, { color: '#fff' }]}>Complete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.cancelButton]}
                        onPress={() => handleInterviewAction(interview.id, 'cancel')}
                    >
                        <Icon name="times" size={14} color="#ef4444" />
                        <Text style={[styles.actionButtonText, { color: '#ef4444' }]}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    const scheduledCount = interviews.filter(i => i.status === 'scheduled').length;
    const completedCount = interviews.filter(i => i.status === 'completed').length;
    const cancelledCount = interviews.filter(i => i.status === 'cancelled').length;

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
                <Text style={styles.title}>Interviews</Text>
                <TouchableOpacity style={styles.addButton}>
                    <Icon name="plus" size={20} color="#8b5cf6" />
                </TouchableOpacity>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
                <View style={[styles.statCard, { borderLeftColor: '#3b82f6' }]}>
                    <Text style={styles.statNumber}>{scheduledCount}</Text>
                    <Text style={styles.statLabel}>Scheduled</Text>
                </View>
                <View style={[styles.statCard, { borderLeftColor: '#10b981' }]}>
                    <Text style={styles.statNumber}>{completedCount}</Text>
                    <Text style={styles.statLabel}>Completed</Text>
                </View>
                <View style={[styles.statCard, { borderLeftColor: '#ef4444' }]}>
                    <Text style={styles.statNumber}>{cancelledCount}</Text>
                    <Text style={styles.statLabel}>Cancelled</Text>
                </View>
            </View>

            {/* Interviews List */}
            <ScrollView style={styles.interviewsList} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>Upcoming & Recent Interviews</Text>
                {interviews.map((interview) => (
                    <InterviewCard key={interview.id} interview={interview} />
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
    addButton: {
        padding: 8,
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
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
        fontSize: 14,
        color: '#64748b',
    },
    interviewsList: {
        flex: 1,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 16,
    },
    interviewCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    candidateInfo: {
        flex: 1,
    },
    candidateName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 4,
    },
    position: {
        fontSize: 14,
        color: '#64748b',
    },
    statusBadge: {
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    interviewDetails: {
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailText: {
        fontSize: 14,
        color: '#64748b',
        marginLeft: 12,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 8,
        gap: 4,
    },
    rescheduleButton: {
        backgroundColor: '#fef3c7',
        borderWidth: 1,
        borderColor: '#fbbf24',
    },
    completeButton: {
        backgroundColor: '#10b981',
    },
    cancelButton: {
        backgroundColor: '#fef2f2',
        borderWidth: 1,
        borderColor: '#fecaca',
    },
    actionButtonText: {
        fontSize: 12,
        fontWeight: '600',
    },
});
